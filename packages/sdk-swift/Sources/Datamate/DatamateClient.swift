import Foundation

public struct DatamateFlushResult: Equatable {
    public let error: String?
    public let remaining: Int
    public let sent: Int
    public let success: Bool

    public init(success: Bool, sent: Int, remaining: Int, error: String? = nil) {
        self.success = success
        self.sent = sent
        self.remaining = remaining
        self.error = error
    }
}

public actor DatamateClient {
    public let anonymousId: String
    public let sessionId: String

    private var configuration: DatamateConfiguration
    private var flushTask: Task<Void, Never>?
    private var queue: [DatamateEvent] = []
    private let transport: DatamateTransport

    public init(
        configuration: DatamateConfiguration,
        storage: DatamateStorage = UserDefaultsDatamateStorage()
    ) {
        self.init(
            configuration: configuration,
            storage: storage,
            transport: URLSessionDatamateTransport()
        )
    }

    init(
        configuration: DatamateConfiguration,
        storage: DatamateStorage,
        transport: DatamateTransport
    ) {
        self.configuration = configuration
        self.transport = transport
        anonymousId = Self.loadAnonymousId(from: storage)
        sessionId = Self.makeId(prefix: "sess")
    }

    deinit {
        flushTask?.cancel()
    }

    public func setEnabled(_ enabled: Bool) {
        configuration.enabled = enabled
    }

    public func track(
        _ name: String,
        properties: [String: DatamatePropertyValue] = [:],
        options: DatamateTrackOptions = DatamateTrackOptions()
    ) async {
        let eventName = name.trimmed
        guard configuration.canSend, (1...256).contains(eventName.count) else {
            return
        }

        queue.append(
            DatamateEvent(
                anonymousId: options.anonymousId ?? anonymousId,
                name: eventName,
                namespace: options.namespace ?? configuration.namespace,
                properties: properties.isEmpty ? nil : properties,
                sessionId: options.sessionId ?? sessionId,
                source: options.source ?? configuration.source,
                timestamp: Self.timestampMilliseconds(options.timestamp ?? Date()),
                websiteId: configuration.clientId
            )
        )

        trimQueueToLimit()

        if queue.count >= configuration.flushAt {
            _ = await flush()
        } else {
            scheduleFlush()
        }
    }

    public func trackScreen(
        _ screenName: String,
        properties: [String: DatamatePropertyValue] = [:],
        options: DatamateTrackOptions = DatamateTrackOptions()
    ) async {
        let screen = screenName.trimmed
        guard !screen.isEmpty else {
            return
        }

        var mergedProperties = properties
        mergedProperties["screen"] = .string(screen)
        await track("screen_view", properties: mergedProperties, options: options)
    }

    public func flush() async -> DatamateFlushResult {
        flushTask?.cancel()
        flushTask = nil

        guard configuration.canSend else {
            return DatamateFlushResult(
                success: true,
                sent: 0,
                remaining: queue.count
            )
        }

        var sent = 0

        while !queue.isEmpty {
            let batchSize = min(DatamateConfiguration.maximumBatchSize, queue.count)
            let batch = Array(queue.prefix(batchSize))
            queue.removeFirst(batchSize)

            do {
                try await transport.send(batch, apiURL: configuration.apiURL)
                sent += batchSize
            } catch {
                queue.insert(contentsOf: batch, at: 0)
                scheduleFlush()
                return DatamateFlushResult(
                    success: false,
                    sent: sent,
                    remaining: queue.count,
                    error: Self.message(for: error)
                )
            }
        }

        return DatamateFlushResult(success: true, sent: sent, remaining: 0)
    }

    func queuedEventCount() -> Int {
        queue.count
    }

    private func trimQueueToLimit() {
        let overflow = queue.count - configuration.maxQueueSize
        if overflow > 0 {
            queue.removeFirst(overflow)
        }
    }

    private func scheduleFlush() {
        guard configuration.canSend,
              configuration.flushInterval > 0,
              flushTask == nil,
              !queue.isEmpty
        else {
            return
        }

        let seconds = min(configuration.flushInterval, 86_400)
        let nanoseconds = UInt64(seconds * 1_000_000_000)
        flushTask = Task { [weak self] in
            do {
                try await Task.sleep(nanoseconds: nanoseconds)
            } catch {
                return
            }

            guard !Task.isCancelled else {
                return
            }

            await self?.flushFromTimer()
        }
    }

    private func flushFromTimer() async {
        flushTask = nil
        _ = await flush()
    }

    private static func loadAnonymousId(from storage: DatamateStorage) -> String {
        let key = "datamate.anonymous_id"
        if let stored = storage.string(forKey: key)?.trimmed, !stored.isEmpty {
            return stored
        }

        let id = makeId(prefix: "anon")
        storage.set(id, forKey: key)
        return id
    }

    private static func makeId(prefix: String) -> String {
        "\(prefix)_\(UUID().uuidString)"
    }

    private static func message(for error: Error) -> String {
        switch error {
        case DatamateError.encodingFailed(let message):
            return "Encoding failed: \(message)"
        case DatamateError.invalidResponse:
            return "Invalid response"
        case DatamateError.requestFailed(let message):
            return "Request failed: \(message)"
        case DatamateError.statusCode(let statusCode):
            return "HTTP \(statusCode)"
        default:
            return error.localizedDescription
        }
    }

    private static func timestampMilliseconds(_ date: Date) -> Int64 {
        Int64(date.timeIntervalSince1970 * 1_000)
    }
}

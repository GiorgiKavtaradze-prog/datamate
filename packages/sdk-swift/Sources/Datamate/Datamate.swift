import Foundation

public enum Datamate {
    private static let lock = NSLock()
    private static var sharedClient: DatamateClient?

    public static func configure(
        clientId: String,
        apiURL: URL = DatamateConfiguration.defaultAPIURL,
        source: String? = DatamateConfiguration.defaultSource,
        namespace: String? = nil,
        enabled: Bool = true,
        flushAt: Int = 10,
        flushInterval: TimeInterval = 2.0,
        maxQueueSize: Int = 1_000,
        storage: DatamateStorage = UserDefaultsDatamateStorage()
    ) {
        configure(
            DatamateConfiguration(
                clientId: clientId,
                apiURL: apiURL,
                source: source,
                namespace: namespace,
                enabled: enabled,
                flushAt: flushAt,
                flushInterval: flushInterval,
                maxQueueSize: maxQueueSize
            ),
            storage: storage
        )
    }

    public static func configure(
        _ configuration: DatamateConfiguration,
        storage: DatamateStorage = UserDefaultsDatamateStorage()
    ) {
        let client = DatamateClient(configuration: configuration, storage: storage)
        lock.withDatamateLock {
            sharedClient = client
        }
    }

    public static func track(
        _ name: String,
        properties: [String: DatamatePropertyValue] = [:],
        options: DatamateTrackOptions = DatamateTrackOptions()
    ) {
        guard let client = currentClient() else {
            return
        }

        Task {
            await client.track(name, properties: properties, options: options)
        }
    }

    public static func trackAsync(
        _ name: String,
        properties: [String: DatamatePropertyValue] = [:],
        options: DatamateTrackOptions = DatamateTrackOptions()
    ) async {
        guard let client = currentClient() else {
            return
        }

        await client.track(name, properties: properties, options: options)
    }

    public static func trackScreen(
        _ screenName: String,
        properties: [String: DatamatePropertyValue] = [:],
        options: DatamateTrackOptions = DatamateTrackOptions()
    ) {
        guard let client = currentClient() else {
            return
        }

        Task {
            await client.trackScreen(
                screenName,
                properties: properties,
                options: options
            )
        }
    }

    public static func trackScreenAsync(
        _ screenName: String,
        properties: [String: DatamatePropertyValue] = [:],
        options: DatamateTrackOptions = DatamateTrackOptions()
    ) async {
        guard let client = currentClient() else {
            return
        }

        await client.trackScreen(
            screenName,
            properties: properties,
            options: options
        )
    }

    public static func flush() async -> DatamateFlushResult {
        guard let client = currentClient() else {
            return DatamateFlushResult(success: true, sent: 0, remaining: 0)
        }
        return await client.flush()
    }

    public static func setEnabled(_ enabled: Bool) async {
        guard let client = currentClient() else {
            return
        }
        await client.setEnabled(enabled)
    }

    private static func currentClient() -> DatamateClient? {
        lock.withDatamateLock {
            sharedClient
        }
    }
}

private extension NSLock {
    func withDatamateLock<T>(_ body: () throws -> T) rethrows -> T {
        lock()
        defer { unlock() }
        return try body()
    }
}

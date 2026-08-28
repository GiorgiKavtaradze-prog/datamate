import Foundation

enum DatamateError: Error, Equatable {
    case encodingFailed(String)
    case invalidResponse
    case requestFailed(String)
    case statusCode(Int)
}

protocol DatamateTransport {
    func send(_ events: [DatamateEvent], apiURL: URL) async throws
}

final class URLSessionDatamateTransport: DatamateTransport {
    private let encoder: JSONEncoder
    private let session: URLSession

    init(session: URLSession = .shared, encoder: JSONEncoder = JSONEncoder()) {
        self.session = session
        self.encoder = encoder
    }

    func send(_ events: [DatamateEvent], apiURL: URL) async throws {
        var request = URLRequest(url: trackURL(from: apiURL))
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("datamate-swift/0.1.0", forHTTPHeaderField: "User-Agent")

        do {
            if events.count == 1, let event = events.first {
                request.httpBody = try encoder.encode(event)
            } else {
                request.httpBody = try encoder.encode(events)
            }
        } catch {
            throw DatamateError.encodingFailed(error.localizedDescription)
        }

        do {
            let (_, response) = try await session.data(for: request)
            guard let http = response as? HTTPURLResponse else {
                throw DatamateError.invalidResponse
            }
            guard (200..<300).contains(http.statusCode) else {
                throw DatamateError.statusCode(http.statusCode)
            }
        } catch let error as DatamateError {
            throw error
        } catch {
            throw DatamateError.requestFailed(error.localizedDescription)
        }
    }

    private func trackURL(from apiURL: URL) -> URL {
        if apiURL.lastPathComponent == "track" {
            return apiURL
        }
        return apiURL.appendingPathComponent("track")
    }
}

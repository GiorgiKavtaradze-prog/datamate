import Foundation

public protocol DatamateStorage: AnyObject {
    func set(_ value: String, forKey key: String)
    func string(forKey key: String) -> String?
}

public final class UserDefaultsDatamateStorage: DatamateStorage {
    private let userDefaults: UserDefaults

    public init(userDefaults: UserDefaults = .standard) {
        self.userDefaults = userDefaults
    }

    public func set(_ value: String, forKey key: String) {
        userDefaults.set(value, forKey: key)
    }

    public func string(forKey key: String) -> String? {
        userDefaults.string(forKey: key)
    }
}

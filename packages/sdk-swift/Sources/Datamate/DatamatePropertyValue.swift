import Foundation

public enum DatamatePropertyValue: Encodable, Equatable {
    case array([DatamatePropertyValue])
    case bool(Bool)
    case double(Double)
    case int(Int)
    case null
    case object([String: DatamatePropertyValue])
    case string(String)

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        switch self {
        case .array(let value):
            try container.encode(value)
        case .bool(let value):
            try container.encode(value)
        case .double(let value):
            try container.encode(value)
        case .int(let value):
            try container.encode(value)
        case .null:
            try container.encodeNil()
        case .object(let value):
            try container.encode(value)
        case .string(let value):
            try container.encode(value)
        }
    }
}

extension DatamatePropertyValue: ExpressibleByArrayLiteral {
    public init(arrayLiteral elements: DatamatePropertyValue...) {
        self = .array(elements)
    }
}

extension DatamatePropertyValue: ExpressibleByBooleanLiteral {
    public init(booleanLiteral value: Bool) {
        self = .bool(value)
    }
}

extension DatamatePropertyValue: ExpressibleByDictionaryLiteral {
    public init(dictionaryLiteral elements: (String, DatamatePropertyValue)...) {
        var object: [String: DatamatePropertyValue] = [:]
        for (key, value) in elements {
            object[key] = value
        }
        self = .object(object)
    }
}

extension DatamatePropertyValue: ExpressibleByFloatLiteral {
    public init(floatLiteral value: Double) {
        self = .double(value)
    }
}

extension DatamatePropertyValue: ExpressibleByIntegerLiteral {
    public init(integerLiteral value: Int) {
        self = .int(value)
    }
}

extension DatamatePropertyValue: ExpressibleByNilLiteral {
    public init(nilLiteral: ()) {
        self = .null
    }
}

extension DatamatePropertyValue: ExpressibleByStringLiteral {
    public init(stringLiteral value: String) {
        self = .string(value)
    }
}

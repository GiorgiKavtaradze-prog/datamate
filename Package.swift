// swift-tools-version: 5.9

import PackageDescription

let package = Package(
    name: "Datamate",
    platforms: [
        .iOS(.v15),
        .macOS(.v12),
        .tvOS(.v15),
        .watchOS(.v8),
    ],
    products: [
        .library(
            name: "Datamate",
            targets: ["Datamate"]
        ),
    ],
    targets: [
        .target(
            name: "Datamate",
            path: "packages/sdk-swift/Sources/Datamate"
        ),
        .testTarget(
            name: "DatamateTests",
            dependencies: ["Datamate"],
            path: "packages/sdk-swift/Tests/DatamateTests"
        ),
    ]
)

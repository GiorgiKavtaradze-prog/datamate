import "./globals.css";

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { DATAMATE_UPTIME_URL, STATUS_URL } from "@/lib/status-url";

const ltSuperior = localFont({
	src: [
		{ path: "../fonts/lt-superior/light.otf", weight: "300" },
		{ path: "../fonts/lt-superior/regular.otf", weight: "400" },
		{ path: "../fonts/lt-superior/medium.otf", weight: "500" },
		{ path: "../fonts/lt-superior/semibold.otf", weight: "600" },
		{ path: "../fonts/lt-superior/bold.otf", weight: "700" },
		{ path: "../fonts/lt-superior/extrabold.otf", weight: "800" },
	],
	variable: "--font-lt-superior",
	display: "swap",
});

const ltSuperiorMono = localFont({
	src: [
		{ path: "../fonts/lt-superior-mono/regular.otf", weight: "400" },
		{ path: "../fonts/lt-superior-mono/medium.otf", weight: "500" },
		{ path: "../fonts/lt-superior-mono/semibold.otf", weight: "600" },
		{ path: "../fonts/lt-superior-mono/bold.otf", weight: "700" },
	],
	variable: "--font-lt-superior-mono",
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL(STATUS_URL),
	applicationName: "Datamate Status",
	title: {
		template: "%s | Datamate Status",
		default: "Datamate Status Pages",
	},
	description:
		"Live uptime, incident history, and service health for public Datamate status pages.",
	keywords: [
		"status page",
		"uptime monitoring",
		"incident history",
		"service status",
		"Datamate uptime",
	],
	authors: [{ name: "Datamate", url: DATAMATE_UPTIME_URL }],
	creator: "Datamate",
	publisher: "Datamate",
	category: "technology",
	icons: {
		icon: [
			{ url: "/icon0.svg", type: "image/svg+xml" },
			{ url: "/icon1.png", sizes: "96x96", type: "image/png" },
		],
		shortcut: [{ url: "/icon0.svg", type: "image/svg+xml" }],
		apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
	},
	manifest: "/manifest.webmanifest",
	openGraph: {
		title: "Datamate Status Pages",
		description:
			"Live uptime, incident history, and service health for public Datamate status pages.",
		url: STATUS_URL,
		siteName: "Datamate Status",
		type: "website",
		locale: "en_US",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
			"max-video-preview": -1,
		},
	},
	twitter: {
		card: "summary",
		title: "Datamate Status Pages",
		description:
			"Live uptime, incident history, and service health for public Datamate status pages.",
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
	],
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			className={`${ltSuperior.className} ${ltSuperior.variable} ${ltSuperiorMono.variable}`}
			lang="en"
			suppressHydrationWarning
		>
			<body className="min-h-dvh bg-background text-foreground antialiased">
				{children}
			</body>
		</html>
	);
}

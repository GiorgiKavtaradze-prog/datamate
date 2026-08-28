import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Design",
	description: "Datamate dashboard component showcase",
};

export default function DesignLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}

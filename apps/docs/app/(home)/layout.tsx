import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { Navbar } from "@/components/navbar";

async function getGithubStars(): Promise<number | null> {
	try {
		const response = await fetch(
			"https://api.github.com/repos/datamate-analytics/datamate",
			{
				headers: {
					Accept: "application/vnd.github+json",
				},
				next: { revalidate: 3600 },
			}
		);

		if (!response.ok) {
			return null;
		}

		const data = (await response.json()) as { stargazers_count?: number };
		return typeof data.stargazers_count === "number"
			? data.stargazers_count
			: null;
	} catch {
		return null;
	}
}

export default async function Layout({ children }: { children: ReactNode }) {
	const stars = await getGithubStars();

	return (
		<HomeLayout {...baseOptions}>
			<Navbar stars={stars} />
			<div className="flex min-h-0 flex-1 flex-col">{children}</div>
		</HomeLayout>
	);
}

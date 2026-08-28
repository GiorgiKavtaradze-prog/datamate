"use client";

import { generateId } from "ai";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
	getLastChatId,
	setLastChatId,
} from "@/components/agent/hooks/use-chat-db";

export function AgentRedirect() {
	const router = useRouter();
	const params = useParams();
	const websiteId = params.id as string;

	useEffect(() => {
		const lastChatId = getLastChatId(websiteId);
		if (lastChatId) {
			router.replace(`/websites/${websiteId}/agent/${lastChatId}`);
		} else {
			const newChatId = generateId();
			setLastChatId(websiteId, newChatId);
			router.replace(`/websites/${websiteId}/agent/${newChatId}`);
		}
	}, [websiteId, router]);

	return <div aria-hidden className="flex h-full" />;
}

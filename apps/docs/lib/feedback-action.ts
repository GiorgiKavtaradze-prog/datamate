"use server";

import { Datamate } from "@datamate/sdk/node";
import type { ActionResponse, Feedback } from "@/components/feedback";

const datamateApiKey = process.env.DATAMATE_API_KEY;
const client = datamateApiKey
	? new Datamate({
			apiKey: datamateApiKey,
			websiteId: process.env.DATAMATE_WEBSITE_ID,
			debug: process.env.NODE_ENV === "development",
		})
	: null;

const MAX_MESSAGE_LENGTH = 1000;
const VALID_OPINIONS = ["good", "bad"] as const;

export async function onRateDocs(
	url: string,
	feedback: Feedback
): Promise<ActionResponse> {
	if (!VALID_OPINIONS.includes(feedback.opinion)) {
		return { success: false, error: "Please select good or bad" };
	}

	if (typeof feedback.message !== "string") {
		return { success: false, error: "Message is required" };
	}

	const trimmedMessage = feedback.message.trim();

	if (trimmedMessage.length === 0) {
		return { success: false, error: "Message cannot be empty" };
	}

	if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
		return {
			success: false,
			error: `Message must be under ${MAX_MESSAGE_LENGTH} characters`,
		};
	}

	try {
		if (!client) {
			return { success: true };
		}

		const result = await client.track({
			name: "docs_feedback",
			properties: {
				url,
				opinion: feedback.opinion,
				message: trimmedMessage,
			},
		});

		if (!result.success) {
			console.error("Failed to track docs feedback:", result.error);
			return {
				success: false,
				error: result.error ?? "Something went wrong. Please try again.",
			};
		}

		await client.flush();

		return { success: true };
	} catch (error) {
		console.error("Failed to capture docs feedback:", error);
		return { success: false, error: "Something went wrong. Please try again." };
	}
}

"use server";

import { auth } from "@datamate/auth";
import { Datamate } from "@datamate/sdk/node";
import { headers } from "next/headers";
import type { CancelFeedback } from "../components/cancel-subscription-dialog";

const datamateApiKey = process.env.DATAMATE_API_KEY;
const client = datamateApiKey
	? new Datamate({
			apiKey: datamateApiKey,
			websiteId: process.env.DATAMATE_WEBSITE_ID,
			debug: process.env.NODE_ENV === "development",
		})
	: null;

const VALID_REASONS = [
	"too_expensive",
	"missing_features",
	"not_using",
	"switching",
	"technical_issues",
	"other",
] as const;

interface TrackCancelFeedbackParams {
	feedback: CancelFeedback;
	immediate: boolean;
	planId: string;
	planName: string;
}

export async function trackCancelFeedbackAction({
	feedback,
	planId,
	planName,
	immediate,
}: TrackCancelFeedbackParams): Promise<{ success: boolean }> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session) {
			return { success: false };
		}

		if (!VALID_REASONS.includes(feedback.reason)) {
			return { success: false };
		}

		if (!client) {
			return { success: true };
		}

		const result = await client.track({
			name: "subscription_cancelled",
			properties: {
				reason: feedback.reason,
				details: feedback.details?.trim() ?? null,
				plan_id: planId,
				plan_name: planName,
				cancelled_immediately: immediate,
			},
		});
		if (!result.success) {
			return { success: false };
		}

		await client.flush();

		return { success: true };
	} catch (error) {
		console.error("Failed to track cancellation feedback:", error);
		return { success: false };
	}
}

import { getProfileId, getTrackingIds } from "@datamate/sdk";

const DATAMATE_CLIENT_ID =
	process.env.NEXT_PUBLIC_DATAMATE_CLIENT_ID ?? "OXmNQsViBT-FOS_wZCTHc";

export function getStripeMetadata(): Record<string, string> {
	const { anonId, sessionId } = getTrackingIds();
	const profileId = getProfileId();
	const metadata: Record<string, string> = {
		datamate_client_id: DATAMATE_CLIENT_ID,
	};
	if (sessionId) {
		metadata.datamate_session_id = sessionId;
	}
	if (anonId) {
		metadata.datamate_anonymous_id = anonId;
	}
	if (profileId) {
		metadata.datamate_profile_id = profileId;
	}
	return metadata;
}

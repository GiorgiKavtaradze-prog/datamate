import { permanentRedirect } from "next/navigation";
import { DATAMATE_UPTIME_URL } from "@/lib/status-url";

export default function RootPage() {
	permanentRedirect(DATAMATE_UPTIME_URL);
}

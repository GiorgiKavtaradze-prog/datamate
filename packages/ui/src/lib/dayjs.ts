// biome-ignore lint/style/noExportedImports: extended singleton is the app-wide default
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export function guessTimezone(): string {
	return dayjs.tz.guess() ?? "UTC";
}
export default dayjs;

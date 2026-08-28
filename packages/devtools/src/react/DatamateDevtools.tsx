import { useEffect } from "react";
import { mountDevtools } from "../ui";

export interface DatamateDevtoolsProps {
	enabled?: boolean;
	keyboardShortcut?: boolean;
}

export function DatamateDevtools({
	enabled = true,
	keyboardShortcut = true,
}: DatamateDevtoolsProps) {
	useEffect(() => {
		if (!enabled) {
			return;
		}
		return mountDevtools({ keyboardShortcut });
	}, [enabled, keyboardShortcut]);

	return null;
}

import { useEffect } from "react";
import { createScript, isScriptInjected } from "@/core/script";
import type { DatamateConfig } from "@/core/types";
import { detectClientId } from "@/utils";

export function Datamate(props: DatamateConfig) {
	const clientId = detectClientId(props.clientId);

	useEffect(() => {
		if (!clientId) {
			if (!props.disabled && props.debug) {
				console.warn(
					"Datamate: No client ID found. Please provide clientId prop or set NEXT_PUBLIC_DATAMATE_CLIENT_ID environment variable."
				);
			}
			return;
		}

		if (props.disabled || isScriptInjected()) {
			return;
		}

		const script = createScript({ ...props, clientId });
		document.head.appendChild(script);

		return () => {
			script.remove();
		};
	}, [clientId, props.disabled]);

	return null;
}

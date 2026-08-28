"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useCallback, useRef } from "react";

interface PrefetchZoneProps {
	children: ReactNode;
	className?: string;
	href: string;
	onEnterZone?: () => void | Promise<void>;
}

export function PrefetchZone({
	children,
	href,
	onEnterZone,
	className,
}: PrefetchZoneProps) {
	const router = useRouter();
	const triggered = useRef(false);

	const handleMouseEnter = useCallback(() => {
		if (triggered.current) {
			return;
		}
		triggered.current = true;
		router.prefetch(href);
		if (onEnterZone) {
			Promise.resolve(onEnterZone()).catch(() => {});
		}
	}, [href, router, onEnterZone]);

	return (
		// biome-ignore lint/a11y/noNoninteractiveElementInteractions: prefetch trigger, not interactive
		<div className={className} onMouseEnter={handleMouseEnter}>
			{children}
		</div>
	);
}

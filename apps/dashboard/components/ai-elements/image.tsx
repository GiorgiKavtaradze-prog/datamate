import type { Experimental_GeneratedImage } from "ai";
import { cn } from "@/lib/utils";

export type ImageProps = Experimental_GeneratedImage & {
	alt?: string;
	className?: string;
	height?: number;
	width?: number;
};

export const Image = ({
	base64,
	mediaType,
	uint8Array,
	height = 256,
	width = 256,
	...props
}: ImageProps) => (
	<img
		{...props}
		alt={props.alt}
		className={cn(
			"h-auto max-w-full overflow-hidden rounded-md",
			props.className
		)}
		height={height}
		src={`data:${mediaType};base64,${base64}`}
		width={width}
	/>
);

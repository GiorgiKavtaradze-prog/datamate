"use client";

import { cn } from "../lib/utils";
import { motion, useMotionValueEvent, useSpring } from "motion/react";
import { useEffect, useRef, useState, type HTMLAttributes } from "react";

interface LineSliderProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
	className?: string;
	max?: number;
	min?: number;
	onValueChange: (value: number) => void;
	value: number;
}

export function LineSlider({
	value,
	onValueChange,
	min = 0,
	max = 100,
	className,
	...rest
}: LineSliderProps) {
	const sliderRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [lineCount, setLineCount] = useState(0);

	const springValue = useSpring(value, {
		bounce: 0,
		stiffness: 300,
		damping: 30,
	});

	const [displayValue, setDisplayValue] = useState(value);

	useEffect(() => {
		springValue.set(value);
	}, [value, springValue]);

	useMotionValueEvent(springValue, "change", (latest) => {
		if (!isDragging) {
			setDisplayValue(latest);
		}
	});

	const lineWidth = 1;
	const lineGap = 2;

	useEffect(() => {
		const el = sliderRef.current;
		if (!el) {
			return;
		}

		const updateLineCount = () => {
			const innerWidth = el.clientWidth - 4;
			setLineCount(Math.floor(innerWidth / (lineWidth + lineGap)));
		};

		updateLineCount();

		const observer = new ResizeObserver(updateLineCount);
		observer.observe(el);

		return () => observer.disconnect();
	}, []);

	const range = Math.max(max - min, 1);

	const getValueFromClientX = (clientX: number) => {
		if (!sliderRef.current) {
			return value;
		}
		const rect = sliderRef.current.getBoundingClientRect();
		const percentage = Math.max(
			0,
			Math.min(1, (clientX - rect.left) / rect.width)
		);
		return Math.round(min + percentage * range);
	};

	const updateValue = (clientX: number) => {
		onValueChange(getValueFromClientX(clientX));
	};

	const handlePointerDown = (e: React.PointerEvent) => {
		setIsDragging(true);
		sliderRef.current?.setPointerCapture(e.pointerId);
		updateValue(e.clientX);
	};

	const handlePointerMove = (e: React.PointerEvent) => {
		if (isDragging) {
			updateValue(e.clientX);
		}
	};

	const handlePointerUp = (e: React.PointerEvent) => {
		setIsDragging(false);
		if (sliderRef.current?.hasPointerCapture(e.pointerId)) {
			sliderRef.current.releasePointerCapture(e.pointerId);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const step = 1;
		const pageStep = Math.max(1, Math.round(range / 10));

		switch (e.key) {
			case "ArrowLeft":
			case "ArrowDown":
				e.preventDefault();
				onValueChange(Math.max(min, value - step));
				break;
			case "ArrowRight":
			case "ArrowUp":
				e.preventDefault();
				onValueChange(Math.min(max, value + step));
				break;
			case "PageDown":
				e.preventDefault();
				onValueChange(Math.max(min, value - pageStep));
				break;
			case "PageUp":
				e.preventDefault();
				onValueChange(Math.min(max, value + pageStep));
				break;
			case "Home":
				e.preventDefault();
				onValueChange(min);
				break;
			case "End":
				e.preventDefault();
				onValueChange(max);
				break;
			default:
				break;
		}
	};

	const renderValue = isDragging ? value : displayValue;
	const percentage = Math.max(0, Math.min(1, (renderValue - min) / range));
	const activeLines = Math.floor(percentage * lineCount);

	return (
		<div
			aria-orientation="horizontal"
			aria-valuemax={max}
			aria-valuemin={min}
			aria-valuenow={Math.round(value)}
			className={cn(
				"flex h-8 w-full cursor-ew-resize touch-none select-none items-stretch justify-center gap-[2px] rounded-md border border-border/60 bg-secondary px-1 py-1",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
				className
			)}
			onKeyDown={handleKeyDown}
			onLostPointerCapture={handlePointerUp}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			ref={sliderRef}
			role="slider"
			tabIndex={0}
			{...rest}
		>
			{Array.from({ length: lineCount }).map((_, index) => {
				const isActive = index < activeLines;
				return (
					<motion.div
						animate={{
							backgroundColor: isActive
								? "var(--foreground)"
								: "var(--muted-foreground)",
							opacity: isActive ? 1 : 0.4,
							scaleY: isActive ? 1 : 0.7,
						}}
						className="h-full w-px rounded-full"
						initial={false}
						key={index.toString()}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 30,
						}}
					/>
				);
			})}
		</div>
	);
}

"use client";

import React, {
  useCallback,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

interface RippleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  rippleColor?: string;
  duration?: string;
}

interface Ripple {
  x: number;
  y: number;
  size: number;
  key: number;
}

export function RippleButton({
  children,
  className,
  rippleColor = "255, 255, 255",
  duration = "600ms",
  ...props
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const newRipple: Ripple = {
        x,
        y,
        size,
        key: Date.now(),
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.key !== newRipple.key));
      }, Number.parseInt(duration));
    },
    [duration]
  );

  const rippleStyles = useMemo(
    () => ({
      "--ripple-color": rippleColor,
      "--ripple-duration": duration,
    }) as React.CSSProperties,
    [rippleColor, duration]
  );

  return (
    <button
      type="button"
      className={cn(
        "relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 bg-background px-4 py-2 text-center text-primary",
        className
      )}
      onClick={onClick}
      style={rippleStyles}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          className="animate-ripple absolute rounded-full opacity-30"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            background: `radial-gradient(circle, rgba(${rippleColor}, 0.3) 0%, transparent 70%)`,
          }}
        />
      ))}
    </button>
  );
}

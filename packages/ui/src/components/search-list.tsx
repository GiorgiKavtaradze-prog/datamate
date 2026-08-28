"use client";

import { cn } from "../lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import type { ComponentPropsWithoutRef } from "react";
import { MagnifyingGlassIcon } from "./icons";

function Root({
	className,
	...rest
}: ComponentPropsWithoutRef<typeof CommandPrimitive>) {
	return (
		<CommandPrimitive
			className={cn(
				"flex w-full flex-col overflow-hidden text-foreground",
				className
			)}
			{...rest}
		/>
	);
}

function Input({
	className,
	...rest
}: ComponentPropsWithoutRef<typeof CommandPrimitive.Input>) {
	return (
		<div className="flex h-9 items-center gap-2.5 border-border/60 border-b px-3">
			<MagnifyingGlassIcon className="size-3.5 shrink-0 text-muted-foreground" />
			<CommandPrimitive.Input
				className={cn(
					"flex h-full w-full bg-transparent text-foreground text-xs outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
					className
				)}
				{...rest}
			/>
		</div>
	);
}

function List({
	className,
	...rest
}: ComponentPropsWithoutRef<typeof CommandPrimitive.List>) {
	return (
		<CommandPrimitive.List
			className={cn(
				"max-h-[280px] scroll-py-1 overflow-y-auto overflow-x-hidden overscroll-contain p-1",
				className
			)}
			onPointerDown={(e) => e.stopPropagation()}
			onWheel={(e) => e.stopPropagation()}
			{...rest}
		/>
	);
}

function Empty({
	className,
	...rest
}: ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>) {
	return (
		<CommandPrimitive.Empty
			className={cn(
				"py-6 text-center text-muted-foreground text-xs",
				className
			)}
			{...rest}
		/>
	);
}

function Group({
	className,
	...rest
}: ComponentPropsWithoutRef<typeof CommandPrimitive.Group>) {
	return (
		<CommandPrimitive.Group
			className={cn(
				"overflow-hidden [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:text-muted-foreground",
				className
			)}
			{...rest}
		/>
	);
}

function Item({
	className,
	...rest
}: ComponentPropsWithoutRef<typeof CommandPrimitive.Item>) {
	return (
		<CommandPrimitive.Item
			className={cn(
				"flex h-8 cursor-pointer select-none items-center gap-2 rounded-md px-2.5 text-[13px] text-foreground outline-none",
				"data-[selected=true]:bg-interactive-hover",
				"data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
				className
			)}
			{...rest}
		/>
	);
}

function Separator({
	className,
	...rest
}: ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>) {
	return (
		<CommandPrimitive.Separator
			className={cn("-mx-1 h-px bg-border/60", className)}
			{...rest}
		/>
	);
}

export const SearchList = Object.assign(Root, {
	Input,
	List,
	Empty,
	Group,
	Item,
	Separator,
});

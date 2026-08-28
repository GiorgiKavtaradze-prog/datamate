"use client";

import type { GroupsListProps } from "../../_components/types";
import { GroupItem } from "./group-item";
import { UsersThreeIcon } from "@datamate/ui/icons";
import { EmptyState } from "@datamate/ui";

export function GroupsList({
	groups,
	isLoading,
	onCreateGroupAction,
	onEditGroupAction,
	onDeleteGroup,
}: GroupsListProps) {
	if (isLoading) {
		return null;
	}

	if (groups.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center py-16">
				<EmptyState
					action={{
						label: "Create a group",
						onClick: onCreateGroupAction,
					}}
					description="Reusable sets of users you can target from any flag."
					icon={<UsersThreeIcon weight="duotone" />}
					title="No target groups yet"
					variant="minimal"
				/>
			</div>
		);
	}

	return (
		<div>
			{groups.map((group) => (
				<GroupItem
					group={group}
					key={group.id}
					onDelete={onDeleteGroup ?? (() => {})}
					onEdit={onEditGroupAction}
				/>
			))}
		</div>
	);
}

import { type ComputedRef, computed, ref, watchEffect } from "vue";
import type { FlagState } from "@/core/flags/types";
import { useFlags } from "./flags-plugin";

const defaultState: FlagState = { on: false, status: "loading", loading: true };

export function useFlag(key: string) {
	const { getFlag } = useFlags();
	const flagState = ref<FlagState>(defaultState);

	watchEffect(() => {
		flagState.value = getFlag(key);
	});

	return {
		on: computed(() => flagState.value.on) as ComputedRef<boolean>,
		loading: computed(() => flagState.value.loading) as ComputedRef<boolean>,
		state: computed(() => flagState.value) as ComputedRef<FlagState>,
	};
}

let counter = 0;

export function nextId(prefix: string) {
	return `${prefix}-${++counter}`;
}

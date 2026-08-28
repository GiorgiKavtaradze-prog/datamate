export const cleanUrl = (url: string) => {
	if (!url) {
		return "";
	}
	try {
		const urlObj = new URL(url);
		let path = urlObj.pathname;
		if (path.length > 1 && path.endsWith("/")) {
			path = path.slice(0, -1);
		}
		return path + urlObj.search;
	} catch {
		let cleanPath = url.startsWith("/") ? url : `/${url}`;
		if (cleanPath.length > 1 && cleanPath.endsWith("/")) {
			cleanPath = cleanPath.slice(0, -1);
		}
		return cleanPath;
	}
};

export const getDisplayPath = (path: string) => {
	if (!path || path === "/") {
		return "/";
	}
	const cleanPath = cleanUrl(path);
	if (cleanPath.length > 40) {
		const parts = cleanPath.split("/").filter(Boolean);
		if (parts.length > 2) {
			return `/${parts[0]}/.../${parts.at(-1)}`;
		}
	}
	return cleanPath;
};

export const formatPropertyValue = (value: unknown): string => {
	if (value === null || value === undefined) {
		return "null";
	}
	if (typeof value === "boolean") {
		return value.toString();
	}
	if (typeof value === "number") {
		return value.toString();
	}
	if (typeof value === "string") {
		return value;
	}
	return JSON.stringify(value);
};

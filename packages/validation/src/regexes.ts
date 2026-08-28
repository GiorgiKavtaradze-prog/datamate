export const RESOLUTION_REGEX = /^(\d{2,5})x(\d{2,5})$/;

export const LANGUAGE_REGEX = /^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,8})*$/;

export const LOCALHOST_URL_REGEX = /^https?:\/\/localhost(:\d+)?\//;

export const TIMEZONE_REGEX = /^[A-Za-z_/+-]{1,64}$/;

export const SESSION_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

export const RESOLUTION_SIMPLE_REGEX = /^\d{1,5}x\d{1,5}$/;

export const DURATION_REGEX = /^(\d+)([smhd])$/;

export const WEBSITE_NAME_REGEX = /^[a-zA-Z0-9\s\-_.]+$/;

export const DOMAIN_REGEX =
	/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;

export const SUBDOMAIN_REGEX = /^[a-zA-Z0-9-]*$/;

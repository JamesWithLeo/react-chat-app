import { format, distanceInWordsToNow } from "date-fns";

export function fDate(date: number | string | Date) {
	return format(new Date(date), "dd MMMM yyyy");
}

export function fDateTime(date: number | string | Date) {
	return format(new Date(date), "dd MMM yyyy HH:mm");
}

export function fTimestamp(date: number | string | Date) {
	return new Date(date);
}

export function fDateTimeSuffix(date: number | string | Date) {
	return format(new Date(date), "dd/MM/yyyy hh:mm p");
}

export function fToNow(date: number | string | Date) {
	return distanceInWordsToNow(new Date(date), { includeSeconds: true });
}

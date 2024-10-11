import numeral from "numeral";

export function fCurrency(num: number) {
	return numeral(num).format(Number.isInteger(num) ? "$0,0" : "$0,0.00");
}

export function fPercent(num: number) {
	return numeral(num / 100).format("0.0%");
}

export function fNumber(num: number) {
	return numeral(num).format();
}

export function fShortenNumber(number: number) {
	return numeral(number).format("0.00a").replace(".00", "");
}

export function fData(num: number) {
	return numeral(num).format("0.0 b");
}

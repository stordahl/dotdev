import type { allPosts, allSketches } from 'content-collections';

export function roman(num: number): string {
	if (num < 1 || num > 3999) {
		throw new Error('Number out of range (1-3999)');
	}

	const romanNumerals: [number, string][] = [
		[1000, 'M'],
		[900, 'CM'],
		[500, 'D'],
		[400, 'CD'],
		[100, 'C'],
		[90, 'XC'],
		[50, 'L'],
		[40, 'XL'],
		[10, 'X'],
		[9, 'IX'],
		[5, 'V'],
		[4, 'IV'],
		[1, 'I']
	];

	let result = '';
	for (const [value, symbol] of romanNumerals) {
		while (num >= value) {
			result += symbol;
			num -= value;
		}
	}

	return result;
}

export function formatDateToMonthYear(
	dateInput: Date | string,
	shortMonth: boolean = false
): string {
	const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: shortMonth ? 'short' : 'long'
	}).format(date);
}

type DateStyle = Intl.DateTimeFormatOptions['dateStyle'];

export function formatDate(date: Date | string, dateStyle: DateStyle = 'medium', locales = 'en') {
	const dateToFormat = typeof date === 'string' ? new Date(date.replaceAll('-', '/')) : date;
	const dateFormatter = new Intl.DateTimeFormat(locales, { dateStyle });
	return dateFormatter.format(dateToFormat);
}

export function sortByDateProperty(arr: typeof allPosts | typeof allSketches) {
	return arr.sort((first, second) => {
		const firstDate = first.date instanceof Date ? first.date : new Date(first.date);
		const secondDate = second.date instanceof Date ? second.date : new Date(second.date);
		return secondDate.getTime() - firstDate.getTime();
	});
}

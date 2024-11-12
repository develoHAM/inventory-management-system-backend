export function isObjectEmpty(obj: Record<string | number, any> | any[]) {
	if (Array.isArray(obj)) {
		return obj.length === 0;
	}
	return Object.keys(obj).length === 0;
}

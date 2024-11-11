export class ErrorHandler {
	public static handle({
		error,
		errorsToCatch,
		errorToThrow,
		errorMessagePrefix,
	}: {
		error: unknown;
		errorsToCatch: (new (...args: any[]) => Error)[];
		errorToThrow: new (...args: any[]) => Error;
		errorMessagePrefix?: string;
	}) {
		if (errorsToCatch.some((errorClass) => error instanceof errorClass)) {
			throw error;
		}
		if (!(error instanceof Error)) {
			throw new errorToThrow(
				errorMessagePrefix
					? `${errorMessagePrefix}: ${JSON.parse(JSON.stringify(error))}`
					: JSON.parse(JSON.stringify(error))
			);
		}
		throw new errorToThrow(errorMessagePrefix ? `${errorMessagePrefix}: ${error.message}` : error.message);
	}
}

export class DatabaseTableInitializationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;

		Object.setPrototypeOf(this, DatabaseTableInitializationError.prototype);
	}
}

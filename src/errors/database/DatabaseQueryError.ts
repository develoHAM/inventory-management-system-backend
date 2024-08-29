export class DatabaseQueryError extends Error {
	constructor(sql: string, values?: any[]) {
		let message = `Cannot query database\nSQL: ${sql}`;
		if (values) {
			message += `\nvalues: ${values}`;
		}

		super(message);
		this.name = this.constructor.name;
		Object.setPrototypeOf(this, DatabaseQueryError.prototype);
	}
}

import { IDatabase, IDatabaseConnection } from 'interfaces/IDatabase';
import { DatabaseConnectionError, TransactionHandlingError } from '../errors/persistence';
import { ITransactionHandler } from 'interfaces/ITransactionHandler';

export class TransactionHandler<T extends IDatabase<any, any, any>> implements ITransactionHandler {
	#database: IDatabase<any, any, any>;

	constructor(database: T) {
		this.#database = database;
	}

	async getConnection() {
		try {
			return await this.#database.getConnection();
		} catch (error: any) {
			if (error instanceof DatabaseConnectionError) {
				throw error;
			}
			console.log(error);
			throw new TransactionHandlingError('Cannot get database connection');
		}
	}

	async begin(connection: IDatabaseConnection) {
		try {
			await this.#database.beginTransaction(connection);
			return true;
		} catch (error: any) {
			if (error instanceof DatabaseConnectionError) {
				throw error;
			}
			console.log(error);
			throw new TransactionHandlingError('Cannot begin transaction');
		}
	}

	async commit(connection: IDatabaseConnection) {
		try {
			await this.#database.commitTransaction(connection);
			return true;
		} catch (error: any) {
			if (error instanceof DatabaseConnectionError) {
				throw error;
			}
			console.log(error);
			throw new TransactionHandlingError('Cannot commit transaction');
		}
	}

	async rollback(connection: IDatabaseConnection) {
		try {
			await this.#database.rollbackTransaction(connection);
			return true;
		} catch (error: any) {
			if (error instanceof DatabaseConnectionError) {
				throw error;
			}
			console.log(error);
			throw new TransactionHandlingError('Cannot rollback transaction');
		}
	}

	end(connection: IDatabaseConnection) {
		try {
			this.#database.releaseConnection(connection);
			return true;
		} catch (error: any) {
			if (error instanceof DatabaseConnectionError) {
				throw error;
			}
			console.log(error);
			throw new TransactionHandlingError('Cannot release connection');
		}
	}
}

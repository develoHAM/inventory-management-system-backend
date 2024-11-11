import { IDatabase, IDatabaseConnection } from 'types/IDatabase';
import { DatabaseConnectionError, TransactionHandlingError } from '../errors/persistence';
import { ITransactionHandler } from 'types/ITransactionHandler';

export class TransactionHandler<
	DatabaseType extends IDatabase<any, any, any>,
	ConnectionType extends IDatabaseConnection
> implements ITransactionHandler<ConnectionType>
{
	#database: DatabaseType;

	constructor(database: DatabaseType) {
		this.#database = database;
	}

	async getConnection(): Promise<ConnectionType> {
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

	async begin(connection: ConnectionType): Promise<void> {
		try {
			await this.#database.beginTransaction(connection);
		} catch (error: any) {
			if (error instanceof DatabaseConnectionError) {
				throw error;
			}
			console.log(error);
			throw new TransactionHandlingError('Cannot begin transaction');
		}
	}

	async commit(connection: ConnectionType): Promise<void> {
		try {
			await this.#database.commitTransaction(connection);
		} catch (error: any) {
			if (error instanceof DatabaseConnectionError) {
				throw error;
			}
			console.log(error);
			throw new TransactionHandlingError('Cannot commit transaction');
		}
	}

	async rollback(connection: ConnectionType): Promise<void> {
		try {
			await this.#database.rollbackTransaction(connection);
		} catch (error: any) {
			if (error instanceof DatabaseConnectionError) {
				throw error;
			}
			console.log(error);
			throw new TransactionHandlingError('Cannot rollback transaction');
		}
	}

	end(connection: ConnectionType): void {
		try {
			this.#database.releaseConnection(connection);
		} catch (error: any) {
			if (error instanceof DatabaseConnectionError) {
				throw error;
			}
			console.log(error);
			throw new TransactionHandlingError('Cannot release connection');
		}
	}
}

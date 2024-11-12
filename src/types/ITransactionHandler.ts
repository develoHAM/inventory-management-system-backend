import { IDatabaseConnection } from './IDatabase';

export interface ITransactionHandler<ConnectionType extends IDatabaseConnection> {
	getConnection(): Promise<ConnectionType>;
	begin(connection: ConnectionType): Promise<void>;
	commit(connection: ConnectionType): Promise<void>;
	rollback(connection: ConnectionType): Promise<void>;
	end(connection: ConnectionType): void;
}

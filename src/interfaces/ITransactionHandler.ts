import { IDatabase, IDatabaseConnection } from './IDatabase';

export interface ITransactionHandler {
	getConnection(): Promise<IDatabaseConnection>;
	begin(connection: IDatabaseConnection): Promise<boolean>;
	commit(connection: IDatabaseConnection): Promise<boolean>;
	rollback(connection: IDatabaseConnection): Promise<boolean>;
	end(connection: IDatabaseConnection): boolean;
}

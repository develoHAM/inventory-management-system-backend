export interface IDatabaseConnection {
	beginTransaction(): Promise<void>;
	commit(): Promise<void>;
	rollback(): Promise<void>;
	execute<ReturnType>(sql: string, values: any[]): Promise<[ReturnType, any]>;
	query<ReturnType>(sql: string): Promise<[ReturnType, any]>;
	release(): void;
}

export interface IDatabase<QueryResultType, RowType, ConnectionType> {
	connect(): Promise<boolean>;
	getConnection(): Promise<ConnectionType>;
	releaseConnection(connection: ConnectionType): void;
	beginTransaction(connection: ConnectionType): Promise<void>;
	commitTransaction(connection: ConnectionType): Promise<void>;
	rollbackTransaction(connection: ConnectionType): Promise<void>;
	lockForUpdate(sql: string): string;
	lockForShare(sql: string): string;
	initializeTables(): Promise<boolean>;
	get queryRows(): (sql: string, values?: any) => Promise<[RowType[], any[]]>;
	get queryRowsAsArray(): (sql: string, values?: any) => Promise<[RowType[][], any[]]>;
	get queryResult(): (sql: string, values?: any) => Promise<[QueryResultType, any[]]>;
	get queryResults(): (sql: string, values?: any[]) => Promise<[QueryResultType[], any[]]>;
	get executeRows(): (sql: string, values: any[]) => Promise<[RowType[], any[]]>;
	get executeRowsAsArray(): (sql: string, values?: any[]) => Promise<[RowType[][], any[]]>;
	get executeResult(): (sql: string, values?: any[]) => Promise<[QueryResultType, any[]]>;
	get executeResults(): (sql: string, values?: any[]) => Promise<[QueryResultType[], any[]]>;
}

export interface IDatabase<QueryResultType, RowType, ConnectionType> {
	connect(): Promise<boolean>;
	getConnection(): Promise<ConnectionType>;
	releaseConnection(connection: ConnectionType): void;
	initializeTables(): Promise<boolean>;
	beginTransaction(connection: ConnectionType): Promise<void>;
	commitTransaction(connection: ConnectionType): Promise<void>;
	rollbackTransaction(connection: ConnectionType): Promise<void>;

	get queryRows(): (sql: string, values?: any) => Promise<[RowType[], any[]]>;
	get queryRowsAsArray(): (sql: string, values?: any) => Promise<[RowType[][], any[]]>;
	get queryResult(): (sql: string, values?: any) => Promise<[QueryResultType, any[]]>;
	get queryResults(): (sql: string, values?: any[]) => Promise<[QueryResultType[], any[]]>;
	get executeRows(): (sql: string, values: any[]) => Promise<[RowType[], any[]]>;
	get executeRowsAsArray(): (sql: string, values?: any[]) => Promise<[RowType[][], any[]]>;
	get executeResult(): (sql: string, values?: any[]) => Promise<[QueryResultType, any[]]>;
	get executeResults(): (sql: string, values?: any[]) => Promise<[QueryResultType[], any[]]>;
}

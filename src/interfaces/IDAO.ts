import { IDatabaseConnection } from './IDatabase';
import { IModel } from './IModel';

export type ConnectionProperty<ConnectionType extends IDatabaseConnection> = {
	connection?: ConnectionType;
};

export type ExecuteOperationParameter<ConnectionType extends IDatabaseConnection> = {
	sql: string;
	values?: any[];
} & ConnectionProperty<ConnectionType>;

export interface IDAO<ModelType extends IModel, ConnectionType extends IDatabaseConnection> {
	tableName: string;

	executeReadOperation(params: ExecuteOperationParameter<ConnectionType>): Promise<ModelType[]>;

	executeWriteOperation(params: ExecuteOperationParameter<ConnectionType>): Promise<Record<string, any>>;

	selectById(id: number, connection?: ConnectionType): Promise<ModelType[]>;
	selectAll(connection?: ConnectionType): Promise<ModelType[]>;
	selectWhere(criteria: Partial<ModelType>, connection?: ConnectionType): Promise<ModelType[]>;
	insertOne(model: Omit<ModelType, 'id'>, connection?: ConnectionType): Promise<Record<string, any>>;
	updateById(
		id: number,
		updates: Partial<Omit<ModelType, 'id'>>,
		connection?: ConnectionType
	): Promise<Record<string, any>>;
	deleteById(id: number, connection?: ConnectionType): Promise<Record<string, any>>;
}

import { IDatabaseConnection } from './IDatabase';
import { IModel } from './IModel';

export type ConnectionProperty<ConnectionType> = {
	connection?: ConnectionType;
};

export enum DatabaseLockMode {
	FOR_SHARE = 1,
	FOR_UPDATE = 2,
}

export type LockProperty = {
	lock?: DatabaseLockMode;
};

export type ExecuteOperationParameter<ConnectionType> = {
	sql: string;
	values?: any[];
} & ConnectionProperty<ConnectionType> &
	LockProperty;

export type SelectByIdParameter<ConnectionType> = {
	id: number;
} & ConnectionProperty<ConnectionType> &
	LockProperty;

export type SelectAllParameter<ConnectionType> = ConnectionProperty<ConnectionType> & LockProperty;

export type SelectWhereParameter<ModelType extends IModel, ConnectionType> = {
	criteria: Partial<ModelType>;
} & ConnectionProperty<ConnectionType> &
	LockProperty;

export type InsertOneParameter<ModelType extends IModel, ConnectionType> = {
	model: Omit<ModelType, 'id'>;
} & ConnectionProperty<ConnectionType>;

export type UpdateByIdParameter<ModelType extends IModel, ConnectionType> = {
	id: number;
	updates: Partial<Omit<ModelType, 'id'>>;
} & ConnectionProperty<ConnectionType>;

export type DeleteByIdParameter<ConnectionType> = {
	id: number;
} & ConnectionProperty<ConnectionType>;

export interface IDAO<ResultType, ModelType extends IModel, ConnectionType extends IDatabaseConnection> {
	tableName: string;

	executeReadOperation(args: ExecuteOperationParameter<ConnectionType>): Promise<ModelType[]>;

	executeWriteOperation(args: ExecuteOperationParameter<ConnectionType>): Promise<ResultType>;

	selectById(args: SelectByIdParameter<ConnectionType>): Promise<ModelType[]>;
	selectAll(args: SelectAllParameter<ConnectionType>): Promise<ModelType[]>;
	selectWhere(args: SelectWhereParameter<ModelType, ConnectionType>): Promise<ModelType[]>;
	insertOne(args: InsertOneParameter<ModelType, ConnectionType>): Promise<ResultType>;
	updateById(args: UpdateByIdParameter<ModelType, ConnectionType>): Promise<ResultType>;
	deleteById(args: DeleteByIdParameter<ConnectionType>): Promise<ResultType>;
}

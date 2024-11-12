import { IModel } from './IModel';
import { IDatabaseConnection } from './IDatabase';
import { ConnectionProperty, DatabaseLockMode, LockProperty } from './IDAO';

export type FindAllParameter<ConnectionType> = ConnectionProperty<ConnectionType> & LockProperty;

export type FindByIdParameter<ConnectionType> = {
	id: number;
} & ConnectionProperty<ConnectionType> &
	LockProperty;

export type FindParameter<ModelType extends IModel, ConnectionType> = {
	criteria: Partial<ModelType>;
} & ConnectionProperty<ConnectionType> &
	LockProperty;

export type CreateParameter<ModelType extends IModel, ConnectionType> = {
	model: Omit<ModelType, 'id'>;
} & ConnectionProperty<ConnectionType>;

export type UpdateParameter<ModelType extends IModel, ConnectionType> = {
	id: number;
	updates: Partial<Omit<ModelType, 'id'>>;
} & ConnectionProperty<ConnectionType>;

export type DeleteParamter<ConnectionType> = {
	id: number;
} & ConnectionProperty<ConnectionType>;

export interface IRepository<ResultType, ModelType extends IModel, ConnectionType extends IDatabaseConnection> {
	findAll(args: FindAllParameter<ConnectionType>): Promise<ModelType[]>;
	findById(args: FindByIdParameter<ConnectionType>): Promise<ModelType[]>;
	find(args: FindParameter<ModelType, ConnectionType>): Promise<ModelType[]>;
	create(args: CreateParameter<ModelType, ConnectionType>): Promise<ResultType>;
	update(args: UpdateParameter<ModelType, ConnectionType>): Promise<ResultType>;
	delete(args: DeleteParamter<ConnectionType>): Promise<ResultType>;
}

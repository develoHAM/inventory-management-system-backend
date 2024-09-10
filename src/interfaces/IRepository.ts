import { IModel } from './IModel';
import { IDatabaseConnection } from './IDatabase';

export interface IRepository<ModelType extends IModel> {
	findAll(connection?: IDatabaseConnection): Promise<ModelType[]>;
	findById(id: number, connection?: IDatabaseConnection): Promise<ModelType[]>;
	find(criteria: Partial<ModelType>, connection?: IDatabaseConnection): Promise<ModelType[]>;
	create(model: Omit<ModelType, 'id'>, connection?: IDatabaseConnection): Promise<Record<string, any>>;
	update(
		id: number,
		updates: Partial<Omit<ModelType, 'id'>>,
		connection?: IDatabaseConnection
	): Promise<Record<string, any>>;
	delete(id: number, connection?: IDatabaseConnection): Promise<Record<string, any>>;
}

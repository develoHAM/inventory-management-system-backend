import { IModel } from './IModel';

export interface IDAO<ModelType extends IModel> {
	tableName: string;
	selectById(id: number): Promise<any>;
	selectAll(): Promise<any>;
	selectWhere(criteria: Partial<ModelType>): Promise<any>;
	insertOne(model: Omit<ModelType, 'id'>): Promise<any>;
	updateById(id: number, updates: Partial<Omit<ModelType, 'id'>>): Promise<any>;
	deleteById(id: number): Promise<any>;
}

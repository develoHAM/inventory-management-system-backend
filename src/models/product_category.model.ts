import { IModel } from 'interfaces/IModel';

export interface ProductCategoryModel extends IModel {
	name: string;
	description: string | null;
}

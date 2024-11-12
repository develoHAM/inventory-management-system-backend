import { IModel } from 'types/IModel';

export interface ProductCategoryModel extends IModel {
	name: string;
	description?: string | null;
}

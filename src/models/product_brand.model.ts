import { IModel } from 'types/IModel';

export interface ProductBrandModel extends IModel {
	name: string;
	description?: string | null;
}

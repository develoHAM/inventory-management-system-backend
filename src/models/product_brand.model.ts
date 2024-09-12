import { IModel } from 'interfaces/IModel';

export interface ProductBrandModel extends IModel {
	name: string;
	description?: string | null;
}

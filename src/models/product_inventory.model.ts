import { IModel } from 'types/IModel';

export interface ProductInventoryModel extends IModel {
	inventory?: number | null;
	product?: number | null;
	warehouse?: number | null;
	user?: number | null;
	company?: number | null;
	quantity: number;
}

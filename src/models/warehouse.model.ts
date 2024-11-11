import { IModel } from 'types/IModel';

export interface WarehouseModel extends IModel {
	name: string;
	store_branch: number;
}

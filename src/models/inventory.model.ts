import { IModel } from 'interfaces/IModel';

export interface InventoryModel extends IModel {
	name: string;
	description: string | null;
	date: Date;
}

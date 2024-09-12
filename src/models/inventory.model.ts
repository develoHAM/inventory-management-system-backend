import { IModel } from 'interfaces/IModel';

export interface InventoryModel extends IModel {
	name: string;
	description?: string | null;
	file_url?: string | null;
	date: Date;
}

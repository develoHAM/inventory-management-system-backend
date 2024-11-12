import { IModel } from 'types/IModel';

export interface InventoryModel extends IModel {
	name: string;
	description?: string | null;
	file_url?: string | null;
	created_at?: Date;
	updated_at?: Date;
}

import { IModel } from 'interfaces/IModel';

export interface StoreManagerModel extends IModel {
	name: string;
	phone: string;
	company?: number | null;
}

import { IModel } from 'types/IModel';

export interface StoreManagerModel extends IModel {
	name: string;
	phone: string;
	company?: number | null;
}

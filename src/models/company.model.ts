import { IModel } from 'types/IModel';

export interface CompanyModel extends IModel {
	name: string;
	description?: string | null;
}

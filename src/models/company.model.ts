import { IModel } from 'interfaces/IModel';

export interface CompanyModel extends IModel {
	name: string;
	description?: string | null;
}

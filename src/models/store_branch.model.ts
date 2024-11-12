import { IModel } from 'types/IModel';

export interface StoreBranchModel extends IModel {
	location: string;
	store_manager?: number | null;
	company?: number | null;
}

import { StoreBranchModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'interfaces/IDAO';
import { IDatabase } from 'interfaces/IDatabase';

export class StoreBranchDAO extends DAO<StoreBranchModel> implements IDAO<StoreBranchModel> {
	static tableName: string = 'store_branch';

	constructor(database: IDatabase<any, any, any>) {
		super(database, StoreBranchDAO.tableName);
	}
}

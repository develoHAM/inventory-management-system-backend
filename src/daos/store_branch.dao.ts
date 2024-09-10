import { StoreBranchModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'interfaces/IDAO';
import { IDatabase, IDatabaseConnection } from 'interfaces/IDatabase';

export class StoreBranchDAO
	extends DAO<StoreBranchModel, IDatabaseConnection>
	implements IDAO<StoreBranchModel, IDatabaseConnection>
{
	static tableName: string = 'store_branch';

	constructor(database: IDatabase<any, any, any>) {
		super(database, StoreBranchDAO.tableName);
	}
}

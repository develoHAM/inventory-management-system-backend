import { StoreBranchModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'types/IDAO';
import { IDatabase, IDatabaseConnection } from 'types/IDatabase';

export class StoreBranchDAO
	extends DAO<any, StoreBranchModel, IDatabaseConnection>
	implements IDAO<any, StoreBranchModel, IDatabaseConnection>
{
	static tableName: string = 'store_branch';

	constructor(database: IDatabase<any, any, any>) {
		super(database, StoreBranchDAO.tableName);
	}
}

import { StoreManagerModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'interfaces/IDAO';
import { IDatabase, IDatabaseConnection } from 'interfaces/IDatabase';

export class StoreManagerDAO
	extends DAO<StoreManagerModel, IDatabaseConnection>
	implements IDAO<StoreManagerModel, IDatabaseConnection>
{
	static tableName: string = 'store_manager';

	constructor(database: IDatabase<any, any, any>) {
		super(database, StoreManagerDAO.tableName);
	}
}

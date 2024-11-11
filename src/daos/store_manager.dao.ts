import { StoreManagerModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'types/IDAO';
import { IDatabase, IDatabaseConnection } from 'types/IDatabase';

export class StoreManagerDAO
	extends DAO<any, StoreManagerModel, IDatabaseConnection>
	implements IDAO<any, StoreManagerModel, IDatabaseConnection>
{
	static tableName: string = 'store_manager';

	constructor(database: IDatabase<any, any, any>) {
		super(database, StoreManagerDAO.tableName);
	}
}

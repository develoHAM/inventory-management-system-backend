import { StoreManagerModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'interfaces/IDAO';
import { IDatabase } from 'interfaces/IDatabase';

export class StoreManagerDAO extends DAO<StoreManagerModel> implements IDAO<StoreManagerModel> {
	static tableName: string = 'store_manager';

	constructor(database: IDatabase<any, any, any>) {
		super(database, StoreManagerDAO.tableName);
	}
}

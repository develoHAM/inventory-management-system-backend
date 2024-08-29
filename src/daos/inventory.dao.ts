import { InventoryModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'interfaces/IDAO';
import { IDatabase } from 'interfaces/IDatabase';

export class InventoryDAO extends DAO<InventoryModel> implements IDAO<InventoryModel> {
	static tableName: string = 'inventory';

	constructor(database: IDatabase<any, any, any>) {
		super(database, InventoryDAO.tableName);
	}
}

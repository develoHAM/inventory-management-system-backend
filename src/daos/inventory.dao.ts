import { InventoryModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'interfaces/IDAO';
import { IDatabase, IDatabaseConnection } from 'interfaces/IDatabase';

export class InventoryDAO
	extends DAO<InventoryModel, IDatabaseConnection>
	implements IDAO<InventoryModel, IDatabaseConnection>
{
	static tableName: string = 'inventory';

	constructor(database: IDatabase<any, any, any>) {
		super(database, InventoryDAO.tableName);
	}
}

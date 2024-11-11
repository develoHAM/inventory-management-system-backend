import { InventoryModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'types/IDAO';
import { IDatabase, IDatabaseConnection } from 'types/IDatabase';

export class InventoryDAO
	extends DAO<any, InventoryModel, IDatabaseConnection>
	implements IDAO<any, InventoryModel, IDatabaseConnection>
{
	static tableName: string = 'inventory';

	constructor(database: IDatabase<any, any, any>) {
		super(database, InventoryDAO.tableName);
	}
}

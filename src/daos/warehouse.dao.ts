import { WarehouseModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'interfaces/IDAO';
import { IDatabase, IDatabaseConnection } from 'interfaces/IDatabase';

export class WarehouseDAO
	extends DAO<WarehouseModel, IDatabaseConnection>
	implements IDAO<WarehouseModel, IDatabaseConnection>
{
	static tableName: string = 'warehouse';

	constructor(database: IDatabase<any, any, any>) {
		super(database, WarehouseDAO.tableName);
	}
}

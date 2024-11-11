import { WarehouseModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'types/IDAO';
import { IDatabase, IDatabaseConnection } from 'types/IDatabase';

export class WarehouseDAO
	extends DAO<any, WarehouseModel, IDatabaseConnection>
	implements IDAO<any, WarehouseModel, IDatabaseConnection>
{
	static tableName: string = 'warehouse';

	constructor(database: IDatabase<any, any, any>) {
		super(database, WarehouseDAO.tableName);
	}
}

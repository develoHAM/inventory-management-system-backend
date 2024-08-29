import { WarehouseModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'interfaces/IDAO';
import { IDatabase } from 'interfaces/IDatabase';

export class WarehouseDAO extends DAO<WarehouseModel> implements IDAO<WarehouseModel> {
	static tableName: string = 'warehouse';

	constructor(database: IDatabase<any, any, any>) {
		super(database, WarehouseDAO.tableName);
	}
}

import { ProductInventoryModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'types/IDAO';
import { IDatabase, IDatabaseConnection } from 'types/IDatabase';

export class ProductInventoryDAO
	extends DAO<any, ProductInventoryModel, IDatabaseConnection>
	implements IDAO<any, ProductInventoryModel, IDatabaseConnection>
{
	static tableName: string = 'product_inventory';

	constructor(database: IDatabase<any, any, any>) {
		super(database, ProductInventoryDAO.tableName);
	}
}

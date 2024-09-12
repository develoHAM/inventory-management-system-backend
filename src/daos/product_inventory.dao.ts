import { ProductInventoryModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'interfaces/IDAO';
import { IDatabase, IDatabaseConnection } from 'interfaces/IDatabase';

export class ProductInventoryDAO
	extends DAO<ProductInventoryModel, IDatabaseConnection>
	implements IDAO<ProductInventoryModel, IDatabaseConnection>
{
	static tableName: string = 'product_inventory';

	constructor(database: IDatabase<any, any, any>) {
		super(database, ProductInventoryDAO.tableName);
	}
}

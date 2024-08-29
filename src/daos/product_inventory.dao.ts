import { ProductInventoryModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'interfaces/IDAO';
import { IDatabase } from 'interfaces/IDatabase';

export class ProductInventoryDAO extends DAO<ProductInventoryModel> implements IDAO<ProductInventoryModel> {
	static tableName: string = 'product_inventory';

	constructor(database: IDatabase<any, any, any>) {
		super(database, ProductInventoryDAO.tableName);
	}
}

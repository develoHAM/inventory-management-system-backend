import { ProductBrandModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'interfaces/IDAO';
import { IDatabase, IDatabaseConnection } from 'interfaces/IDatabase';

export class ProductBrandDAO
	extends DAO<ProductBrandModel, IDatabaseConnection>
	implements IDAO<ProductBrandModel, IDatabaseConnection>
{
	static tableName: string = 'product_brand';

	constructor(database: IDatabase<any, any, any>) {
		super(database, ProductBrandDAO.tableName);
	}
}

import { ProductBrandModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'types/IDAO';
import { IDatabase, IDatabaseConnection } from 'types/IDatabase';

export class ProductBrandDAO
	extends DAO<any, ProductBrandModel, IDatabaseConnection>
	implements IDAO<any, ProductBrandModel, IDatabaseConnection>
{
	static tableName: string = 'product_brand';

	constructor(database: IDatabase<any, any, any>) {
		super(database, ProductBrandDAO.tableName);
	}
}

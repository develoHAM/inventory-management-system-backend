import { ProductCategoryModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'interfaces/IDAO';
import { IDatabase, IDatabaseConnection } from 'interfaces/IDatabase';

export class ProductCategoryDAO
	extends DAO<ProductCategoryModel, IDatabaseConnection>
	implements IDAO<ProductCategoryModel, IDatabaseConnection>
{
	static tableName: string = 'product_category';

	constructor(database: IDatabase<any, any, any>) {
		super(database, ProductCategoryDAO.tableName);
	}
}

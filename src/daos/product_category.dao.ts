import { ProductCategoryModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'types/IDAO';
import { IDatabase, IDatabaseConnection } from 'types/IDatabase';

export class ProductCategoryDAO
	extends DAO<any, ProductCategoryModel, IDatabaseConnection>
	implements IDAO<any, ProductCategoryModel, IDatabaseConnection>
{
	static tableName: string = 'product_category';

	constructor(database: IDatabase<any, any, any>) {
		super(database, ProductCategoryDAO.tableName);
	}
}

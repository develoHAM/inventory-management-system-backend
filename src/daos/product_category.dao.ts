import { ProductCategoryModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'interfaces/IDAO';
import { IDatabase } from 'interfaces/IDatabase';

export class ProductCategoryDAO extends DAO<ProductCategoryModel> implements IDAO<ProductCategoryModel> {
	static tableName: string = 'product_category';

	constructor(database: IDatabase<any, any, any>) {
		super(database, ProductCategoryDAO.tableName);
	}
}

import { ProductModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'types/IDAO';
import { IDatabase, IDatabaseConnection } from 'types/IDatabase';

export class ProductDAO
	extends DAO<any, ProductModel, IDatabaseConnection>
	implements IDAO<any, ProductModel, IDatabaseConnection>
{
	static tableName: string = 'product';

	constructor(database: IDatabase<any, any, any>) {
		super(database, ProductDAO.tableName);
	}
}

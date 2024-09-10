import { ProductModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'interfaces/IDAO';
import { IDatabase, IDatabaseConnection } from 'interfaces/IDatabase';

export class ProducDAO
	extends DAO<ProductModel, IDatabaseConnection>
	implements IDAO<ProductModel, IDatabaseConnection>
{
	static tableName: string = 'product';

	constructor(database: IDatabase<any, any, any>) {
		super(database, ProducDAO.tableName);
	}
}

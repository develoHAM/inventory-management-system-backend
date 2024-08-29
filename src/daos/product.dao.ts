import { ProductModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'interfaces/IDAO';
import { IDatabase } from 'interfaces/IDatabase';

export class ProducDAO extends DAO<ProductModel> implements IDAO<ProductModel> {
	static tableName: string = 'product';

	constructor(database: IDatabase<any, any, any>) {
		super(database, ProducDAO.tableName);
	}
}

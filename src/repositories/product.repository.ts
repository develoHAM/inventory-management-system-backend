import { ProductModel } from 'models';
import { Repository } from './Repository';
import { IRepository } from 'types/IRepository';
import { IDatabaseConnection } from 'types/IDatabase';

export class ProductRepository<ResultType, ConnectionType extends IDatabaseConnection>
	extends Repository<ResultType, ProductModel, ConnectionType>
	implements IRepository<ResultType, ProductModel, ConnectionType> {}

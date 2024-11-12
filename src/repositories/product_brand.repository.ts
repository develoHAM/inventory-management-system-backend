import { ProductBrandModel } from 'models';
import { Repository } from './Repository';
import { IRepository } from 'types/IRepository';
import { IDatabaseConnection } from 'types/IDatabase';

export class ProductBrandRepository<ResultType, ConnectionType extends IDatabaseConnection>
	extends Repository<ResultType, ProductBrandModel, ConnectionType>
	implements IRepository<ResultType, ProductBrandModel, ConnectionType> {}

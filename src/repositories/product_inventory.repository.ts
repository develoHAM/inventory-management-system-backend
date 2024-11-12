import { ProductInventoryModel } from 'models';
import { Repository } from './Repository';
import { IRepository } from 'types/IRepository';
import { IDatabaseConnection } from 'types/IDatabase';

export class ProductInventoryRepository<ResultType, ConnectionType extends IDatabaseConnection>
	extends Repository<ResultType, ProductInventoryModel, ConnectionType>
	implements IRepository<ResultType, ProductInventoryModel, ConnectionType> {}

import { ProductCategoryModel } from 'models';
import { Repository } from './Repository';
import { IRepository } from 'types/IRepository';
import { IDatabaseConnection } from 'types/IDatabase';

export class ProductCategoryRepository<ResultType, ConnectionType extends IDatabaseConnection>
	extends Repository<ResultType, ProductCategoryModel, ConnectionType>
	implements IRepository<ResultType, ProductCategoryModel, ConnectionType> {}

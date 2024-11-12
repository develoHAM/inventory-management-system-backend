import { StoreManagerModel } from 'models';
import { Repository } from './Repository';
import { IRepository } from 'types/IRepository';
import { IDatabaseConnection } from 'types/IDatabase';

export class StoreManagerRepository<ResultType, ConnectionType extends IDatabaseConnection>
	extends Repository<ResultType, StoreManagerModel, ConnectionType>
	implements IRepository<ResultType, StoreManagerModel, ConnectionType> {}

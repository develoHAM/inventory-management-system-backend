import { StoreBranchModel } from 'models';
import { Repository } from './Repository';
import { IRepository } from 'types/IRepository';
import { IDatabaseConnection } from 'types/IDatabase';

export class StoreBranchRepository<ResultType, ConnectionType extends IDatabaseConnection>
	extends Repository<ResultType, StoreBranchModel, ConnectionType>
	implements IRepository<ResultType, StoreBranchModel, ConnectionType> {}

import { UserModel } from 'models';
import { Repository } from './Repository';
import { IRepository } from 'types/IRepository';
import { IDatabaseConnection } from 'types/IDatabase';

export class UserRepository<ResultType, ConnectionType extends IDatabaseConnection>
	extends Repository<ResultType, UserModel, ConnectionType>
	implements IRepository<ResultType, UserModel, ConnectionType> {}

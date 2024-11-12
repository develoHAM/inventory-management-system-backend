import { CompanyModel } from 'models';
import { Repository } from './Repository';
import { IRepository } from 'types/IRepository';
import { IDatabaseConnection } from 'types/IDatabase';

export class CompanyRepository<ResultType, ConnectionType extends IDatabaseConnection>
	extends Repository<ResultType, CompanyModel, ConnectionType>
	implements IRepository<ResultType, CompanyModel, ConnectionType> {}

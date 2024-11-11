import { WarehouseModel } from 'models';
import { Repository } from './Repository';
import { IRepository } from 'types/IRepository';
import { IDatabaseConnection } from 'types/IDatabase';

export class WarehouseRepository<ResultType, ConnectionType extends IDatabaseConnection>
	extends Repository<ResultType, WarehouseModel, ConnectionType>
	implements IRepository<ResultType, WarehouseModel, ConnectionType> {}

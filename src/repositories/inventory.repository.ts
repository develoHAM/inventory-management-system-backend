import { InventoryModel } from 'models';
import { Repository } from './Repository';
import { IRepository } from 'types/IRepository';
import { IDatabaseConnection } from 'types/IDatabase';

export class InventoryRepository<ResultType, ConnectionType extends IDatabaseConnection>
	extends Repository<ResultType, InventoryModel, ConnectionType>
	implements IRepository<ResultType, InventoryModel, ConnectionType> {}

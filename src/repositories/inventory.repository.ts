import { InventoryModel } from 'models';
import { Repository } from './Repository';
import { IRepository } from 'interfaces/IRepository';

export class InventoryRepository extends Repository<InventoryModel> implements IRepository<InventoryModel> {}

import { WarehouseModel } from 'models';
import { Repository } from './Repository';
import { IRepository } from 'interfaces/IRepository';

export class WarehouseRepository extends Repository<WarehouseModel> implements IRepository<WarehouseModel> {}

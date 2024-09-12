import { StoreManagerModel } from 'models';
import { Repository } from './Repository';
import { IRepository } from 'interfaces/IRepository';

export class StoreManagerRepository extends Repository<StoreManagerModel> implements IRepository<StoreManagerModel> {}

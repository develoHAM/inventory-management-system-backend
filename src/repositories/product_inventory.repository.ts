import { ProductInventoryModel } from 'models';
import { Repository } from './Repository';
import { IRepository } from 'interfaces/IRepository';

export class ProductInventoryRepository
	extends Repository<ProductInventoryModel>
	implements IRepository<ProductInventoryModel> {}

import { ProductCategoryModel } from 'models';
import { Repository } from './Repository';
import { IRepository } from 'interfaces/IRepository';

export class ProductCategoryRepository
	extends Repository<ProductCategoryModel>
	implements IRepository<ProductCategoryModel> {}

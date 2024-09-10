import { ProductBrandModel } from 'models';
import { Repository } from './Repository';
import { IRepository } from 'interfaces/IRepository';

export class ProductBrandRepository extends Repository<ProductBrandModel> implements IRepository<ProductBrandModel> {}

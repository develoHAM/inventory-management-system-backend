import { ProductModel } from 'models';
import { Repository } from './Repository';
import { IRepository } from 'interfaces/IRepository';

export class ProductRepository extends Repository<ProductModel> implements IRepository<ProductModel> {}

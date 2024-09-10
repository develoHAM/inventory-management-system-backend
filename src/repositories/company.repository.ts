import { CompanyModel } from 'models';
import { Repository } from './Repository';
import { IRepository } from 'interfaces/IRepository';

export class CompanyRepository extends Repository<CompanyModel> implements IRepository<CompanyModel> {}

import { StoreBranchModel } from 'models';
import { Repository } from './Repository';
import { IRepository } from 'interfaces/IRepository';

export class StoreBranchRepository extends Repository<StoreBranchModel> implements IRepository<StoreBranchModel> {}

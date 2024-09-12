import { UserModel } from 'models';
import { Repository } from './Repository';
import { IRepository } from 'interfaces/IRepository';

export class UserRepository extends Repository<UserModel> implements IRepository<UserModel> {}

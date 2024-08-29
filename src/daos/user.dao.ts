import { UserModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'interfaces/IDAO';
import { IDatabase } from 'interfaces/IDatabase';

export class UserDAO extends DAO<UserModel> implements IDAO<UserModel> {
	static tableName: string = 'user';

	constructor(database: IDatabase<any, any, any>) {
		super(database, UserDAO.tableName);
	}
}

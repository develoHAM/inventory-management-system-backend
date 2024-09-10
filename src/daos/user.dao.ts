import { UserModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'interfaces/IDAO';
import { IDatabase, IDatabaseConnection } from 'interfaces/IDatabase';

export class UserDAO extends DAO<UserModel, IDatabaseConnection> implements IDAO<UserModel, IDatabaseConnection> {
	static tableName: string = 'user';

	constructor(database: IDatabase<any, any, any>) {
		super(database, UserDAO.tableName);
	}
}

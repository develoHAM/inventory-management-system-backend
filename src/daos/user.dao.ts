import { UserModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'types/IDAO';
import { IDatabase, IDatabaseConnection } from 'types/IDatabase';

export class UserDAO
	extends DAO<any, UserModel, IDatabaseConnection>
	implements IDAO<any, UserModel, IDatabaseConnection>
{
	static tableName: string = 'user';

	constructor(database: IDatabase<any, any, any>) {
		super(database, UserDAO.tableName);
	}
}

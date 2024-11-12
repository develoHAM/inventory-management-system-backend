import { CompanyModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'types/IDAO';
import { IDatabase, IDatabaseConnection } from 'types/IDatabase';

export class CompanyDAO
	extends DAO<any, CompanyModel, IDatabaseConnection>
	implements IDAO<any, CompanyModel, IDatabaseConnection>
{
	static tableName: string = 'company';

	constructor(database: IDatabase<any, any, any>) {
		super(database, CompanyDAO.tableName);
	}
}

import { CompanyModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'interfaces/IDAO';
import { IDatabase, IDatabaseConnection } from 'interfaces/IDatabase';

export class CompanyDAO
	extends DAO<CompanyModel, IDatabaseConnection>
	implements IDAO<CompanyModel, IDatabaseConnection>
{
	static tableName: string = 'company';

	constructor(database: IDatabase<any, any, any>) {
		super(database, CompanyDAO.tableName);
	}
}

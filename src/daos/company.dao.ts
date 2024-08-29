import { CompanyModel } from 'models';
import { DAO } from './DAO';
import { IDAO } from 'interfaces/IDAO';
import { IDatabase } from 'interfaces/IDatabase';

export class CompanyDAO extends DAO<CompanyModel> implements IDAO<CompanyModel> {
	static tableName: string = 'company';

	constructor(database: IDatabase<any, any, any>) {
		super(database, CompanyDAO.tableName);
	}
}

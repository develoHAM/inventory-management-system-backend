import { IModel } from 'types/IModel';
import { IDatabase, IDatabaseConnection } from 'types/IDatabase';
import { DatabaseQueryError } from '../errors/persistence';
import {
	IDAO,
	ExecuteOperationParameter,
	DatabaseLockMode,
	SelectAllParameter,
	SelectByIdParameter,
	SelectWhereParameter,
	InsertOneParameter,
	UpdateByIdParameter,
	DeleteByIdParameter,
} from '../types/IDAO';

export abstract class DAO<ResultType, ModelType extends IModel, ConnectionType extends IDatabaseConnection>
	implements IDAO<ResultType, ModelType, ConnectionType>
{
	protected database: IDatabase<ResultType, ModelType, ConnectionType>;
	tableName: string;

	constructor(database: IDatabase<ResultType, ModelType, ConnectionType>, tableName: string) {
		this.database = database;
		this.tableName = tableName;
	}

	async executeReadOperation({
		sql,
		values = [],
		connection,
		lock,
	}: ExecuteOperationParameter<ConnectionType>): Promise<ModelType[]> {
		try {
			let rows;
			switch (lock) {
				case DatabaseLockMode.FOR_SHARE:
					sql = this.database.lockForShare(sql);
					break;
				case DatabaseLockMode.FOR_UPDATE:
					sql = this.database.lockForUpdate(sql);
					break;
				default:
					break;
			}

			if (connection) {
				const [result] = await connection.execute<ModelType[]>(sql, values);
				rows = result;
			} else {
				const [result] = await this.database.executeRows(sql, values);
				rows = result;
			}
			return rows;
		} catch (error) {
			throw new DatabaseQueryError(sql, values);
		}
	}

	async executeWriteOperation({
		sql,
		values = [],
		connection,
	}: ExecuteOperationParameter<ConnectionType>): Promise<ResultType> {
		try {
			let executionResult;
			if (connection) {
				const [result] = await connection.execute<ResultType>(sql, values);
				executionResult = result;
			} else {
				const [result] = await this.database.executeResult(sql, values);
				executionResult = result;
			}
			return executionResult;
		} catch (error) {
			throw new DatabaseQueryError(sql, values);
		}
	}

	async selectById({ id, connection, lock }: SelectByIdParameter<ConnectionType>) {
		let sql = `
			SELECT
				*
			FROM
				${this.tableName}
			WHERE
				id = ?;
		`;
		let values = [id];

		return this.executeReadOperation({ sql, values, connection, lock });
	}

	async selectAll({ connection, lock }: SelectAllParameter<ConnectionType> = {}): Promise<ModelType[]> {
		let sql = `
			SELECT
				*
			FROM
				${this.tableName};
		`;

		return await this.executeReadOperation({ sql, connection, lock });
	}

	async selectWhere({ criteria, connection, lock }: SelectWhereParameter<ModelType, ConnectionType>) {
		let sql = `
			SELECT
				*
			FROM
				${this.tableName}
			WHERE
		`;

		let values: any[] = [];
		let conditions = [];

		if (!criteria.id) {
			for (const [key, value] of Object.entries(criteria)) {
				conditions.push(` ${key} = ? `);
				values.push(value);
			}
			sql += ` ${conditions.join(' AND ')}; `;

			return this.executeReadOperation({ sql, values, connection, lock });
		} else {
			sql += ` id = ?; `;
			values.push(criteria.id);

			return this.executeReadOperation({ sql, values, connection, lock });
		}
	}

	async insertOne({ model, connection }: InsertOneParameter<ModelType, ConnectionType>) {
		let sql = `
			INSERT INTO
				${this.tableName}
		`;

		let columns = [];
		let values: any[] = [];

		for (const [key, value] of Object.entries(model)) {
			columns.push(key);
			values.push(value);
		}

		sql += `
			( ${columns.join(', ')} ) 
			VALUES
			( ${new Array(columns.length).fill('?').join(', ')} );
			`;

		return this.executeWriteOperation({ sql, values, connection });
	}

	async updateById({ id, updates, connection }: UpdateByIdParameter<ModelType, ConnectionType>) {
		let sql = `
			UPDATE
				${this.tableName}
			SET
		`;

		let columns: string[] = [];
		let values: any[] = [];

		for (const [key, value] of Object.entries(updates)) {
			columns.push(key);
			values.push(value);
		}

		sql += ` ${columns.map((column) => `${column} = ?`).join(', ')} WHERE id = ?;`;
		values.push(id);

		return this.executeWriteOperation({ sql, values, connection });
	}

	async deleteById({ id, connection }: DeleteByIdParameter<ConnectionType>) {
		let sql = `
			DELETE FROM
				${this.tableName}
			WHERE
				id = ?;
		`;
		let values = [id];
		return this.executeWriteOperation({ sql, values, connection });
	}
}

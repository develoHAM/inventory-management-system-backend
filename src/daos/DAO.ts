import { IModel } from 'interfaces/IModel';
import { IDatabase, IDatabaseConnection } from 'interfaces/IDatabase';
import { DatabaseQueryError } from '../errors/persistence';
import { IDAO, ExecuteOperationParameter } from 'interfaces/IDAO';

export abstract class DAO<ModelType extends IModel, ConnectionType extends IDatabaseConnection>
	implements IDAO<ModelType, ConnectionType>
{
	protected database: IDatabase<any, any, ConnectionType>;
	tableName: string;

	constructor(database: IDatabase<any, any, ConnectionType>, tableName: string) {
		this.database = database;
		this.tableName = tableName;
	}

	async executeReadOperation({
		sql,
		values = [],
		connection,
	}: ExecuteOperationParameter<ConnectionType>): Promise<ModelType[]> {
		try {
			let rows: ModelType[];
			if (connection) {
				const [result] = await connection.execute(sql, values);
				rows = result as ModelType[];
			} else {
				const [result] = await this.database.executeRows(sql, values);
				rows = result as ModelType[];
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
	}: ExecuteOperationParameter<ConnectionType>): Promise<Record<string, any>> {
		try {
			let executionResult: Record<string, any>;
			if (connection) {
				const [result] = await connection.execute(sql, values);
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

	async selectById(id: number, connection?: ConnectionType) {
		let sql = `
			SELECT
				*
			FROM
				${this.tableName}
			WHERE
				id = ?;
		`;
		let values = [id];

		return this.executeReadOperation({ sql, values, connection });
	}

	async selectAll(connection?: ConnectionType): Promise<ModelType[]> {
		let sql = `
			SELECT
				*
			FROM
				${this.tableName};
		`;

		return await this.executeReadOperation({ sql, connection });
	}

	async selectWhere(criteria: Partial<ModelType>, connection?: ConnectionType) {
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

			return this.executeReadOperation({ sql, values, connection });
		} else {
			sql += ` id = ?; `;
			values.push(criteria.id);

			return this.executeReadOperation({ sql, values, connection });
		}
	}

	async insertOne(model: Omit<ModelType, 'id'>, connection?: ConnectionType) {
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

	async updateById(id: number, updates: Partial<Omit<ModelType, 'id'>>, connection?: ConnectionType) {
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

	async deleteById(id: number, connection?: ConnectionType) {
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

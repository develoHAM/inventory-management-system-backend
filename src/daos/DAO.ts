import { IModel } from 'interfaces/IModel';
import { IDatabase } from 'interfaces/IDatabase';
import { DatabaseQueryError } from '../errors/database';
import { IDAO } from 'interfaces/IDAO';

export class DAO<ModelType extends IModel> implements IDAO<ModelType> {
	protected database: IDatabase<any, any, any>;
	tableName: string;

	constructor(database: IDatabase<any, any, any>, tableName: string) {
		this.database = database;
		this.tableName = tableName;
	}

	async executeReadOperation(sql: string, values: any[] = []) {
		try {
			const [rows] = await this.database.executeRows(sql, values);
			return rows;
		} catch (error) {
			throw new DatabaseQueryError(sql, values);
		}
	}

	async executeWriteOperation(sql: string, values: any[] = []) {
		try {
			const [result] = await this.database.executeResult(sql, values);
			return result;
		} catch (error) {
			throw new DatabaseQueryError(sql, values);
		}
	}

	async selectById(id: number) {
		let sql = `
			SELECT
				*
			FROM
				${this.tableName}
			WHERE
				id = ?;
		`;
		let values = [id];

		return this.executeReadOperation(sql, values);
	}

	async selectAll() {
		let sql = `
			SELECT
				*
			FROM
				${this.tableName};
		`;

		return await this.executeReadOperation(sql);
	}

	async selectWhere(criteria: Partial<ModelType>) {
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

			return this.executeReadOperation(sql, values);
		} else {
			sql += ` id = ?; `;
			values.push(criteria.id);

			return this.executeReadOperation(sql, values);
		}
	}

	async insertOne(model: Omit<ModelType, 'id'>) {
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

		return this.executeWriteOperation(sql, values);
	}

	async updateById(id: number, updates: Partial<Omit<ModelType, 'id'>>) {
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

		return this.executeWriteOperation(sql, values);
	}

	async deleteById(id: number) {
		let sql = `
			DELETE FROM
				${this.tableName}
			WHERE
				id = ?;
		`;

		return this.executeWriteOperation(sql, [id]);
	}
}

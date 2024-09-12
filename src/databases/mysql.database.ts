import mysql from 'mysql2/promise';
import fs from 'node:fs/promises';
import path from 'node:path';
import { IDatabase } from 'interfaces/IDatabase';
import { DatabaseConnectionError, DatabaseTableInitializationError } from '../errors/persistence';

export class MySQL implements IDatabase<mysql.ResultSetHeader, mysql.RowDataPacket, mysql.PoolConnection> {
	#dataSource: mysql.Pool;
	#tableInitializationOrder: string[];

	constructor(credentials: mysql.PoolOptions, tableInitializationOrder: string[]) {
		this.#dataSource = this.createPool(credentials);
		this.#tableInitializationOrder = tableInitializationOrder;
	}

	createPool(credentials: mysql.PoolOptions): mysql.Pool {
		return mysql.createPool(credentials);
	}

	async connect(): Promise<boolean> {
		let connection;
		try {
			connection = await this.#dataSource.getConnection();
			await connection.ping();
			return true;
		} catch (error) {
			throw new DatabaseConnectionError('Cannot create database pool');
		} finally {
			if (connection) {
				connection.release();
			}
		}
	}

	async getConnection(): Promise<mysql.PoolConnection> {
		try {
			return await this.#dataSource.getConnection();
		} catch (error: any) {
			throw new DatabaseConnectionError('Cannot get database connection');
		}
	}

	releaseConnection(connection: mysql.PoolConnection): void {
		connection.release();
	}

	async beginTransaction(connection: mysql.PoolConnection): Promise<void> {
		await connection.beginTransaction();
	}

	async commitTransaction(connection: mysql.PoolConnection): Promise<void> {
		await connection.commit();
	}

	async rollbackTransaction(connection: mysql.PoolConnection): Promise<void> {
		await connection.rollback();
	}

	async initializeTables(): Promise<boolean> {
		let connection: mysql.PoolConnection = await this.getConnection();
		let createdTables: string[] = [];
		try {
			const tableDirectory = path.resolve('src', 'databases', 'sql', 'tables');

			for (const sqlFile of this.#tableInitializationOrder) {
				const filePath = path.join(tableDirectory, sqlFile);
				const sql = (await fs.readFile(filePath, 'utf8'))
					.split('\n')
					.map((str) => str.trim())
					.join('');
				await connection.execute(sql);
				createdTables.push(path.basename(path.parse(filePath).name));
			}
			console.log(`Successfully created tables: \n ${createdTables.join('\n ')}`);
			return true;
		} catch (error) {
			console.log(error);
			if (connection) {
				const reversedSortedSqlFiles = [...this.#tableInitializationOrder].reverse();
				for (const sqlFile of reversedSortedSqlFiles) {
					const tableName = path.parse(sqlFile).name;
					await connection.execute(`DROP TABLE IF EXISTS ${tableName}`);
				}
			}
			console.log(`Failed to create tables: \n ${this.#tableInitializationOrder.join('\n ')}`);
			throw new DatabaseTableInitializationError('Cannot initialize tables');
		} finally {
			if (connection) {
				connection.release();
			}
		}
	}

	/** For `SELECT` and `SHOW` */
	get queryRows() {
		this.connect();
		return this.#dataSource.query.bind(this.#dataSource)<mysql.RowDataPacket[]>;
	}

	/** For `SELECT` and `SHOW` with `rowAsArray` as `true` */
	get queryRowsAsArray() {
		this.connect();
		return this.#dataSource.query.bind(this.#dataSource)<mysql.RowDataPacket[][]>;
	}

	/** For `INSERT`, `UPDATE`, etc. */
	get queryResult() {
		this.connect();
		return this.#dataSource.query.bind(this.#dataSource)<mysql.ResultSetHeader>;
	}

	/** For multiple `INSERT`, `UPDATE`, etc. with `multipleStatements` as `true` */
	get queryResults() {
		this.connect();
		return this.#dataSource.query.bind(this.#dataSource)<mysql.ResultSetHeader[]>;
	}

	/** For `SELECT` and `SHOW` */
	get executeRows() {
		this.connect();
		return this.#dataSource.execute.bind(this.#dataSource)<mysql.RowDataPacket[]>;
	}

	/** For `SELECT` and `SHOW` with `rowAsArray` as `true` */
	get executeRowsAsArray() {
		this.connect();
		return this.#dataSource.execute.bind(this.#dataSource)<mysql.RowDataPacket[][]>;
	}

	/** For `INSERT`, `UPDATE`, etc. */
	get executeResult() {
		this.connect();
		return this.#dataSource.execute.bind(this.#dataSource)<mysql.ResultSetHeader>;
	}

	/** For multiple `INSERT`, `UPDATE`, etc. with `multipleStatements` as `true` */
	get executeResults() {
		this.connect();
		return this.#dataSource.execute.bind(this.#dataSource)<mysql.ResultSetHeader[]>;
	}
}

import { it, describe, test, afterAll, beforeAll, afterEach, beforeEach, expect, jest } from '@jest/globals';

import Database from '../../src/databases';
jest.mock('node:path');
import path from 'node:path';
jest.mock('mysql2/promise');
import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import { DatabaseConnectionError, DatabaseTableInitializationError } from '../../src/errors/database';
import { MockInstance } from 'jest-mock';

const mockCredentials = {
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	port: Number(process.env.MYSQL_PORT),
};

const mockTableInitializationOrder = [
	'product_brand.sql',
	'product_category.sql',
	'company.sql',
	'inventory.sql',
	'store_manager.sql',
	'warehouse.sql',
	'product.sql',
	'store_branch.sql',
	'user.sql',
	'product_inventory.sql',
];

describe('MySQL Class', () => {
	let db: Database;
	let mockConnection: PoolConnection;
	let mockPool: Pool;
	let spyDbConnect: MockInstance<() => Promise<boolean>>;
	let boundQueryFunction: Function;
	let boundExecuteFunction: Function;

	beforeEach(() => {
		mockConnection = {
			ping: jest.fn(() => Promise.resolve()),
			beginTransaction: jest.fn(() => Promise.resolve()),
			commit: jest.fn(() => Promise.resolve()),
			rollback: jest.fn(() => Promise.resolve()),
			release: jest.fn(),
			query: jest.fn(),
			execute: jest.fn(),
		} as unknown as PoolConnection;

		mockPool = {
			getConnection: jest.fn(() => Promise.resolve(mockConnection)),
			query: jest.fn(),
			execute: jest.fn(),
		} as unknown as Pool;

		(mysql.createPool as jest.Mock).mockReturnValue(mockPool);

		boundQueryFunction = mockPool.query.bind(mockPool);
		boundExecuteFunction = mockPool.execute.bind(mockPool);

		db = new Database(mockCredentials, mockTableInitializationOrder);

		spyDbConnect = jest.spyOn(db, 'connect');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('createPool()', () => {
		it('calls mysql.createPool() with given credentials and then returns the value', () => {
			expect(mysql.createPool).toBeCalledWith(mockCredentials);
		});
	});

	describe('connect()', () => {
		it('returns true when connection is successful and then releases connection if exists', async () => {
			const connectResult = await db.connect();
			expect(mockPool.getConnection).toBeCalled();
			expect(mockConnection.ping).toBeCalled();
			expect(connectResult).toBe(true);
			expect(mockConnection.release).toBeCalled();
		});

		it('throws when .getConnection() fails and does not release connection', async () => {
			(mockPool.getConnection as jest.Mock).mockImplementationOnce(() =>
				Promise.reject(new Error('getConnection() error'))
			);
			await expect(db.connect()).rejects.toThrow(DatabaseConnectionError);
			expect(mockConnection.release).not.toBeCalled();
		});

		it('throws when .ping() fails and releases connection', async () => {
			(mockConnection.ping as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error('ping() error')));
			await expect(db.connect()).rejects.toThrow(DatabaseConnectionError);
			expect(mockConnection.release).toBeCalled();
		});
	});

	describe('getConnection()', () => {
		it('returns connection', async () => {
			const connection = await db.getConnection();
			expect(connection).toBeDefined();
			expect(mockPool.getConnection).toBeCalled();
			connection.release();
		});

		it('throws when getting connection fails', async () => {
			(mockPool.getConnection as jest.Mock).mockImplementationOnce(() =>
				Promise.reject(new Error('getConnection() error'))
			);
			await expect(db.getConnection()).rejects.toThrow(DatabaseConnectionError);
		});
	});

	describe('releaseConnection()', () => {
		it('calls .release() from the connection object provided', () => {
			db.releaseConnection(mockConnection);
			expect(mockConnection.release).toBeCalled();
		});
	});

	describe('beginTransaction()', () => {
		it('calls .beginTransaction() from the connection object provided', async () => {
			await db.beginTransaction(mockConnection);
			expect(mockConnection.beginTransaction).toBeCalled();
		});
	});

	describe('commitTransaction()', () => {
		it('calls .commit() from the connection object provided', async () => {
			await db.commitTransaction(mockConnection);
			expect(mockConnection.commit).toBeCalled();
		});
	});

	describe('rollbackTransaction()', () => {
		it('calls .rollback() from the connection object provided', async () => {
			await db.rollbackTransaction(mockConnection);
			expect(mockConnection.rollback).toBeCalled();
		});
	});

	describe('initializeTables()', () => {
		beforeEach(() => {
			(path.resolve as jest.Mock).mockImplementation((...args) => {
				return process.cwd() + '/' + args.join('/');
			});

			(path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
			(path.parse as jest.Mock).mockImplementation((arg) => {
				return {
					name: (arg as string).replace('.sql', ''),
				};
			});
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		it('creates table in the order of tableInitializationOrder provided during instantiation', async () => {
			const initializeTablesResult = await db.initializeTables();
			expect(mockPool.getConnection).toBeCalledTimes(1);
			expect(path.resolve).toBeCalledTimes(1);
			expect(path.join).toBeCalledTimes(mockTableInitializationOrder.length);
			expect(mockConnection.execute).toBeCalledTimes(mockTableInitializationOrder.length);
			expect(initializeTablesResult).toBe(true);
			expect(mockConnection.release).toBeCalledTimes(1);
		});

		it('drops table in the reverse order of tableInitializationOrder provided during instantiation if an error occurs', async () => {
			const reversed = [...mockTableInitializationOrder].reverse();
			(mockConnection.execute as jest.Mock).mockImplementationOnce(() =>
				Promise.reject(new Error('execute() error'))
			);

			await expect(db.initializeTables()).rejects.toThrow(DatabaseTableInitializationError);

			expect(mockPool.getConnection).toBeCalledTimes(1);
			expect(path.resolve).toBeCalledTimes(1);
			expect(path.join).toBeCalledTimes(1);

			for (const tableName of reversed) {
				expect(mockConnection.execute).toHaveBeenCalledWith(
					expect.stringContaining(`DROP TABLE IF EXISTS ${tableName.replace('.sql', '')}`)
				);
			}
			expect(mockConnection.release).toBeCalledTimes(1);
		});
	});

	describe('get queryRows()', () => {
		it('calls connect()', () => {
			const queryRows = db.queryRows;
			expect(spyDbConnect).toHaveBeenCalledTimes(1);
		});

		it('returns pool.query() bound to the dataSource', () => {
			const queryRows = db.queryRows;
			expect(queryRows.name).toBe(boundQueryFunction.name);
			expect(queryRows.length).toBe(boundQueryFunction.length);
			expect(queryRows.toString()).toBe(boundQueryFunction.toString());
		});
	});

	describe('get queryRowsAsArray()', () => {
		it('calls connect()', () => {
			const queryRowsAsArray = db.queryRowsAsArray;
			expect(spyDbConnect).toHaveBeenCalledTimes(1);
		});

		it('returns pool.query() bound to the dataSource', () => {
			const queryRowsAsArray = db.queryRowsAsArray;
			expect(queryRowsAsArray.name).toBe(boundQueryFunction.name);
			expect(queryRowsAsArray.length).toBe(boundQueryFunction.length);
			expect(queryRowsAsArray.toString()).toBe(boundQueryFunction.toString());
		});
	});

	describe('get queryResult()', () => {
		it('calls connect()', () => {
			const queryResult = db.queryResult;
			expect(spyDbConnect).toHaveBeenCalledTimes(1);
		});

		it('returns pool.query() bound to the dataSource', () => {
			const queryResult = db.queryResult;
			expect(queryResult.name).toBe(boundQueryFunction.name);
			expect(queryResult.length).toBe(boundQueryFunction.length);
			expect(queryResult.toString()).toBe(boundQueryFunction.toString());
		});
	});

	describe('get queryResults()', () => {
		it('calls connect()', () => {
			const queryResults = db.queryResults;
			expect(spyDbConnect).toHaveBeenCalledTimes(1);
		});

		it('returns pool.query() bound to the dataSource', () => {
			const queryResults = db.queryResults;
			expect(queryResults.name).toBe(boundQueryFunction.name);
			expect(queryResults.length).toBe(boundQueryFunction.length);
			expect(queryResults.toString()).toBe(boundQueryFunction.toString());
		});
	});

	describe('get executeRows()', () => {
		it('calls connect()', () => {
			const executeRows = db.executeRows;
			expect(spyDbConnect).toHaveBeenCalledTimes(1);
		});

		it('returns pool.execute() bound to the dataSource', () => {
			const executeRows = db.executeRows;
			expect(executeRows.name).toBe(boundExecuteFunction.name);
			expect(executeRows.length).toBe(boundExecuteFunction.length);
			expect(executeRows.toString()).toBe(boundExecuteFunction.toString());
		});
	});

	describe('get executeRowsAsArray()', () => {
		it('calls connect()', () => {
			const executeRowsAsArray = db.executeRowsAsArray;
			expect(spyDbConnect).toHaveBeenCalledTimes(1);
		});

		it('returns pool.execute() bound to the dataSource', () => {
			const executeRowsAsArray = db.executeRowsAsArray;
			expect(executeRowsAsArray.name).toBe(boundExecuteFunction.name);
			expect(executeRowsAsArray.length).toBe(boundExecuteFunction.length);
			expect(executeRowsAsArray.toString()).toBe(boundExecuteFunction.toString());
		});
	});

	describe('get executeResult()', () => {
		it('calls connect()', () => {
			const executeRowsAsArray = db.executeResult;
			expect(spyDbConnect).toHaveBeenCalledTimes(1);
		});

		it('returns pool.execute() bound to the dataSource', () => {
			const executeResult = db.executeResult;
			expect(executeResult.name).toBe(boundExecuteFunction.name);
			expect(executeResult.length).toBe(boundExecuteFunction.length);
			expect(executeResult.toString()).toBe(boundExecuteFunction.toString());
		});
	});

	describe('get executeResults()', () => {
		it('calls connect()', () => {
			const executeResults = db.executeResults;
			expect(spyDbConnect).toHaveBeenCalledTimes(1);
		});

		it('returns pool.execute() bound to the dataSource', () => {
			const executeResults = db.executeResults;
			expect(executeResults.name).toBe(boundExecuteFunction.name);
			expect(executeResults.length).toBe(boundExecuteFunction.length);
			expect(executeResults.toString()).toBe(boundExecuteFunction.toString());
		});
	});
});

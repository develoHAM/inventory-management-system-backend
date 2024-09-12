import { jest, it, describe, beforeAll, beforeEach, afterAll, afterEach, expect } from '@jest/globals';
import { TransactionHandler } from '../../src/databases/TransactionHandler';
import { IDatabase } from '../../src/interfaces/IDatabase';
import { ITransactionHandler } from '../../src/interfaces/ITransactionHandler';
import { TransactionHandlingError, DatabaseConnectionError } from '../../src/errors/persistence';
jest.mock('../../src/databases');
import Database from '../../src/databases';

describe('TransactionHandler', () => {
	let db: IDatabase<any, any, any>;
	let transactionHandler: ITransactionHandler;
	let testConnection: { test: 'testConnection' };
	beforeEach(() => {
		db = new Database({}, []);
		transactionHandler = new TransactionHandler(db);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getConnection()', () => {
		it('returns a connection object by calling database.getConnection()', async () => {
			(db.getConnection as jest.Mock).mockImplementationOnce(() => Promise.resolve(testConnection));
			const connection = await transactionHandler.getConnection();
			expect(db.getConnection).toBeCalledTimes(1);
			expect(connection).toEqual(testConnection);
		});
		it('rethrows DatabaseConnectionError upon failure', async () => {
			(db.getConnection as jest.Mock).mockImplementationOnce(() =>
				Promise.reject(new DatabaseConnectionError('cannot connect to database'))
			);
			await expect(transactionHandler.getConnection()).rejects.toThrowError(DatabaseConnectionError);
		});
		it('throws TransactionHandlingError if error is unknown', async () => {
			(db.getConnection as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error('test')));
			await expect(transactionHandler.getConnection()).rejects.toThrowError(TransactionHandlingError);
		});
	});

	describe('begin()', () => {
		it('calls database.beginTransaction() with the connection object provided then, returns true', async () => {
			const result = await transactionHandler.begin(testConnection as any);
			expect(db.beginTransaction).toBeCalledWith(testConnection);
			expect(result).toBe(true);
		});
		it('rethrows DatabaseConnectionError upon failure', async () => {
			(db.beginTransaction as jest.Mock).mockImplementationOnce(() =>
				Promise.reject(new DatabaseConnectionError('cannot connect to database'))
			);
			await expect(transactionHandler.begin(testConnection as any)).rejects.toThrowError(DatabaseConnectionError);
		});
		it('throws TransactionHandlingError if error is unknown', async () => {
			(db.beginTransaction as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error('test')));
			await expect(transactionHandler.begin(testConnection as any)).rejects.toThrowError(
				TransactionHandlingError
			);
		});
	});

	describe('commit()', () => {
		it('calls database.commitTransaction() with the connection object provided, then, returns true', async () => {
			const result = await transactionHandler.commit(testConnection as any);
			expect(db.commitTransaction).toBeCalledWith(testConnection);
			expect(db.commitTransaction).toBeCalledTimes(1);
			expect(result).toBe(true);
		});

		it('rethrows DatabaseConnectionError upon failure', async () => {
			(db.commitTransaction as jest.Mock).mockImplementationOnce(() =>
				Promise.reject(new DatabaseConnectionError('cannot connect to database'))
			);
			await expect(transactionHandler.commit(testConnection as any)).rejects.toThrowError(
				DatabaseConnectionError
			);
		});
		it('throws TransactionHandlingError if error is unknown', async () => {
			(db.commitTransaction as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error('test')));
			await expect(transactionHandler.commit(testConnection as any)).rejects.toThrowError(
				TransactionHandlingError
			);
		});
	});

	describe('rollback()', () => {
		it('calls database.rollbackTransaction() with the connection object provided, then, returns true', async () => {
			const result = await transactionHandler.rollback(testConnection as any);
			expect(db.rollbackTransaction).toBeCalledWith(testConnection);
			expect(db.rollbackTransaction).toBeCalledTimes(1);
			expect(result).toBe(true);
		});

		it('rethrows DatabaseConnectionError upon failure', async () => {
			(db.rollbackTransaction as jest.Mock).mockImplementationOnce(() =>
				Promise.reject(new DatabaseConnectionError('cannot connect to database'))
			);
			await expect(transactionHandler.rollback(testConnection as any)).rejects.toThrowError(
				DatabaseConnectionError
			);
		});
		it('throws TransactionHandlingError if error is unknown', async () => {
			(db.rollbackTransaction as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error('test')));
			await expect(transactionHandler.rollback(testConnection as any)).rejects.toThrowError(
				TransactionHandlingError
			);
		});
	});

	describe('end', () => {
		it('calls database.releaseConnection() with the connection object provided, then, returns true', () => {
			const result = transactionHandler.end(testConnection as any);
			expect(db.releaseConnection).toBeCalledWith(testConnection);
			expect(db.releaseConnection).toBeCalledTimes(1);
			expect(result).toBe(true);
		});

		it('rethrows DatabaseConnectionError upon failure', () => {
			(db.releaseConnection as jest.Mock).mockImplementationOnce(() => {
				throw new DatabaseConnectionError('test');
			});
			expect(() => transactionHandler.end(testConnection as any)).toThrowError(DatabaseConnectionError);
		});
		it('throws TransactionHandlingError if error is unknown', () => {
			(db.releaseConnection as jest.Mock).mockImplementationOnce(() => {
				throw new Error('test');
			});
			expect(() => transactionHandler.end(testConnection as any)).toThrowError(TransactionHandlingError);
		});
	});
});

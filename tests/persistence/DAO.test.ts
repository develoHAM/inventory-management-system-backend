//@ts-nocheck
import { jest, it, describe, afterEach, beforeEach, expect } from '@jest/globals';
import {
	CompanyDAO,
	InventoryDAO,
	ProductBrandDAO,
	ProductCategoryDAO,
	ProductInventoryDAO,
	ProductDAO,
	StoreBranchDAO,
	StoreManagerDAO,
	UserDAO,
	WarehouseDAO,
	DAO,
} from '../../src/daos';

import {
	CompanyModel,
	InventoryModel,
	ProductBrandModel,
	ProductCategoryModel,
	ProductInventoryModel,
	ProductModel,
	StoreBranchModel,
	StoreManagerModel,
	UserModel,
	WarehouseModel,
} from '../../src/models';
import { DatabaseQueryError } from '../../src/errors/persistence';
import { IDatabase, IDatabaseConnection } from '../../src/types/IDatabase';
import { DatabaseLockMode } from '../../src/types/IDAO';
import { IModel } from '../../src/types/IModel';
import { UserType } from '../../src/models/user.model';

const daoClasses = [
	{
		DAOClass: CompanyDAO,
		name: 'company',
		testId: 1,
		criteriaWithId: { id: 2 },
		criteriaWithoutId: { name: 'test', description: 'test' },
		updates: { role: 'new' },
	},
	{
		DAOClass: InventoryDAO,
		name: 'inventory',
		testId: 1,
		criteriaWithId: { id: 2 },
		criteriaWithoutId: {
			name: 'test',
			description: 'test',
			date: new Date(),
		},
		updates: { role: 'new' },
	},
	{
		DAOClass: ProductBrandDAO,
		name: 'product_brand',
		testId: 1,
		criteriaWithId: { id: 2 },
		criteriaWithoutId: { name: 'test', description: 'test' },
		updates: { role: 'new' },
	},
	{
		DAOClass: ProductCategoryDAO,
		name: 'product_category',
		testId: 1,
		criteriaWithId: { id: 2 },
		criteriaWithoutId: { name: 'test', description: 'test' },
		updates: { role: 'new' },
	},
	{
		DAOClass: ProductInventoryDAO,
		name: 'product_inventory',
		testId: 1,
		criteriaWithId: { id: 2 },
		criteriaWithoutId: { quantity: 3, product: 1, user: 1, warehouse: 1, inventory: 1 },
		updates: { role: 'new' },
	},
	{
		DAOClass: ProductDAO,
		name: 'product',
		testId: 1,
		criteriaWithId: { id: 2 },
		criteriaWithoutId: {
			name: 'test',
			role: 'test',
			color: 'blue',
			product_brand: 1,
			product_category: 1,
			price: 100,
			image_url: 'test',
			code: '123123',
		} as Omit<ProductModel, 'id'>,
		updates: { role: 'new' },
	},
	{
		DAOClass: StoreBranchDAO,
		name: 'store_branch',
		testId: 1,
		criteriaWithId: { id: 2 },
		criteriaWithoutId: { location: 'test', store_manager: 1 },
		updates: { role: 'new' },
	},
	{
		DAOClass: StoreManagerDAO,
		name: 'store_manager',
		testId: 1,
		criteriaWithId: { id: 2 },
		criteriaWithoutId: { name: 'test', phone: 'test' },
		updates: { role: 'new' },
	},
	{
		DAOClass: UserDAO,
		name: 'user',
		testId: 1,
		criteriaWithId: { id: 2 },
		criteriaWithoutId: {
			name: 'test',
			user_type: UserType.STORE_STAFF,
			username: 'test',
			email: 'test',
			password: 'test',
			company: 1,
			store_branch: 1,
			phone: '123123',
		} as Omit<UserModel, 'id'>,
		updates: { role: 'new' },
	},
	{
		DAOClass: WarehouseDAO,
		name: 'warehouse',
		testId: 1,
		criteriaWithId: { id: 2 },
		criteriaWithoutId: { name: 'test', store_branch: 1 },
		updates: { role: 'new' },
	},
];

describe('DAOs', () => {
	let mockDB: IDatabase<any, any, any>;
	beforeEach(() => {
		mockDB = {
			executeRows: jest.fn().mockImplementation(() => Promise.resolve([[], {}])), // Mock implementation for executeRows
			executeResult: jest.fn().mockImplementation(() => Promise.resolve([{}, {}])), // Mock implementation for executeResult
			// Mock other methods as needed
			lockForUpdate: jest.fn().mockImplementation(() => ''),
			lockForShare: jest.fn().mockImplementation(() => ''),
		} as unknown as jest.Mocked<IDatabase<any, any, any>>;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('DAO classes', () => {
		describe('tableName', () => {
			it.concurrent.each(daoClasses)(
				'"$DAOClass.name" has "$name" as the tableName when instantiated',
				async ({ DAOClass, name }) => {
					const daoInstance = new DAOClass({} as IDatabase<any, any, any>) as DAO<
						any,
						IModel,
						IDatabaseConnection
					>;
					expect(daoInstance.tableName).toBe(name);
				}
			);
		});

		describe('executeReadOperation()', () => {
			it.each(daoClasses)(
				'$DAOClass.name instance should call database.executeRows() when executeReadOperation() method is called with sql string and optional values provided as arguments, then return the rows',
				async ({ DAOClass, name }) => {
					const daoInstance = new DAOClass(mockDB);
					const sql = `SELECT * FROM ${name} WHERE id = ?;`;
					const values = [1];
					const result = await daoInstance.executeReadOperation({ sql, values });
					expect(mockDB.executeRows).toHaveBeenCalledWith(sql, values);
					expect(result).toEqual([]);
				}
			);

			it.each(daoClasses)(
				'$DAOClass.name instance should call connection.execute() when executeReadOperation() method is called with sql string, optional values, and a connection object provided as arguments, then return the rows',
				async ({ DAOClass, name }) => {
					const daoInstance = new DAOClass(mockDB);
					const sql = `SELECT * FROM ${name} WHERE id = ?;`;
					const values = [1];
					const connection = {
						execute: jest.fn().mockImplementation(() => Promise.resolve([[], {}])),
					};
					const result = await daoInstance.executeReadOperation({
						sql,
						values,
						connection: connection as unknown as IDatabaseConnection,
					});
					expect(connection.execute).toHaveBeenCalledWith(sql, values);
					expect(result).toEqual([]);
				}
			);

			it.each(daoClasses)(
				'$DAOClass.name instance should call database.lockForUpdate(), and then connection.execute() when executeReadOperation() method is called with the sql string, optional values, a lock enum as DatabaseLockMode.FOR_UPDATE, and a connection object provided as arguments, then return the result',
				async ({ DAOClass, name }) => {
					const daoInstance = new DAOClass(mockDB);
					const sql = `SELECT * FROM ${name} WHERE id = ?;`;
					const values = [1];
					const connection = {
						execute: jest.fn().mockImplementation(() => Promise.resolve([[], {}])),
					};
					const result = await daoInstance.executeReadOperation({
						sql: sql,
						values: values,
						lock: DatabaseLockMode.FOR_UPDATE,
						connection: connection as unknown as IDatabaseConnection,
					});
					expect(mockDB.lockForUpdate).toHaveBeenCalledWith(sql);
					expect(connection.execute as jest.Mock).toHaveBeenCalledWith('', values);
					expect(result).toEqual([]);
				}
			);

			it.each(daoClasses)(
				'$DAOClass.name instance should call database.lockForShare(), and then connection.execute() when executeReadOperation() method is called with the sql string, optional values, a lock enum as DatabaseLockMode.FOR_SHARE, and a connection object provided as arguments, then return the result',
				async ({ DAOClass, name }) => {
					const daoInstance = new DAOClass(mockDB);
					const sql = `SELECT * FROM ${name} WHERE id = ?;`;
					const values = [1];
					const connection = {
						execute: jest.fn().mockImplementation(() => Promise.resolve([[], {}])),
					};
					const result = await daoInstance.executeReadOperation({
						sql,
						values,
						lock: DatabaseLockMode.FOR_SHARE,
						connection: connection as unknown as IDatabaseConnection,
					});
					expect(mockDB.lockForShare).toHaveBeenCalledWith(sql);
					expect(connection.execute).toHaveBeenCalled();
					expect(result).toEqual([]);
				}
			);

			it.each(daoClasses)(
				'$DAOClass.name instance should call database.executeRows() when executeReadOperation() method is called only with the sql string, then return the result',
				async ({ DAOClass, name }) => {
					const daoInstance = new DAOClass(mockDB);
					const sql = `SELECT * FROM ${name} WHERE id = ?;`;
					const result = await daoInstance.executeReadOperation({ sql });
					const values: any[] = [];
					expect(mockDB.executeRows).toHaveBeenCalledWith(sql, values);
					expect(result).toEqual([]);
				}
			);

			it.each(daoClasses)(
				'$DAOClass.name instance should call database.lockForUpdate(), and then database.executeRows() when executeReadOperation() method is called with the sql string and lock enum as DatabaseLockMode.FOR_UPDATE then return the result',
				async ({ DAOClass, name }) => {
					const daoInstance = new DAOClass(mockDB);
					const sql = `SELECT * FROM ${name} WHERE id = ?;`;
					const values: any[] = [];
					const result = await daoInstance.executeReadOperation({
						sql: sql,
						values,
						lock: DatabaseLockMode.FOR_UPDATE,
					});
					expect(mockDB.lockForUpdate).toHaveBeenCalledWith(sql);
					expect(result).toEqual([]);
				}
			);

			it.each(daoClasses)(
				'$DAOClass.name instance should call database.lockForShare(), and then database.executeRows() when executeReadOperation() method is called with the sql string and lock enum as DatabaseLockMode.FOR_UPDATE then return the result',
				async ({ DAOClass, name }) => {
					const daoInstance = new DAOClass(mockDB);
					const sql = `SELECT * FROM ${name} WHERE id = ?;`;
					const values: any[] = [];
					const result = await daoInstance.executeReadOperation({
						sql: sql,
						values,
						lock: DatabaseLockMode.FOR_SHARE,
					});
					expect(mockDB.lockForShare).toHaveBeenCalledWith(sql);
					expect(result).toEqual([]);
				}
			);

			it.each(daoClasses)(
				'$DAOClass.name instance should throw DatabaseQueryError with the sql string and values when it fails',
				async ({ DAOClass, name }) => {
					(mockDB.executeRows as jest.Mock).mockImplementationOnce(() =>
						Promise.reject(new Error('executeReadOperation() error'))
					);
					const daoInstance = new DAOClass(mockDB);
					const sql = `SELECT * FROM ${name} WHERE id = ?;`;
					const values = [1];
					await expect(daoInstance.executeReadOperation({ sql, values })).rejects.toThrow(DatabaseQueryError);
				}
			);
		});

		describe('executeWriteOperation()', () => {
			it.each(daoClasses)(
				'$DAOClass.name instance should call database.executeResult() when executeWriteOperation() method is called with sql string and optional values provided as arguments, then return the result',
				async ({ DAOClass, name }) => {
					const daoInstance = new DAOClass(mockDB);
					const sql = `INSERT INTO ${name} (name) VALUES (?);`;
					const values = ['TEST'];
					const result = await daoInstance.executeWriteOperation({ sql, values });
					expect(mockDB.executeResult).toHaveBeenCalledWith(sql, values);
					expect(result).toEqual({});
				}
			);

			it.each(daoClasses)(
				'$DAOClass.name instance should call connection.execute() when executeWriteOperation() method is called with sql string, optional values, and a connection object provided as arguments, then return the result',
				async ({ DAOClass, name }) => {
					const daoInstance = new DAOClass(mockDB);
					const sql = `SELECT * FROM ${name} WHERE id = ?;`;
					const values = [1];
					const connection = {
						execute: jest.fn().mockImplementation(() => Promise.resolve([{}, {}])),
					};
					const result = await daoInstance.executeWriteOperation({
						sql,
						values,
						connection: connection as unknown as IDatabaseConnection,
					});
					expect(connection.execute).toHaveBeenCalledWith(sql, values);
					expect(result).toEqual({});
				}
			);

			it.each(daoClasses)(
				'$DAOClass.name instance should call database.executeResult() when executeWriteOperation() method is called only with the sql string, then return the result',
				async ({ DAOClass, name }) => {
					const daoInstance = new DAOClass(mockDB);
					const sql = `INSERT INTO ${name} (name) VALUES (?);`;
					const result = await daoInstance.executeWriteOperation({ sql });
					const values: any[] = [];
					expect(mockDB.executeResult).toHaveBeenCalledWith(sql, values);
					expect(result).toEqual({});
				}
			);

			it.each(daoClasses)(
				'$DAOClass.name instance should throw DatabaseQueryError with the sql string and values when it fails',
				async ({ DAOClass, name }) => {
					(mockDB.executeResult as jest.Mock).mockImplementationOnce(() =>
						Promise.reject(new Error('executeWriteOperation() error'))
					);
					const daoInstance = new DAOClass(mockDB);
					const sql = `INSERT INTO ${name} (name) VALUES (?);`;
					const values = ['TEST'];
					await expect(daoInstance.executeWriteOperation({ sql, values })).rejects.toThrow(
						DatabaseQueryError
					);
				}
			);
		});

		describe('CRUD methods', () => {
			let mockDB = {
				executeRows: jest.fn().mockImplementation(() => Promise.resolve([[], {}])), // Mock implementation for executeRows
				executeResult: jest.fn().mockImplementation(() => Promise.resolve([{}, {}])), // Mock implementation for executeResult
				// Mock other methods as needed
			} as unknown as jest.Mocked<IDatabase<any, any, any>>;
			let spyExecuteReadOperation: jest.SpiedFunction<
				DAO<any, IModel, IDatabaseConnection>['executeReadOperation']
			>;
			let spyExecuteWriteOperation: jest.SpiedFunction<
				DAO<any, IModel, IDatabaseConnection>['executeWriteOperation']
			>;
			let mockConnection = {
				execute: jest.fn(async (sql: string, values: any[]) => {
					if (sql.includes('SELECT')) {
						return [[], {}];
					} else {
						return [{}, {}];
					}
				}),
			} as unknown as IDatabaseConnection;
			beforeEach(() => {
				spyExecuteReadOperation = jest.spyOn(DAO.prototype, 'executeReadOperation');
				spyExecuteWriteOperation = jest.spyOn(DAO.prototype, 'executeWriteOperation');
			});

			afterEach(() => {
				jest.clearAllMocks();
			});

			describe('selectById()', () => {
				it.each(daoClasses)(
					'$DAOClass.name calls executeReadOperation() on $name with "id" provided as "$testId", then returns its result',
					async ({ DAOClass, testId, name }) => {
						const daoInstance = new DAOClass(mockDB);
						const result = await daoInstance.selectById({ id: testId });
						const expectedSQL = `
			SELECT
				*
			FROM
				${name}
			WHERE
				id = ?;
		`;
						expect(spyExecuteReadOperation).toBeCalledWith({
							sql: expectedSQL,
							values: [testId],
							connection: undefined,
						});
						expect(result).toEqual([]);
					}
				);

				it.each(daoClasses)(
					'$DAOClass.name calls executeReadOperation() on $name with "id" provided as "$testId" and a connection object, then returns its result',
					async ({ DAOClass, testId, name }) => {
						const daoInstance = new DAOClass(mockDB);
						const result = await daoInstance.selectById({ id: testId, connection: mockConnection });
						const expectedSQL = `
			SELECT
				*
			FROM
				${name}
			WHERE
				id = ?;
		`;
						expect(spyExecuteReadOperation).toBeCalledWith({
							sql: expectedSQL,
							values: [testId],
							connection: mockConnection,
						});
						expect(result).toEqual([]);
					}
				);
			});

			describe('selectAll()', () => {
				it.each(daoClasses)(
					'$DAOClass.name calls executeReadOperation() on $name, then returns its result',
					async ({ DAOClass, name }) => {
						const daoInstance = new DAOClass(mockDB);
						const result = await daoInstance.selectAll();
						const expectedSQL = `
			SELECT
				*
			FROM
				${name};
		`;
						expect(spyExecuteReadOperation).toBeCalledWith({ sql: expectedSQL, connection: undefined });
						expect(result).toEqual([]);
					}
				);

				it.each(daoClasses)(
					'$DAOClass.name calls executeReadOperation() on $name with "id" provided as "$testId" and a connection object, then returns its result',
					async ({ DAOClass, name }) => {
						const daoInstance = new DAOClass(mockDB);
						const result = await daoInstance.selectAll({ connection: mockConnection });
						const expectedSQL = `
			SELECT
				*
			FROM
				${name};
		`;
						expect(spyExecuteReadOperation).toBeCalledWith({
							sql: expectedSQL,
							connection: mockConnection,
						});
						expect(result).toEqual([]);
					}
				);
			});

			describe('selectWhere()', () => {
				it.each(daoClasses)(
					'$DAOClass.name calls executeReadOperation() on $name, then returns its result when criteria with id is given',
					async ({ DAOClass, name, criteriaWithId }) => {
						const daoInstance = new DAOClass(mockDB);
						const result = await daoInstance.selectWhere({ criteria: criteriaWithId });
						const expectedSQL =
							`
			SELECT
				*
			FROM
				${name}
			WHERE
		` + ` id = ?; `;
						const values = [criteriaWithId.id];
						expect(spyExecuteReadOperation).toBeCalledWith({
							sql: expectedSQL,
							values,
							connection: undefined,
						});
						expect(result).toEqual([]);
					}
				);

				it.each(daoClasses)(
					'$DAOClass.name calls executeReadOperation() on $name with a connection object, then returns its result when criteria with id is given',
					async ({ DAOClass, name, criteriaWithId }) => {
						const daoInstance = new DAOClass(mockDB);
						const result = await daoInstance.selectWhere({
							criteria: criteriaWithId,
							connection: mockConnection,
						});
						const expectedSQL =
							`
			SELECT
				*
			FROM
				${name}
			WHERE
		` + ` id = ?; `;
						const values = [criteriaWithId.id];
						expect(spyExecuteReadOperation).toBeCalledWith({
							sql: expectedSQL,
							values,
							connection: mockConnection,
						});
						expect(result).toEqual([]);
					}
				);

				it.each(daoClasses)(
					'$DAOClass.name calls executeReadOperation() on $name, then returns its result when criteria without id is given',
					async ({ DAOClass, name, criteriaWithoutId }) => {
						const daoInstance = new DAOClass(mockDB);
						const result = await daoInstance.selectWhere({ criteria: criteriaWithoutId });
						let expectedSQL = `
			SELECT
				*
			FROM
				${name}
			WHERE
		`;
						let conditions: string[] = [];
						for (const [key, value] of Object.entries(criteriaWithoutId)) {
							conditions.push(` ${key} = ? `);
						}
						expectedSQL += ` ${conditions.join(' AND ')}; `;

						const values = Object.values(criteriaWithoutId);
						expect(spyExecuteReadOperation).toBeCalledWith({
							sql: expectedSQL,
							values,
							connection: undefined,
						});
						expect(result).toEqual([]);
					}
				);

				it.each(daoClasses)(
					'$DAOClass.name calls executeReadOperation() on $name with a connection object, then returns its result when criteria without id is given',
					async ({ DAOClass, name, criteriaWithoutId }) => {
						const daoInstance = new DAOClass(mockDB);
						const result = await daoInstance.selectWhere({
							criteria: criteriaWithoutId,
							connection: mockConnection,
						});
						let expectedSQL = `
			SELECT
				*
			FROM
				${name}
			WHERE
		`;
						let conditions: string[] = [];
						for (const [key, value] of Object.entries(criteriaWithoutId)) {
							conditions.push(` ${key} = ? `);
						}
						expectedSQL += ` ${conditions.join(' AND ')}; `;

						const values = Object.values(criteriaWithoutId);
						expect(spyExecuteReadOperation).toBeCalledWith({
							sql: expectedSQL,
							values,
							connection: mockConnection,
						});
						expect(result).toEqual([]);
					}
				);
			});

			describe('insertOne()', () => {
				it.each(daoClasses)(
					'$DAOClass.name calls executeWriteOperation() on $name, then returns its result when criteria without id is given',
					async ({ DAOClass, name, criteriaWithoutId }) => {
						const daoInstance = new DAOClass(mockDB);
						const result = await daoInstance.insertOne({
							model: criteriaWithoutId,
						});
						let expectedSQL = `
			INSERT INTO
				${name}
		`;
						const values = Object.values(criteriaWithoutId);
						const keys = Object.keys(criteriaWithoutId);
						expectedSQL += `
			( ${keys.join(', ')} ) 
			VALUES
			( ${new Array(keys.length).fill('?').join(', ')} );
			`;
						expect(spyExecuteWriteOperation).toBeCalledWith({ sql: expectedSQL, values });
						expect(result).toEqual({});
					}
				);

				it.each(daoClasses)(
					'$DAOClass.name calls executeWriteOperation() on $name with a connection object, then returns its result when criteria without id is given',
					async ({ DAOClass, name, criteriaWithoutId }) => {
						const daoInstance = new DAOClass(mockDB);
						const result = await daoInstance.insertOne({
							model: criteriaWithoutId,
							connection: mockConnection,
						});
						let expectedSQL = `
			INSERT INTO
				${name}
		`;
						const values = Object.values(criteriaWithoutId);
						const keys = Object.keys(criteriaWithoutId);
						expectedSQL += `
			( ${keys.join(', ')} ) 
			VALUES
			( ${new Array(keys.length).fill('?').join(', ')} );
			`;
						expect(spyExecuteWriteOperation).toBeCalledWith({
							sql: expectedSQL,
							values,
							connection: mockConnection,
						});
						expect(result).toEqual({});
					}
				);
			});

			describe('updateById()', () => {
				it.each(daoClasses)(
					'$DAOClass.name calls executeWriteOperation() on $name, then returns its result when id and updates are given',
					async ({ DAOClass, name, testId, updates }) => {
						const daoInstance = new DAOClass(mockDB);
						const result = await daoInstance.updateById({
							id: testId,
							updates: updates,
						});
						let expectedSQL = `
			UPDATE
				${name}
			SET
		`;
						let columns: string[] = [];
						let values: any[] = [];

						for (const [key, value] of Object.entries(updates)) {
							columns.push(key);
							values.push(value);
						}
						expectedSQL += ` ${columns.map((column) => `${column} = ?`).join(', ')} WHERE id = ?;`;
						values.push(testId);
						expect(spyExecuteWriteOperation).toBeCalledWith({ sql: expectedSQL, values });
						expect(result).toEqual({});
					}
				);

				it.each(daoClasses)(
					'$DAOClass.name calls executeWriteOperation() on $name with a connection object, then returns its result when id and updates are given',
					async ({ DAOClass, name, testId, updates }) => {
						const daoInstance = new DAOClass(mockDB);
						const result = await daoInstance.updateById({
							id: testId,
							updates: updates,
							connection: mockConnection,
						});
						let expectedSQL = `
			UPDATE
				${name}
			SET
		`;
						let columns: string[] = [];
						let values: any[] = [];

						for (const [key, value] of Object.entries(updates)) {
							columns.push(key);
							values.push(value);
						}
						expectedSQL += ` ${columns.map((column) => `${column} = ?`).join(', ')} WHERE id = ?;`;
						values.push(testId);
						expect(spyExecuteWriteOperation).toBeCalledWith({
							sql: expectedSQL,
							values,
							connection: mockConnection,
						});
						expect(result).toEqual({});
					}
				);
			});

			describe('deleteById()', () => {
				it.each(daoClasses)(
					'$DAOClass.name calls executeWriteOperation() on $name, then returns its result when id is given',
					async ({ DAOClass, name, testId }) => {
						const daoInstance = new DAOClass(mockDB);
						const result = await daoInstance.deleteById({ id: testId });
						let expectedSQL = `
			DELETE FROM
				${name}
			WHERE
				id = ?;
		`;
						let values = [testId];
						expect(spyExecuteWriteOperation).toBeCalledWith({ sql: expectedSQL, values });
						expect(result).toEqual({});
					}
				);

				it.each(daoClasses)(
					'$DAOClass.name calls executeWriteOperation() on $name with a connection object, then returns its result when id is given',
					async ({ DAOClass, name, testId }) => {
						const daoInstance = new DAOClass(mockDB);
						const result = await daoInstance.deleteById({ id: testId, connection: mockConnection });
						let expectedSQL = `
			DELETE FROM
				${name}
			WHERE
				id = ?;
		`;
						let values = [testId];
						expect(spyExecuteWriteOperation).toBeCalledWith({
							sql: expectedSQL,
							values,
							connection: mockConnection,
						});
						expect(result).toEqual({});
					}
				);
			});
		});
	});
});

import { jest, it, describe, afterAll, afterEach, beforeAll, beforeEach, expect } from '@jest/globals';
import {
	CompanyDAO,
	InventoryDAO,
	ProductBrandDAO,
	ProductCategoryDAO,
	ProductInventoryDAO,
	ProducDAO,
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
import { DatabaseQueryError } from '../../src/errors/database';
import { IDatabase } from '../../src/interfaces/IDatabase';
import { IModel } from '../../src/interfaces/IModel';
import Database from '../../src/databases/index';
import { UserType } from '../../src/models/user.model';

type combinedCriteriaWithoutId = Omit<WarehouseModel, 'id'> &
	Omit<ProductModel, 'id'> &
	Omit<StoreBranchModel, 'id'> &
	Omit<ProductInventoryModel, 'id'>;

type combinedCriteriaWithId = { id: number } & combinedCriteriaWithoutId;

const daoClasses = [
	{
		DAOClass: CompanyDAO,
		name: 'company',
		testId: 1,
		criteriaWithId: { id: 2 },
		criteriaWithoutId: { name: 'test', description: 'test' } as Omit<CompanyModel, 'id'>,
		updates: { role: 'new' },
	},
	{
		DAOClass: InventoryDAO,
		name: 'inventory',
		testId: 1,
		criteriaWithId: { id: 2 },
		criteriaWithoutId: { name: 'test', description: 'test', date: new Date() } as Omit<InventoryModel, 'id'>,
		updates: { role: 'new' },
	},
	{
		DAOClass: ProductBrandDAO,
		name: 'product_brand',
		testId: 1,
		criteriaWithId: { id: 2 },
		criteriaWithoutId: { name: 'test', description: 'test' } as Omit<ProductBrandModel, 'id'>,
		updates: { role: 'new' },
	},
	{
		DAOClass: ProductCategoryDAO,
		name: 'product_category',
		testId: 1,
		criteriaWithId: { id: 2 },
		criteriaWithoutId: { name: 'test', description: 'test' } as Omit<ProductCategoryModel, 'id'>,
		updates: { role: 'new' },
	},
	{
		DAOClass: ProductInventoryDAO,
		name: 'product_inventory',
		testId: 1,
		criteriaWithId: { id: 2 },
		criteriaWithoutId: { quantity: 3, product: 1, user: 1, warehouse: 1, inventory: 1 } as Omit<
			ProductInventoryModel,
			'id'
		>,
		updates: { role: 'new' },
	},
	{
		DAOClass: ProducDAO,
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
		},
		updates: { role: 'new' },
	},
	{
		DAOClass: StoreBranchDAO,
		name: 'store_branch',
		testId: 1,
		criteriaWithId: { id: 2 },
		criteriaWithoutId: { location: 'test', store_manager: 1 } as Omit<StoreBranchModel, 'id'>,
		updates: { role: 'new' },
	},
	{
		DAOClass: StoreManagerDAO,
		name: 'store_manager',
		testId: 1,
		criteriaWithId: { id: 2 },
		criteriaWithoutId: { name: 'test', phone: 'test' } as Omit<StoreManagerModel, 'id'>,
		updates: { role: 'new' },
	},
	{
		DAOClass: UserDAO,
		name: 'user',
		testId: 1,
		criteriaWithId: { id: 2 },
		criteriaWithoutId: {
			name: 'test',
			user_type: UserType.USER,
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
		criteriaWithoutId: { name: 'test', role: 'test' } as Omit<WarehouseModel, 'id'>,
		updates: { role: 'new' },
	},
];

describe('DAOs', () => {
	let mockDB: IDatabase<any, any, any>;

	let variable: number;

	beforeEach(() => {
		mockDB = {
			executeRows: jest.fn().mockImplementation(() => Promise.resolve([[], []])), // Mock implementation for executeRows
			executeResult: jest.fn().mockImplementation(() => Promise.resolve([{}, []])), // Mock implementation for executeResult
			// Mock other methods as needed
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
					const daoInstance = new DAOClass({} as IDatabase<any, any, any>);
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
					const result = await daoInstance.executeReadOperation(sql, values);
					expect(mockDB.executeRows).toHaveBeenCalledWith(sql, values);
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
					await expect(daoInstance.executeReadOperation(sql, values)).rejects.toThrow(DatabaseQueryError);
				}
			);
		});

		describe('executeWriteOperation()', () => {
			it.each(daoClasses)(
				'$DAOClass.name instance should call database.executeRows() when executeReadOperation() method is called with sql string and optional values provided as arguments, then return the rows',
				async ({ DAOClass, name }) => {
					const daoInstance = new DAOClass(mockDB);
					const sql = `INSERT INTO ${name} (name) VALUES (?);`;
					const values = ['TEST'];
					const result = await daoInstance.executeWriteOperation(sql, values);
					expect(mockDB.executeResult).toHaveBeenCalledWith(sql, values);
					expect(result).toEqual({});
				}
			);

			it.each(daoClasses)(
				'$DAOClass.name instance should call database.executeRows() when executeReadOperation() method is called only with the sql string, then return the rows',
				async ({ DAOClass, name }) => {
					const daoInstance = new DAOClass(mockDB);
					const sql = `INSERT INTO ${name} (name) VALUES (?);`;
					const result = await daoInstance.executeWriteOperation(sql);
					expect(mockDB.executeResult).toHaveBeenCalledWith(sql, []);
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
					await expect(daoInstance.executeWriteOperation(sql, values)).rejects.toThrow(DatabaseQueryError);
				}
			);
		});

		describe('CRUD methods', () => {
			let mockDB = {
				executeRows: jest.fn().mockImplementation(() => Promise.resolve([[], []])), // Mock implementation for executeRows
				executeResult: jest.fn().mockImplementation(() => Promise.resolve([{}, []])), // Mock implementation for executeResult
				// Mock other methods as needed
			} as unknown as jest.Mocked<IDatabase<any, any, any>>;
			let spyExecuteReadOperation: jest.SpiedFunction<DAO<IModel>['executeReadOperation']>;
			let spyExecuteWriteOperation: jest.SpiedFunction<DAO<IModel>['executeReadOperation']>;

			beforeEach(() => {
				spyExecuteReadOperation = jest.spyOn(DAO.prototype, 'executeReadOperation');
				spyExecuteWriteOperation = jest.spyOn(DAO.prototype, 'executeWriteOperation');
			});

			afterEach(() => {
				jest.clearAllMocks();
			});

			describe('selectById()', () => {
				it.each(daoClasses)(
					'$DAOClass.name calls executeReadOperation() on $name with "id" provided as "$testId" and returns its result',
					async ({ DAOClass, testId, name }) => {
						const daoInstance = new DAOClass(mockDB);
						const result = await daoInstance.selectById(testId);
						const expectedSQL = `
			SELECT
				*
			FROM
				${name}
			WHERE
				id = ?;
		`;
						expect(spyExecuteReadOperation).toBeCalledWith(expectedSQL, [testId]);
						expect(result).toEqual([]);
					}
				);
			});

			describe('selectAll()', () => {
				it.each(daoClasses)(
					'$DAOClass.name calls executeReadOperation() on $name and returns its result',
					async ({ DAOClass, name }) => {
						const daoInstance = new DAOClass(mockDB);
						const result = await daoInstance.selectAll();
						const expectedSQL = `
			SELECT
				*
			FROM
				${name};
		`;
						expect(spyExecuteReadOperation).toBeCalledWith(expectedSQL);
						expect(result).toEqual([]);
					}
				);
			});

			describe('selectWhere()', () => {
				it.each(daoClasses)(
					'$DAOClass.name calls executeReadOperation() on $name and returns its result when criteria with id is given',
					async ({ DAOClass, name, criteriaWithId }) => {
						const daoInstance = new DAOClass(mockDB);
						const result = await daoInstance.selectWhere(criteriaWithId);
						const expectedSQL =
							`
			SELECT
				*
			FROM
				${name}
			WHERE
		` + ` id = ?; `;
						const values = [criteriaWithId.id];
						expect(spyExecuteReadOperation).toBeCalledWith(expectedSQL, values);
						expect(result).toEqual([]);
					}
				);

				it.each(daoClasses)(
					'$DAOClass.name calls executeReadOperation() on $name and returns its result when criteria without id is given',
					async ({ DAOClass, name, criteriaWithoutId }) => {
						const daoInstance = new DAOClass(mockDB);
						const result = await daoInstance.selectWhere(criteriaWithoutId);
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
						expect(spyExecuteReadOperation).toBeCalledWith(expectedSQL, values);
						expect(result).toEqual([]);
					}
				);
			});

			describe('insertOne()', () => {
				it.each(daoClasses)(
					'$DAOClass.name calls executeWriteOperation() on $name and returns its result when criteria without id is given',
					async ({ DAOClass, name, criteriaWithoutId }) => {
						const daoInstance = new DAOClass(mockDB);
						const result = await daoInstance.insertOne(criteriaWithoutId as combinedCriteriaWithoutId);
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
						expect(spyExecuteWriteOperation).toBeCalledWith(expectedSQL, values);
						expect(result).toEqual({});
					}
				);
			});

			describe('updateById()', () => {
				it.each(daoClasses)(
					'$DAOClass.name calls executeWriteOperation() on $name and returns its result when id and updates are given',
					async ({ DAOClass, name, testId, updates }) => {
						const daoInstance = new DAOClass(mockDB);
						const result = await daoInstance.updateById(
							testId,
							updates as unknown as combinedCriteriaWithoutId
						);
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
						expect(spyExecuteWriteOperation).toBeCalledWith(expectedSQL, values);
						expect(result).toEqual({});
					}
				);
			});

			describe('deleteById()', () => {
				it.each(daoClasses)(
					'$DAOClass.name calls executeWriteOperation() on $name and returns its result when id is given',
					async ({ DAOClass, name, testId }) => {
						const daoInstance = new DAOClass(mockDB);
						const result = await daoInstance.deleteById(testId);
						let expectedSQL = `
			DELETE FROM
				${name}
			WHERE
				id = ?;
		`;
						let values = [testId];
						expect(spyExecuteWriteOperation).toBeCalledWith(expectedSQL, values);
						expect(result).toEqual({});
					}
				);
			});
		});
	});
});

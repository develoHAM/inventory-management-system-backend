import { jest, describe, beforeAll, beforeEach, afterAll, afterEach, it, expect } from '@jest/globals';
import {
	CompanyRepository,
	InventoryRepository,
	ProductBrandRepository,
	ProductInventoryRepository,
	ProductCategoryRepository,
	ProductRepository,
	StoreBranchRepository,
	StoreManagerRepository,
	UserRepository,
	WarehouseRepository,
} from '../../src/repositories';
import { IDAO } from '../../src/types/IDAO';
import { IDatabaseConnection } from '../../src/types/IDatabase';
import { DatabaseQueryError, RepositoryExecutionError } from '../../src/errors/persistence';

const repositoryClasses = [
	{
		repositoryClass: CompanyRepository,
		testId: 1,
		testCriteria: {
			criteria: 'test',
		},
		testModel: {
			name: 'testModelName',
			description: 'test model description',
		},
		testUpdates: {
			name: 'testUpdatedModelName',
			description: 'test updated model description',
		},
	},
	{
		repositoryClass: InventoryRepository,
		testId: 1,
		testCriteria: {
			criteria: 'test',
		},
		testModel: {
			name: 'testModelName',
			description: 'test model description',
		},
		testUpdates: {
			name: 'testUpdatedModelName',
			description: 'test updated model description',
		},
	},
	{
		repositoryClass: ProductBrandRepository,
		testId: 1,
		testCriteria: {
			criteria: 'test',
		},
		testModel: {
			name: 'testModelName',
			description: 'test model description',
		},
		testUpdates: {
			name: 'testUpdatedModelName',
			description: 'test updated model description',
		},
	},
	{
		repositoryClass: ProductInventoryRepository,
		testId: 1,
		testCriteria: {
			criteria: 'test',
		},
		testModel: {
			name: 'testModelName',
			description: 'test model description',
		},
		testUpdates: {
			name: 'testUpdatedModelName',
			description: 'test updated model description',
		},
	},
	{
		repositoryClass: ProductCategoryRepository,
		testId: 1,
		testCriteria: {
			criteria: 'test',
		},
		testModel: {
			name: 'testModelName',
			description: 'test model description',
		},
		testUpdates: {
			name: 'testUpdatedModelName',
			description: 'test updated model description',
		},
	},
	{
		repositoryClass: ProductRepository,
		testId: 1,
		testCriteria: {
			criteria: 'test',
		},
		testModel: {
			name: 'testModelName',
			description: 'test model description',
		},
		testUpdates: {
			name: 'testUpdatedModelName',
			description: 'test updated model description',
		},
	},
	{
		repositoryClass: StoreBranchRepository,
		testId: 1,
		testCriteria: {
			criteria: 'test',
		},
		testModel: {
			name: 'testModelName',
			description: 'test model description',
		},
		testUpdates: {
			name: 'testUpdatedModelName',
			description: 'test updated model description',
		},
	},
	{
		repositoryClass: StoreManagerRepository,
		testId: 1,
		testCriteria: {
			criteria: 'test',
		},
		testModel: {
			name: 'testModelName',
			description: 'test model description',
		},
		testUpdates: {
			name: 'testUpdatedModelName',
			description: 'test updated model description',
		},
	},
	{
		repositoryClass: UserRepository,
		testId: 1,
		testCriteria: {
			criteria: 'test',
		},
		testModel: {
			name: 'testModelName',
			description: 'test model description',
		},
		testUpdates: {
			name: 'testUpdatedModelName',
			description: 'test updated model description',
		},
	},
	{
		repositoryClass: WarehouseRepository,
		testId: 1,
		testCriteria: {
			criteria: 'test',
		},
		testModel: {
			name: 'testModelName',
			description: 'test model description',
		},
		testUpdates: {
			name: 'testUpdatedModelName',
			description: 'test updated model description',
		},
	},
];

describe('Repositories', () => {
	let mockDAO: IDAO<any, any, IDatabaseConnection>;
	const mockConnection = { name: 'testConnectionObject' } as unknown as IDatabaseConnection;

	beforeEach(() => {
		mockDAO = {
			executeReadOperation: jest.fn().mockImplementation(() => Promise.resolve([])),
			executeWriteOperation: jest.fn().mockImplementation(() => Promise.resolve({})),
			selectById: jest.fn().mockImplementation(() => Promise.resolve([])),
			selectAll: jest.fn().mockImplementation(() => Promise.resolve([])),
			selectWhere: jest.fn().mockImplementation(() => Promise.resolve([])),
			insertOne: jest.fn().mockImplementation(() => Promise.resolve({})),
			updateById: jest.fn().mockImplementation(() => Promise.resolve({})),
			deleteById: jest.fn().mockImplementation(() => Promise.resolve({})),
		} as unknown as IDAO<any, { id: number }, IDatabaseConnection>;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('Repository classes', () => {
		describe('methods', () => {
			describe('findAll()', () => {
				it.each(repositoryClasses)(
					"$repositoryClass.name instance should call DAO instance's selectAll() with connection object set to undefined then return an array",
					async ({ repositoryClass }) => {
						const repositoryInstance = new repositoryClass(mockDAO);
						const result = await repositoryInstance.findAll();
						expect(mockDAO.selectAll).toHaveBeenCalledWith({ connection: undefined, lock: undefined });
						expect(result).toEqual([]);
					}
				);
				it.each(repositoryClasses)(
					"$repositoryClass.name instance should call DAO instance's selectAll() method with connection object provided then return an array",
					async ({ repositoryClass }) => {
						const repositoryInstance = new repositoryClass(mockDAO);
						const result = await repositoryInstance.findAll({ connection: mockConnection });
						expect(mockDAO.selectAll).toHaveBeenCalledWith({ connection: mockConnection, lock: undefined });
						expect(result).toEqual([]);
					}
				);
				it.each(repositoryClasses)(
					"$repositoryClass.name instance should throw DatabaseQueryError if an error occurs while running DAO instance's findAll() method",
					async ({ repositoryClass }) => {
						(mockDAO.selectAll as jest.Mock).mockImplementationOnce(() =>
							Promise.reject(new DatabaseQueryError('test'))
						);
						const repositoryInstance = new repositoryClass(mockDAO);
						await expect(repositoryInstance.findAll()).rejects.toThrow(DatabaseQueryError);
					}
				);
				it.each(repositoryClasses)(
					'$repositoryClass.name instance should throw RepositoryExecutionError if an error occurs while running the method that is not DatabaseQueryError',
					async ({ repositoryClass }) => {
						const repositoryInstance = new repositoryClass(mockDAO);
						(mockDAO.selectAll as jest.Mock).mockImplementationOnce(() =>
							Promise.reject(new Error('test'))
						);
						await expect(repositoryInstance.findAll()).rejects.toThrow(RepositoryExecutionError);
					}
				);
			});

			describe('findById()', () => {
				it.each(repositoryClasses)(
					"$repositoryClass.name instance should call DAO instance's selectById() method with id of $testId and connection object set to undefined then return an array",
					async ({ repositoryClass, testId }) => {
						const repositoryInstance = new repositoryClass(mockDAO);
						const result = await repositoryInstance.findById({ id: testId });
						expect(mockDAO.selectById).toHaveBeenCalledWith({
							id: testId,
							connection: undefined,
							lock: undefined,
						});
						expect(result).toEqual([]);
					}
				);
				it.each(repositoryClasses)(
					"$repositoryClass.name instance should call DAO instance's selectById() method with id of $testId and connection object provided then return an array",
					async ({ repositoryClass, testId }) => {
						const repositoryInstance = new repositoryClass(mockDAO);
						const result = await repositoryInstance.findById({ id: testId, connection: mockConnection });
						expect(mockDAO.selectById).toHaveBeenCalledWith({
							id: testId,
							connection: mockConnection,
							lock: undefined,
						});
						expect(result).toEqual([]);
					}
				);
				it.each(repositoryClasses)(
					"$repositoryClass.name instance should throw DatabaseQueryError if an error occurs while running DAO instance's selectById() method",
					async ({ repositoryClass, testId }) => {
						(mockDAO.selectById as jest.Mock).mockImplementationOnce(() =>
							Promise.reject(new DatabaseQueryError('test'))
						);
						const repositoryInstance = new repositoryClass(mockDAO);
						await expect(repositoryInstance.findById({ id: testId })).rejects.toThrow(DatabaseQueryError);
					}
				);
				it.each(repositoryClasses)(
					'$repositoryClass.name instance should throw RepositoryExecutionError if an error occurs while running the method that is not DatabaseQueryError',
					async ({ repositoryClass, testId }) => {
						const repositoryInstance = new repositoryClass(mockDAO);
						(mockDAO.selectById as jest.Mock).mockImplementationOnce(() =>
							Promise.reject(new Error('test'))
						);
						await expect(repositoryInstance.findById({ id: testId })).rejects.toThrow(
							RepositoryExecutionError
						);
					}
				);
			});

			describe('find()', () => {
				it.each(repositoryClasses)(
					"$repositoryClass.name instance should call DAO instance's selectWhere() method with criteria of $testCriteria and connection object set to undefined then return an array",
					async ({ repositoryClass, testCriteria }) => {
						const repositoryInstance = new repositoryClass(mockDAO);
						const result = await repositoryInstance.find({ criteria: testCriteria as any });
						expect(mockDAO.selectWhere).toHaveBeenCalledWith({
							criteria: testCriteria,
							connection: undefined,
							lock: undefined,
						});
						expect(result).toEqual([]);
					}
				);
				it.each(repositoryClasses)(
					"$repositoryClass.name instance should call DAO instance's selectWhere() method with criteria of $testCriteria and connection object provided then return an array",
					async ({ repositoryClass, testCriteria }) => {
						const repositoryInstance = new repositoryClass(mockDAO);
						const result = await repositoryInstance.find({
							criteria: testCriteria as any,
							connection: mockConnection,
						});
						expect(mockDAO.selectWhere).toHaveBeenCalledWith({
							criteria: testCriteria,
							connection: mockConnection,
							lock: undefined,
						});
						expect(result).toEqual([]);
					}
				);
				it.each(repositoryClasses)(
					"$repositoryClass.name instance should throw DatabaseQueryError if an error occurs while running DAO instance's selectById() method",
					async ({ repositoryClass, testCriteria }) => {
						(mockDAO.selectWhere as jest.Mock).mockImplementationOnce(() =>
							Promise.reject(new DatabaseQueryError('test'))
						);
						const repositoryInstance = new repositoryClass(mockDAO);
						await expect(repositoryInstance.find(testCriteria as any)).rejects.toThrow(DatabaseQueryError);
					}
				);
				it.each(repositoryClasses)(
					'$repositoryClass.name instance should throw RepositoryExecutionError if an error occurs while running the method that is not DatabaseQueryError',
					async ({ repositoryClass, testCriteria }) => {
						const repositoryInstance = new repositoryClass(mockDAO);
						(mockDAO.selectWhere as jest.Mock).mockImplementationOnce(() =>
							Promise.reject(new Error('test'))
						);
						await expect(repositoryInstance.find(testCriteria as any)).rejects.toThrow(
							RepositoryExecutionError
						);
					}
				);
			});
			describe('create()', () => {
				it.each(repositoryClasses)(
					"$repositoryClass.name instance should call DAO instance's create() method with model of $testModel and connection object set to undefined then return an array",
					async ({ repositoryClass, testModel }) => {
						const repositoryInstance = new repositoryClass(mockDAO);
						const result = await repositoryInstance.create({ model: testModel as any });
						expect(mockDAO.insertOne).toHaveBeenCalledWith({ model: testModel, connection: undefined });
						expect(result).toEqual({});
					}
				);
				it.each(repositoryClasses)(
					"$repositoryClass.name instance should call DAO instance's create() method with model of $testModel and connection object provided then return an array",
					async ({ repositoryClass, testModel }) => {
						const repositoryInstance = new repositoryClass(mockDAO);
						const result = await repositoryInstance.create({
							model: testModel as any,
							connection: mockConnection,
						});
						expect(mockDAO.insertOne).toHaveBeenCalledWith({
							model: testModel,
							connection: mockConnection,
						});
						expect(result).toEqual({});
					}
				);
				it.each(repositoryClasses)(
					"$repositoryClass.name instance should throw DatabaseQueryError if an error occurs while running DAO instance's insertOne() method",
					async ({ repositoryClass, testModel }) => {
						(mockDAO.insertOne as jest.Mock).mockImplementationOnce(() =>
							Promise.reject(new DatabaseQueryError('test'))
						);
						const repositoryInstance = new repositoryClass(mockDAO);
						await expect(repositoryInstance.create(testModel as any)).rejects.toThrow(DatabaseQueryError);
					}
				);
				it.each(repositoryClasses)(
					'$repositoryClass.name instance should throw RepositoryExecutionError if an error occurs while running the method that is not DatabaseQueryError',
					async ({ repositoryClass, testModel }) => {
						const repositoryInstance = new repositoryClass(mockDAO);
						(mockDAO.insertOne as jest.Mock).mockImplementationOnce(() =>
							Promise.reject(new Error('test'))
						);
						await expect(repositoryInstance.create(testModel as any)).rejects.toThrow(
							RepositoryExecutionError
						);
					}
				);
			});

			describe('update()', () => {
				it.each(repositoryClasses)(
					"$repositoryClass.name instance should call DAO instance's updateById() method with model of $testModel and connection object set to undefined then return an array",
					async ({ repositoryClass, testId, testUpdates }) => {
						const repositoryInstance = new repositoryClass(mockDAO);
						const result = await repositoryInstance.update({ id: testId, updates: testUpdates });
						expect(mockDAO.updateById).toHaveBeenCalledWith({
							id: testId,
							updates: testUpdates,
							connection: undefined,
							lock: undefined,
						});
						expect(result).toEqual({});
					}
				);
				it.each(repositoryClasses)(
					"$repositoryClass.name instance should call DAO instance's updateById() method with model of $testModel and connection object provided then return an array",
					async ({ repositoryClass, testId, testUpdates }) => {
						const repositoryInstance = new repositoryClass(mockDAO);
						const result = await repositoryInstance.update({
							id: testId,
							updates: testUpdates,
							connection: mockConnection,
						});
						expect(mockDAO.updateById).toHaveBeenCalledWith({
							id: testId,
							updates: testUpdates,
							connection: mockConnection,
						});
						expect(result).toEqual({});
					}
				);
				it.each(repositoryClasses)(
					"$repositoryClass.name instance should throw DatabaseQueryError if an error occurs while running DAO instance's updateById() method",
					async ({ repositoryClass, testId, testUpdates }) => {
						(mockDAO.updateById as jest.Mock).mockImplementationOnce(() =>
							Promise.reject(new DatabaseQueryError('test'))
						);
						const repositoryInstance = new repositoryClass(mockDAO);
						await expect(repositoryInstance.update({ id: testId, updates: testUpdates })).rejects.toThrow(
							DatabaseQueryError
						);
					}
				);
				it.each(repositoryClasses)(
					'$repositoryClass.name instance should throw RepositoryExecutionError if an error occurs while running the method that is not DatabaseQueryError',
					async ({ repositoryClass, testId, testUpdates }) => {
						const repositoryInstance = new repositoryClass(mockDAO);
						(mockDAO.updateById as jest.Mock).mockImplementationOnce(() =>
							Promise.reject(new Error('test'))
						);
						await expect(repositoryInstance.update({ id: testId, updates: testUpdates })).rejects.toThrow(
							RepositoryExecutionError
						);
					}
				);
			});

			describe('delete()', () => {
				it.each(repositoryClasses)(
					"$repositoryClass.name instance should call DAO instance's deleteById() method with id of $testId and connection object set to undefined then return an array",
					async ({ repositoryClass, testId }) => {
						const repositoryInstance = new repositoryClass(mockDAO);
						const result = await repositoryInstance.delete({ id: testId });
						expect(mockDAO.deleteById).toHaveBeenCalledWith({ id: testId, connection: undefined });
						expect(result).toEqual({});
					}
				);
				it.each(repositoryClasses)(
					"$repositoryClass.name instance should call DAO instance's deleteById() method with id of $testId and connection object provided then return an array",
					async ({ repositoryClass, testId }) => {
						const repositoryInstance = new repositoryClass(mockDAO);
						const result = await repositoryInstance.delete({ id: testId, connection: mockConnection });
						expect(mockDAO.deleteById).toHaveBeenCalledWith({ id: testId, connection: mockConnection });
						expect(result).toEqual({});
					}
				);
				it.each(repositoryClasses)(
					"$repositoryClass.name instance should throw DatabaseQueryError if an error occurs while running DAO instance's deleteById() method",
					async ({ repositoryClass, testId }) => {
						(mockDAO.deleteById as jest.Mock).mockImplementationOnce(() =>
							Promise.reject(new DatabaseQueryError('test'))
						);
						const repositoryInstance = new repositoryClass(mockDAO);
						await expect(repositoryInstance.delete({ id: testId })).rejects.toThrow(DatabaseQueryError);
					}
				);
				it.each(repositoryClasses)(
					'$repositoryClass.name instance should throw RepositoryExecutionError if an error occurs while running the method that is not DatabaseQueryError',
					async ({ repositoryClass, testId }) => {
						const repositoryInstance = new repositoryClass(mockDAO);
						(mockDAO.deleteById as jest.Mock).mockImplementationOnce(() =>
							Promise.reject(new Error('test'))
						);
						await expect(repositoryInstance.delete({ id: testId })).rejects.toThrow(
							RepositoryExecutionError
						);
					}
				);
			});
		});
	});
});

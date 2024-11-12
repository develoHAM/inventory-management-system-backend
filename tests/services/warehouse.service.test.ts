// @ts-nocheck
import { jest, it, describe, beforeAll, beforeEach, afterAll, afterEach, expect } from '@jest/globals';
import { WarehouseService } from '../../src/services';
import { WarehouseRepository } from '../../src/repositories';
import { TransactionHandler } from '../../src/databases';
import { WarehouseDAO } from '../../src/daos';
import Database from '../../src/databases';
import { DTO } from '../../src/dtos/DTO';
import { IDAO } from '../../src/types/IDAO';
import { IRepository } from '../../src/types/IRepository';
import { ITransactionHandler } from '../../src/types/ITransactionHandler';
import { ServiceExecutionError, ServiceOperationError, ValidationError } from '../../src/errors/services';
import { RepositoryExecutionError, TransactionHandlingError } from '../../src/errors/persistence';
jest.mock('../../src/repositories/warehouse.repository');
jest.mock('../../src/databases/TransactionHandler');
jest.mock('../../src/databases/mysql.database');
jest.mock('../../src/daos/warehouse.dao');

describe('WarehouseService', () => {
	let databaseMock: Database;
	let transactionHandlerMock: ITransactionHandler<any>;
	let warehouseDaoMock: IDAO<any, any, any>;
	let warehouseRepositoryMock: IRepository<any, any, any>;
	let warehouseService: WarehouseService;
	const testId = 1;
	const testModel = {
		id: 1,
		name: 'test name',
		description: 'test description',
	};
	const testNewData = {
		name: 'test name',
		description: 'test description',
	};
	const testUpdates = {
		name: 'test updated name',
	};
	const testCriteria = {
		id: 1,
		name: 'test name',
	};
	let fromSpy;
	beforeEach(() => {
		databaseMock = new Database({}, []);
		warehouseDaoMock = new WarehouseDAO(databaseMock);
		warehouseRepositoryMock = new WarehouseRepository(warehouseDaoMock);
		transactionHandlerMock = new TransactionHandler(databaseMock);

		warehouseService = new WarehouseService({
			warehouseRepository: warehouseRepositoryMock,
			transactionHandler: transactionHandlerMock,
		});
		fromSpy = jest.spyOn(DTO, 'from').mockImplementation((data) => ({ ...data }));
	});

	describe('getWarehouseById', () => {
		let getWarehouseByIdSpy;
		let findByIdSpy;
		beforeEach(() => {
			getWarehouseByIdSpy = jest.spyOn(warehouseService, 'getWarehouseById');
			findByIdSpy = jest.spyOn(warehouseRepositoryMock, 'findById');
		});
		describe('when id is given', () => {
			describe('when repository returns with the warehouse', () => {
				it('returns the warehouse dto', async () => {
					findByIdSpy.mockImplementationOnce(async ({ id }) => {
						return [{ id: id, name: 'test name', description: 'test description' }];
					});
					await expect(warehouseService.getWarehouseById(testId)).resolves.toEqual({
						id: 1,
						name: 'test name',
						description: 'test description',
					});
				});
			});
			describe('when repository does not return anything', () => {
				it('returns null', async () => {
					findByIdSpy.mockImplementationOnce(async ({ id }) => {
						return [];
					});
					await expect(warehouseService.getWarehouseById(testId)).resolves.toBeNull();
				});
			});
			describe('when id is not valid', () => {
				it('throws a validation error', async () => {
					fromSpy.mockImplementationOnce(() => {
						throw new ValidationError('test error');
					});
					await expect(warehouseService.getWarehouseById('string')).rejects.toThrowError(
						new ValidationError('test error')
					);
				});
			});
		});
	});
	describe('getWarehouses', () => {
		let getWarehousesSpy;
		let findSpy;
		let findAllSpy;
		beforeEach(() => {
			getWarehousesSpy = jest.spyOn(warehouseService, 'getWarehouses');
			findSpy = jest.spyOn(warehouseRepositoryMock, 'find');
			findAllSpy = jest.spyOn(warehouseRepositoryMock, 'findAll');
		});

		describe('when criteria is given', () => {
			describe('when criteria is valid', () => {
				describe('when warehouses exist', () => {
					it('returns the warehouses array', async () => {
						findSpy.mockImplementationOnce(() => [testModel, testModel]);

						await expect(warehouseService.getWarehouses(testCriteria)).resolves.toEqual([
							testModel,
							testModel,
						]);
						expect(findSpy).toHaveBeenCalledTimes(1);
						expect(fromSpy).toHaveBeenCalledTimes(3);
					});
				});
				describe('when warehouses do not exist', () => {
					it('returns an empty array', async () => {
						findSpy.mockImplementationOnce(() => []);

						await expect(warehouseService.getWarehouses(testCriteria)).resolves.toEqual([]);
					});
				});
			});

			describe('when criteria is not valid', () => {
				it('throws a validation error', async () => {
					fromSpy.mockImplementationOnce(() => {
						throw new ValidationError('test error');
					});

					await expect(warehouseService.getWarehouses(testCriteria)).rejects.toThrowError(
						new ValidationError('test error')
					);
				});
			});
		});
		describe('when criteria is not given', () => {
			describe('when warehouses exist', () => {
				it('returns the warehouses array', async () => {
					findAllSpy.mockImplementationOnce(() => [testModel, testModel]);

					await expect(warehouseService.getWarehouses()).resolves.toEqual([testModel, testModel]);
					expect(findAllSpy).toHaveBeenCalledTimes(1);
					expect(fromSpy).toHaveBeenCalledTimes(2);
				});
			});
			describe('when warehouses do not exist', () => {
				it('returns an empty array', async () => {
					findAllSpy.mockImplementationOnce(() => []);

					await expect(warehouseService.getWarehouses()).resolves.toEqual([]);
				});
			});
		});
	});
	describe('createWarehouse', () => {
		let getWarehousesSpy;
		let createSpy;
		let findByIdSpy;
		beforeEach(() => {
			createWarehouseSpy = jest.spyOn(warehouseService, 'createWarehouse');
			createSpy = jest.spyOn(warehouseRepositoryMock, 'create');
			findByIdSpy = jest.spyOn(warehouseRepositoryMock, 'findById');
		});

		describe('when newWarehouseData is given', () => {
			describe('when newWarehouseData is valid', () => {
				describe('when repository successfully creates a new warehouse', () => {
					it('returns the newly created warehouse', async () => {
						findByIdSpy.mockImplementationOnce(() => [testModel]);
						createSpy.mockImplementationOnce(() => ({ insertId: 1 }));

						await expect(warehouseService.createWarehouse(testNewData)).resolves.toEqual(testModel);
					});
				});
				describe('when repository execution error is thrown', () => {
					it('throws a repository execution error', async () => {
						createSpy.mockImplementationOnce(() => {
							throw new RepositoryExecutionError('test error');
						});

						await expect(warehouseService.createWarehouse(testNewData)).rejects.toThrowError(
							new RepositoryExecutionError('test error')
						);
					});
				});
			});
			describe('when newWarehouseData is not valid', () => {
				it('throws a validation error', async () => {
					fromSpy.mockImplementationOnce(() => {
						throw new ValidationError('test error');
					});

					await expect(warehouseService.createWarehouse(testNewData)).rejects.toThrowError(
						new ValidationError('test error')
					);
				});
			});
		});
	});
	describe('updateWarehouse', () => {
		let updateWarehouseSpy;

		beforeEach(() => {
			updateWarehouseSpy = jest.spyOn(warehouseService, 'updateWarehouse');

			getConnectionSpy = jest.spyOn(transactionHandlerMock, 'getConnection');
			beginSpy = jest.spyOn(transactionHandlerMock, 'begin');
			commitSpy = jest.spyOn(transactionHandlerMock, 'commit');
			rollbackSpy = jest.spyOn(transactionHandlerMock, 'rollback');
			endSpy = jest.spyOn(transactionHandlerMock, 'end');

			findByIdSpy = jest.spyOn(warehouseRepositoryMock, 'findById');
			updateSpy = jest.spyOn(warehouseRepositoryMock, 'update');
		});
		describe('when id or updates are not valid', () => {
			it('throws a validation error', async () => {
				fromSpy
					.mockImplementationOnce(() => {
						throw new ValidationError('test error 1');
					})
					.mockImplementationOnce(() => {
						throw new ValidationError('test error 2');
					});

				await expect(warehouseService.updateWarehouse('1', testUpdates)).rejects.toThrowError(
					new ValidationError('test error 1')
				);
				await expect(warehouseService.updateWarehouse(1, { prop: 'test update' })).rejects.toThrowError(
					new ValidationError('test error 2')
				);
			});
		});
		describe('when id and updates are valid', () => {
			describe('when connection is empty', () => {
				it('throws a service operation error', async () => {
					getConnectionSpy.mockImplementationOnce(() => undefined);

					await expect(warehouseService.updateWarehouse(1, testUpdates)).rejects.toThrowError(
						new ServiceOperationError('cannot retrieve database connection')
					);
				});
			});
			describe('when warehouse to update is found', () => {
				describe('when repository update execution fails', () => {
					it('throws a repository execution error', async () => {
						findByIdSpy.mockImplementationOnce(() => [testModel]);
						getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
						updateSpy.mockImplementationOnce(() => {
							throw new RepositoryExecutionError('test error');
						});

						await expect(warehouseService.updateWarehouse(1, testUpdates)).rejects.toThrowError(
							new RepositoryExecutionError('test error')
						);
					});
				});
				describe('when repository update execution succeeds', () => {
					describe('when affected rows is 0', () => {
						it('throws a service execution error', async () => {
							findByIdSpy.mockImplementationOnce(() => [testModel]);
							getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
							updateSpy.mockImplementationOnce(() => ({ affectedRows: 0 }));

							await expect(warehouseService.updateWarehouse(1, testUpdates)).rejects.toThrowError(
								new ServiceExecutionError('warehouse update failed, no rows affected')
							);
						});
					});
					describe('when affected rows is not 0', () => {
						describe('when transaction commit throws an error', () => {
							it('throws a transaction handling error', async () => {
								findByIdSpy.mockImplementationOnce(() => [testModel]);
								getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
								updateSpy.mockImplementationOnce(() => ({ affectedRows: 1 }));
								commitSpy.mockImplementationOnce(() => {
									throw new TransactionHandlingError('test error');
								});

								await expect(warehouseService.updateWarehouse(1, testUpdates)).rejects.toThrowError(
									new TransactionHandlingError('test error')
								);
							});
						});
						describe('when transaction commit succeeds', () => {
							describe('when repository findById() throws an error', () => {
								it('throws a repoisitory execution error', async () => {
									findByIdSpy
										.mockImplementationOnce(() => [testModel])
										.mockImplementationOnce(() => {
											throw new RepositoryExecutionError('test error');
										});
									getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
									updateSpy.mockImplementationOnce(() => ({ affectedRows: 1 }));
									commitSpy.mockImplementationOnce(() => {
										return;
									});

									await expect(warehouseService.updateWarehouse(1, testUpdates)).rejects.toThrowError(
										new RepositoryExecutionError('test error')
									);
								});
							});
							describe('when repository findById() succeeds', () => {
								it('retuns the updated warehouse', async () => {
									findByIdSpy.mockImplementation(() => [testModel]);

									getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
									updateSpy.mockImplementationOnce(() => ({ affectedRows: 1 }));
									commitSpy.mockImplementationOnce(() => {
										return;
									});

									await expect(warehouseService.updateWarehouse(1, testUpdates)).resolves.toEqual(
										testModel
									);

									findByIdSpy.mockClear();
								});
							});
						});
					});
				});
				describe('when repository update returns nothing', () => {
					it('throws a service operation error', async () => {
						findByIdSpy.mockImplementation(() => [testModel]);
						getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
						updateSpy.mockImplementationOnce(() => ({ affectedRows: 0 }));

						await expect(warehouseService.updateWarehouse(1, testUpdates)).rejects.toThrowError(
							new ServiceOperationError(`warehouse update failed, no rows affected`)
						);

						findByIdSpy.mockClear();
					});
				});
			});
			describe('when warehouse to update is not found', () => {
				it('throw a service operation error', async () => {
					findByIdSpy.mockImplementationOnce(() => []);
					getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));

					await expect(warehouseService.updateWarehouse(1, testUpdates)).rejects.toThrowError(
						new ServiceOperationError(`warehouse with id of ${testModel.id} not found`)
					);
				});
			});
		});

		describe('when transaction handler throws', () => {
			describe('getConnection()', () => {
				it('throws a transaction handling error', async () => {
					getConnectionSpy.mockImplementationOnce(() => {
						throw new TransactionHandlingError('test error');
					});
					await expect(warehouseService.updateWarehouse(1, testUpdates)).rejects.toThrowError(
						new TransactionHandlingError('test error')
					);
				});
			});

			describe('begin()', () => {
				it('throws a transaction handling error', async () => {
					getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));

					beginSpy.mockImplementationOnce(() => {
						throw new TransactionHandlingError('test error');
					});

					await expect(warehouseService.updateWarehouse(1, testUpdates)).rejects.toThrowError(
						new TransactionHandlingError('test error')
					);
				});
			});

			describe('commit()', () => {
				it('throws a transaction handling error', async () => {
					getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
					findByIdSpy.mockImplementation(() => [testModel]);
					updateSpy.mockImplementationOnce(() => ({ affectedRows: 1 }));
					commitSpy.mockImplementationOnce(() => {
						throw new TransactionHandlingError('test error');
					});

					await expect(warehouseService.updateWarehouse(1, testUpdates)).rejects.toThrowError(
						new TransactionHandlingError('test error')
					);

					findByIdSpy.mockClear();
				});
			});

			describe('rollback()', () => {
				describe('when an error instance is thrown', () => {
					it('throws a transaction handling error', async () => {
						getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
						findByIdSpy.mockImplementation(() => [testModel]);
						updateSpy.mockImplementationOnce(() => ({ affectedRows: 1 }));
						commitSpy.mockImplementationOnce(() => {
							throw new TransactionHandlingError('test error');
						});
						rollbackSpy.mockImplementationOnce(() => {
							throw new TransactionHandlingError('test rollback error');
						});

						await expect(warehouseService.updateWarehouse(1, testUpdates)).rejects.toThrowError(
							new TransactionHandlingError('rollback failed: test rollback error')
						);

						findByIdSpy.mockClear();
					});
				});
				describe('when something else is thrown', () => {
					it('throws a transaction handling error', async () => {
						getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
						findByIdSpy.mockImplementation(() => [testModel]);
						updateSpy.mockImplementationOnce(() => ({ affectedRows: 1 }));
						commitSpy.mockImplementationOnce(() => {
							throw new TransactionHandlingError('test error');
						});
						rollbackSpy.mockImplementationOnce(() => {
							throw 'test rollback error';
						});

						await expect(warehouseService.updateWarehouse(1, testUpdates)).rejects.toThrowError(
							new TransactionHandlingError('rollback failed: test rollback error')
						);

						findByIdSpy.mockClear();
					});
				});
			});
		});
	});
	describe('deleteWarehouse', () => {
		let deleteWarehouseSpy;

		beforeEach(() => {
			deleteWarehouseSpy = jest.spyOn(warehouseService, 'deleteWarehouse');

			getConnectionSpy = jest.spyOn(transactionHandlerMock, 'getConnection');
			beginSpy = jest.spyOn(transactionHandlerMock, 'begin');
			commitSpy = jest.spyOn(transactionHandlerMock, 'commit');
			rollbackSpy = jest.spyOn(transactionHandlerMock, 'rollback');
			endSpy = jest.spyOn(transactionHandlerMock, 'end');

			findByIdSpy = jest.spyOn(warehouseRepositoryMock, 'findById');
			deleteSpy = jest.spyOn(warehouseRepositoryMock, 'delete');
		});
		describe('when id is not valid', () => {
			it('throws a validation error', async () => {
				fromSpy.mockImplementationOnce(() => {
					throw new ValidationError('test error');
				});

				await expect(warehouseService.deleteWarehouse(testId)).rejects.toThrowError(
					new ValidationError('test error')
				);
			});
		});
		describe('when id is valid', () => {
			describe('when transactionHandler.getConnection() throws an error', () => {
				it('throws a transaction handling error', async () => {
					getConnectionSpy.mockImplementationOnce(() => {
						throw new TransactionHandlingError('test error');
					});

					await expect(warehouseService.deleteWarehouse(testId)).rejects.toThrowError(
						new TransactionHandlingError('test error')
					);
				});
			});

			describe('when transactionHandler.getConnection() returns nothing', () => {
				it('throws a service operation error', async () => {
					getConnectionSpy.mockImplementationOnce(() => undefined);

					await expect(warehouseService.deleteWarehouse(testId)).rejects.toThrowError(
						new ServiceOperationError('cannot retrieve database connection')
					);
				});
			});

			describe('when transactionHandler.getConnection() returns a connection', () => {
				describe('when transactionHandler.begin() throws an error', () => {
					it('throws a transaction handling error', async () => {
						getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
						beginSpy.mockImplementationOnce(() => {
							throw new TransactionHandlingError('test error');
						});

						await expect(warehouseService.deleteWarehouse(testId)).rejects.toThrowError(
							new TransactionHandlingError('test error')
						);
					});
				});

				describe('when transactionHandler.begin() succeeds', () => {
					describe('when repository.findById() throws an error', () => {
						it('throws a repository execution error', async () => {
							getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
							findByIdSpy.mockImplementationOnce(() => {
								throw new RepositoryExecutionError('test error');
							});

							await expect(warehouseService.deleteWarehouse(testId)).rejects.toThrowError(
								new RepositoryExecutionError('test error')
							);
						});
					});
					describe('when repository.findById() returns an empty array', () => {
						it('throws a service operation error', async () => {
							getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
							findByIdSpy.mockImplementationOnce(() => []);

							await expect(warehouseService.deleteWarehouse(testId)).rejects.toThrowError(
								new ServiceOperationError(`warehouse with id of ${testModel.id} not found`)
							);
						});
					});
					describe('when repository.findById() returns a warehouse to delete', () => {
						describe('when repository.delete() throws an error', () => {
							it('throws a repository execution error', async () => {
								getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
								findByIdSpy.mockImplementationOnce(() => [testModel]);
								deleteSpy.mockImplementationOnce(() => {
									throw new RepositoryExecutionError('test error');
								});

								await expect(warehouseService.deleteWarehouse(testId)).rejects.toThrowError(
									new ServiceOperationError(`test error`)
								);
							});
						});

						describe('when repository.delete() returns 0 affected rows', () => {
							it('throws a service operation error', async () => {
								getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
								findByIdSpy.mockImplementationOnce(() => [testModel]);
								deleteSpy.mockImplementationOnce(() => ({ affectedRows: 0 }));

								await expect(warehouseService.deleteWarehouse(testId)).rejects.toThrowError(
									new ServiceOperationError(`warehouse deletion failed, no rows affected`)
								);
							});
						});
						describe('when repository.delete() returns a number other than 0 for affected rows', () => {
							describe('when transactionHandler.commit() throws an error', () => {
								it('throws a transaction handling error', async () => {
									getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
									findByIdSpy.mockImplementationOnce(() => [testModel]);
									deleteSpy.mockImplementationOnce(() => ({ affectedRows: 1 }));
									commitSpy.mockImplementationOnce(() => {
										throw new TransactionHandlingError('test error');
									});

									await expect(warehouseService.deleteWarehouse(testId)).rejects.toThrowError(
										new TransactionHandlingError(`test error`)
									);
								});
							});

							describe('when transactionHandler.commit() succeeds', () => {
								it('returns without any error', async () => {
									getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
									findByIdSpy.mockImplementationOnce(() => [testModel]);
									deleteSpy.mockImplementationOnce(() => ({ affectedRows: 1 }));

									await expect(warehouseService.deleteWarehouse(testId)).resolves.not.toThrow();
								});
							});
						});
					});
				});
			});
			describe('when an error is thrown during execution', () => {
				describe('when there is a connection', () => {
					describe('when transactionHandler.rollback() fails', () => {
						describe('when an error instance is thrown', () => {
							it('throws a service execution error', async () => {
								getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
								findByIdSpy.mockImplementationOnce(() => {
									throw new TransactionHandlingError('test error');
								});
								rollbackSpy.mockImplementationOnce(() => {
									throw new Error('rollback error');
								});
								await expect(warehouseService.deleteWarehouse(testId)).rejects.toThrowError(
									new ServiceExecutionError('rollback failed: rollback error')
								);
							});
						});
						describe('when something else is thrown', () => {
							it('throws a service execution error', async () => {
								getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
								findByIdSpy.mockImplementationOnce(() => {
									throw new TransactionHandlingError('test error');
								});
								rollbackSpy.mockImplementationOnce(() => {
									throw 'rollback error';
								});
								await expect(warehouseService.deleteWarehouse(testId)).rejects.toThrowError(
									new ServiceExecutionError('rollback failed: rollback error')
								);
							});
						});
					});
				});
			});
		});
	});
});

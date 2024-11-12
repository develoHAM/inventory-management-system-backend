// @ts-nocheck
import { jest, it, describe, beforeAll, beforeEach, afterAll, afterEach, expect } from '@jest/globals';
import { StoreBranchService } from '../../src/services';
import { StoreBranchRepository } from '../../src/repositories';
import { TransactionHandler } from '../../src/databases';
import { StoreBranchDAO } from '../../src/daos';
import Database from '../../src/databases';
import { DTO } from '../../src/dtos/DTO';
import { IDAO } from '../../src/types/IDAO';
import { IRepository } from '../../src/types/IRepository';
import { ITransactionHandler } from '../../src/types/ITransactionHandler';
import { ServiceExecutionError, ServiceOperationError, ValidationError } from '../../src/errors/services';
import { RepositoryExecutionError, TransactionHandlingError } from '../../src/errors/persistence';
jest.mock('../../src/repositories/store_branch.repository');
jest.mock('../../src/databases/TransactionHandler');
jest.mock('../../src/databases/mysql.database');
jest.mock('../../src/daos/store_branch.dao');

describe('StoreBranchService', () => {
	let databaseMock: Database;
	let transactionHandlerMock: ITransactionHandler<any>;
	let storeBranchDaoMock: IDAO<any, any, any>;
	let storeBranchRepositoryMock: IRepository<any, any, any>;
	let storeBranchService: StoreBranchService;
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
		storeBranchDaoMock = new StoreBranchDAO(databaseMock);
		storeBranchRepositoryMock = new StoreBranchRepository(storeBranchDaoMock);
		transactionHandlerMock = new TransactionHandler(databaseMock);

		storeBranchService = new StoreBranchService({
			storeBranchRepository: storeBranchRepositoryMock,
			transactionHandler: transactionHandlerMock,
		});
		fromSpy = jest.spyOn(DTO, 'from').mockImplementation((data) => ({ ...data }));
	});

	describe('getStoreBranchById', () => {
		let getStoreBranchByIdSpy;
		let findByIdSpy;
		beforeEach(() => {
			getStoreBranchByIdSpy = jest.spyOn(storeBranchService, 'getStoreBranchById');
			findByIdSpy = jest.spyOn(storeBranchRepositoryMock, 'findById');
		});
		describe('when id is given', () => {
			describe('when repository returns with the storeBranch', () => {
				it('returns the storeBranch dto', async () => {
					findByIdSpy.mockImplementationOnce(async ({ id }) => {
						return [{ id: id, name: 'test name', description: 'test description' }];
					});
					await expect(storeBranchService.getStoreBranchById(testId)).resolves.toEqual({
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
					await expect(storeBranchService.getStoreBranchById(testId)).resolves.toBeNull();
				});
			});
			describe('when id is not valid', () => {
				it('throws a validation error', async () => {
					fromSpy.mockImplementationOnce(() => {
						throw new ValidationError('test error');
					});
					await expect(storeBranchService.getStoreBranchById('string')).rejects.toThrowError(
						new ValidationError('test error')
					);
				});
			});
		});
	});
	describe('getStoreBranches', () => {
		let getStoreBranchesSpy;
		let findSpy;
		let findAllSpy;
		beforeEach(() => {
			getStoreBranchesSpy = jest.spyOn(storeBranchService, 'getStoreBranches');
			findSpy = jest.spyOn(storeBranchRepositoryMock, 'find');
			findAllSpy = jest.spyOn(storeBranchRepositoryMock, 'findAll');
		});

		describe('when criteria is given', () => {
			describe('when criteria is valid', () => {
				describe('when storeBranches exist', () => {
					it('returns the storeBranches array', async () => {
						findSpy.mockImplementationOnce(() => [testModel, testModel]);

						await expect(storeBranchService.getStoreBranches(testCriteria)).resolves.toEqual([
							testModel,
							testModel,
						]);
						expect(findSpy).toHaveBeenCalledTimes(1);
						expect(fromSpy).toHaveBeenCalledTimes(3);
					});
				});
				describe('when storeBranches do not exist', () => {
					it('returns an empty array', async () => {
						findSpy.mockImplementationOnce(() => []);

						await expect(storeBranchService.getStoreBranches(testCriteria)).resolves.toEqual([]);
					});
				});
			});

			describe('when criteria is not valid', () => {
				it('throws a validation error', async () => {
					fromSpy.mockImplementationOnce(() => {
						throw new ValidationError('test error');
					});

					await expect(storeBranchService.getStoreBranches(testCriteria)).rejects.toThrowError(
						new ValidationError('test error')
					);
				});
			});
		});
		describe('when criteria is not given', () => {
			describe('when storeBranches exist', () => {
				it('returns the storeBranches array', async () => {
					findAllSpy.mockImplementationOnce(() => [testModel, testModel]);

					await expect(storeBranchService.getStoreBranches()).resolves.toEqual([testModel, testModel]);
					expect(findAllSpy).toHaveBeenCalledTimes(1);
					expect(fromSpy).toHaveBeenCalledTimes(2);
				});
			});
			describe('when storeBranches do not exist', () => {
				it('returns an empty array', async () => {
					findAllSpy.mockImplementationOnce(() => []);

					await expect(storeBranchService.getStoreBranches()).resolves.toEqual([]);
				});
			});
		});
	});
	describe('createStoreBranch', () => {
		let getStoreBranchesSpy;
		let createSpy;
		let findByIdSpy;
		beforeEach(() => {
			createStoreBranchSpy = jest.spyOn(storeBranchService, 'createStoreBranch');
			createSpy = jest.spyOn(storeBranchRepositoryMock, 'create');
			findByIdSpy = jest.spyOn(storeBranchRepositoryMock, 'findById');
		});

		describe('when newStoreBranchData is given', () => {
			describe('when newStoreBranchData is valid', () => {
				describe('when repository successfully creates a new storeBranch', () => {
					it('returns the newly created storeBranch', async () => {
						findByIdSpy.mockImplementationOnce(() => [testModel]);
						createSpy.mockImplementationOnce(() => ({ insertId: 1 }));

						await expect(storeBranchService.createStoreBranch(testNewData)).resolves.toEqual(testModel);
					});
				});
				describe('when repository execution error is thrown', () => {
					it('throws a repository execution error', async () => {
						createSpy.mockImplementationOnce(() => {
							throw new RepositoryExecutionError('test error');
						});

						await expect(storeBranchService.createStoreBranch(testNewData)).rejects.toThrowError(
							new RepositoryExecutionError('test error')
						);
					});
				});
			});
			describe('when newStoreBranchData is not valid', () => {
				it('throws a validation error', async () => {
					fromSpy.mockImplementationOnce(() => {
						throw new ValidationError('test error');
					});

					await expect(storeBranchService.createStoreBranch(testNewData)).rejects.toThrowError(
						new ValidationError('test error')
					);
				});
			});
		});
	});
	describe('updateStoreBranch', () => {
		let updateStoreBranchSpy;

		beforeEach(() => {
			updateStoreBranchSpy = jest.spyOn(storeBranchService, 'updateStoreBranch');

			getConnectionSpy = jest.spyOn(transactionHandlerMock, 'getConnection');
			beginSpy = jest.spyOn(transactionHandlerMock, 'begin');
			commitSpy = jest.spyOn(transactionHandlerMock, 'commit');
			rollbackSpy = jest.spyOn(transactionHandlerMock, 'rollback');
			endSpy = jest.spyOn(transactionHandlerMock, 'end');

			findByIdSpy = jest.spyOn(storeBranchRepositoryMock, 'findById');
			updateSpy = jest.spyOn(storeBranchRepositoryMock, 'update');
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

				await expect(storeBranchService.updateStoreBranch('1', testUpdates)).rejects.toThrowError(
					new ValidationError('test error 1')
				);
				await expect(storeBranchService.updateStoreBranch(1, { prop: 'test update' })).rejects.toThrowError(
					new ValidationError('test error 2')
				);
			});
		});
		describe('when id and updates are valid', () => {
			describe('when connection is empty', () => {
				it('throws a service operation error', async () => {
					getConnectionSpy.mockImplementationOnce(() => undefined);

					await expect(storeBranchService.updateStoreBranch(1, testUpdates)).rejects.toThrowError(
						new ServiceOperationError('cannot retrieve database connection')
					);
				});
			});
			describe('when storeBranch to update is found', () => {
				describe('when repository update execution fails', () => {
					it('throws a repository execution error', async () => {
						findByIdSpy.mockImplementationOnce(() => [testModel]);
						getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
						updateSpy.mockImplementationOnce(() => {
							throw new RepositoryExecutionError('test error');
						});

						await expect(storeBranchService.updateStoreBranch(1, testUpdates)).rejects.toThrowError(
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

							await expect(storeBranchService.updateStoreBranch(1, testUpdates)).rejects.toThrowError(
								new ServiceExecutionError('storeBranch update failed, no rows affected')
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

								await expect(storeBranchService.updateStoreBranch(1, testUpdates)).rejects.toThrowError(
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

									await expect(
										storeBranchService.updateStoreBranch(1, testUpdates)
									).rejects.toThrowError(new RepositoryExecutionError('test error'));
								});
							});
							describe('when repository findById() succeeds', () => {
								it('retuns the updated storeBranch', async () => {
									findByIdSpy.mockImplementation(() => [testModel]);

									getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
									updateSpy.mockImplementationOnce(() => ({ affectedRows: 1 }));
									commitSpy.mockImplementationOnce(() => {
										return;
									});

									await expect(storeBranchService.updateStoreBranch(1, testUpdates)).resolves.toEqual(
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

						await expect(storeBranchService.updateStoreBranch(1, testUpdates)).rejects.toThrowError(
							new ServiceOperationError(`storeBranch update failed, no rows affected`)
						);

						findByIdSpy.mockClear();
					});
				});
			});
			describe('when storeBranch to update is not found', () => {
				it('throw a service operation error', async () => {
					findByIdSpy.mockImplementationOnce(() => []);
					getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));

					await expect(storeBranchService.updateStoreBranch(1, testUpdates)).rejects.toThrowError(
						new ServiceOperationError(`storeBranch with id of ${testModel.id} not found`)
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
					await expect(storeBranchService.updateStoreBranch(1, testUpdates)).rejects.toThrowError(
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

					await expect(storeBranchService.updateStoreBranch(1, testUpdates)).rejects.toThrowError(
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

					await expect(storeBranchService.updateStoreBranch(1, testUpdates)).rejects.toThrowError(
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

						await expect(storeBranchService.updateStoreBranch(1, testUpdates)).rejects.toThrowError(
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

						await expect(storeBranchService.updateStoreBranch(1, testUpdates)).rejects.toThrowError(
							new TransactionHandlingError('rollback failed: test rollback error')
						);

						findByIdSpy.mockClear();
					});
				});
			});
		});
	});
	describe('deleteStoreBranch', () => {
		let deleteStoreBranchSpy;

		beforeEach(() => {
			deleteStoreBranchSpy = jest.spyOn(storeBranchService, 'deleteStoreBranch');

			getConnectionSpy = jest.spyOn(transactionHandlerMock, 'getConnection');
			beginSpy = jest.spyOn(transactionHandlerMock, 'begin');
			commitSpy = jest.spyOn(transactionHandlerMock, 'commit');
			rollbackSpy = jest.spyOn(transactionHandlerMock, 'rollback');
			endSpy = jest.spyOn(transactionHandlerMock, 'end');

			findByIdSpy = jest.spyOn(storeBranchRepositoryMock, 'findById');
			deleteSpy = jest.spyOn(storeBranchRepositoryMock, 'delete');
		});
		describe('when id is not valid', () => {
			it('throws a validation error', async () => {
				fromSpy.mockImplementationOnce(() => {
					throw new ValidationError('test error');
				});

				await expect(storeBranchService.deleteStoreBranch(testId)).rejects.toThrowError(
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

					await expect(storeBranchService.deleteStoreBranch(testId)).rejects.toThrowError(
						new TransactionHandlingError('test error')
					);
				});
			});

			describe('when transactionHandler.getConnection() returns nothing', () => {
				it('throws a service operation error', async () => {
					getConnectionSpy.mockImplementationOnce(() => undefined);

					await expect(storeBranchService.deleteStoreBranch(testId)).rejects.toThrowError(
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

						await expect(storeBranchService.deleteStoreBranch(testId)).rejects.toThrowError(
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

							await expect(storeBranchService.deleteStoreBranch(testId)).rejects.toThrowError(
								new RepositoryExecutionError('test error')
							);
						});
					});
					describe('when repository.findById() returns an empty array', () => {
						it('throws a service operation error', async () => {
							getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
							findByIdSpy.mockImplementationOnce(() => []);

							await expect(storeBranchService.deleteStoreBranch(testId)).rejects.toThrowError(
								new ServiceOperationError(`storeBranch with id of ${testModel.id} not found`)
							);
						});
					});
					describe('when repository.findById() returns a storeBranch to delete', () => {
						describe('when repository.delete() throws an error', () => {
							it('throws a repository execution error', async () => {
								getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
								findByIdSpy.mockImplementationOnce(() => [testModel]);
								deleteSpy.mockImplementationOnce(() => {
									throw new RepositoryExecutionError('test error');
								});

								await expect(storeBranchService.deleteStoreBranch(testId)).rejects.toThrowError(
									new ServiceOperationError(`test error`)
								);
							});
						});

						describe('when repository.delete() returns 0 affected rows', () => {
							it('throws a service operation error', async () => {
								getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
								findByIdSpy.mockImplementationOnce(() => [testModel]);
								deleteSpy.mockImplementationOnce(() => ({ affectedRows: 0 }));

								await expect(storeBranchService.deleteStoreBranch(testId)).rejects.toThrowError(
									new ServiceOperationError(`storeBranch deletion failed, no rows affected`)
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

									await expect(storeBranchService.deleteStoreBranch(testId)).rejects.toThrowError(
										new TransactionHandlingError(`test error`)
									);
								});
							});

							describe('when transactionHandler.commit() succeeds', () => {
								it('returns without any error', async () => {
									getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
									findByIdSpy.mockImplementationOnce(() => [testModel]);
									deleteSpy.mockImplementationOnce(() => ({ affectedRows: 1 }));

									await expect(storeBranchService.deleteStoreBranch(testId)).resolves.not.toThrow();
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
								await expect(storeBranchService.deleteStoreBranch(testId)).rejects.toThrowError(
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
								await expect(storeBranchService.deleteStoreBranch(testId)).rejects.toThrowError(
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

// @ts-nocheck
import { jest, it, describe, beforeAll, beforeEach, afterAll, afterEach, expect } from '@jest/globals';
import { ProductBrandService } from '../../src/services';
import { ProductBrandRepository } from '../../src/repositories';
import { TransactionHandler } from '../../src/databases';
import { ProductBrandDAO } from '../../src/daos';
import Database from '../../src/databases';
import { DTO } from '../../src/dtos/DTO';
import { IDAO } from '../../src/types/IDAO';
import { IRepository } from '../../src/types/IRepository';
import { ITransactionHandler } from '../../src/types/ITransactionHandler';
import { ServiceExecutionError, ServiceOperationError, ValidationError } from '../../src/errors/services';
import { RepositoryExecutionError, TransactionHandlingError } from '../../src/errors/persistence';
jest.mock('../../src/repositories/product_brand.repository');
jest.mock('../../src/databases/TransactionHandler');
jest.mock('../../src/databases/mysql.database');
jest.mock('../../src/daos/product_brand.dao');

describe('ProductBrandService', () => {
	let databaseMock: Database;
	let transactionHandlerMock: ITransactionHandler<any>;
	let productBrandDaoMock: IDAO<any, any, any>;
	let productBrandRepositoryMock: IRepository<any, any, any>;
	let productBrandService: ProductBrandService;
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
		productBrandDaoMock = new ProductBrandDAO(databaseMock);
		productBrandRepositoryMock = new ProductBrandRepository(productBrandDaoMock);
		transactionHandlerMock = new TransactionHandler(databaseMock);

		productBrandService = new ProductBrandService({
			productBrandRepository: productBrandRepositoryMock,
			transactionHandler: transactionHandlerMock,
		});
		fromSpy = jest.spyOn(DTO, 'from').mockImplementation((data) => ({ ...data }));
	});

	describe('getProductBrandById', () => {
		let getProductBrandByIdSpy;
		let findByIdSpy;
		beforeEach(() => {
			getProductBrandByIdSpy = jest.spyOn(productBrandService, 'getProductBrandById');
			findByIdSpy = jest.spyOn(productBrandRepositoryMock, 'findById');
		});
		describe('when id is given', () => {
			describe('when repository returns with the productBrand', () => {
				it('returns the productBrand dto', async () => {
					findByIdSpy.mockImplementationOnce(async ({ id }) => {
						return [{ id: id, name: 'test name', description: 'test description' }];
					});
					await expect(productBrandService.getProductBrandById(testId)).resolves.toEqual({
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
					await expect(productBrandService.getProductBrandById(testId)).resolves.toBeNull();
				});
			});
			describe('when id is not valid', () => {
				it('throws a validation error', async () => {
					fromSpy.mockImplementationOnce(() => {
						throw new ValidationError('test error');
					});
					await expect(productBrandService.getProductBrandById('string')).rejects.toThrowError(
						new ValidationError('test error')
					);
				});
			});
		});
	});
	describe('getProductBrands', () => {
		let getProductBrandsSpy;
		let findSpy;
		let findAllSpy;
		beforeEach(() => {
			getProductBrandsSpy = jest.spyOn(productBrandService, 'getProductBrands');
			findSpy = jest.spyOn(productBrandRepositoryMock, 'find');
			findAllSpy = jest.spyOn(productBrandRepositoryMock, 'findAll');
		});

		describe('when criteria is given', () => {
			describe('when criteria is valid', () => {
				describe('when product brands exist', () => {
					it('returns the product brands array', async () => {
						findSpy.mockImplementationOnce(() => [testModel, testModel]);

						await expect(productBrandService.getProductBrands(testCriteria)).resolves.toEqual([
							testModel,
							testModel,
						]);
						expect(findSpy).toHaveBeenCalledTimes(1);
						expect(fromSpy).toHaveBeenCalledTimes(3);
					});
				});
				describe('when product brands do not exist', () => {
					it('returns an empty array', async () => {
						findSpy.mockImplementationOnce(() => []);

						await expect(productBrandService.getProductBrands(testCriteria)).resolves.toEqual([]);
					});
				});
			});

			describe('when criteria is not valid', () => {
				it('throws a validation error', async () => {
					fromSpy.mockImplementationOnce(() => {
						throw new ValidationError('test error');
					});

					await expect(productBrandService.getProductBrands(testCriteria)).rejects.toThrowError(
						new ValidationError('test error')
					);
				});
			});
		});
		describe('when criteria is not given', () => {
			describe('when product brands exist', () => {
				it('returns the product brands array', async () => {
					findAllSpy.mockImplementationOnce(() => [testModel, testModel]);

					await expect(productBrandService.getProductBrands()).resolves.toEqual([testModel, testModel]);
					expect(findAllSpy).toHaveBeenCalledTimes(1);
					expect(fromSpy).toHaveBeenCalledTimes(2);
				});
			});
			describe('when product brands do not exist', () => {
				it('returns an empty array', async () => {
					findAllSpy.mockImplementationOnce(() => []);

					await expect(productBrandService.getProductBrands()).resolves.toEqual([]);
				});
			});
		});
	});
	describe('createProductBrand', () => {
		let getProductBrandsSpy;
		let createSpy;
		let findByIdSpy;
		beforeEach(() => {
			createProductBrandSpy = jest.spyOn(productBrandService, 'createProductBrand');
			createSpy = jest.spyOn(productBrandRepositoryMock, 'create');
			findByIdSpy = jest.spyOn(productBrandRepositoryMock, 'findById');
		});

		describe('when newProductBrandData is given', () => {
			describe('when newProductBrandData is valid', () => {
				describe('when repository successfully creates a new productBrand', () => {
					it('returns the newly created productBrand', async () => {
						findByIdSpy.mockImplementationOnce(() => [testModel]);
						createSpy.mockImplementationOnce(() => ({ insertId: 1 }));

						await expect(productBrandService.createProductBrand(testNewData)).resolves.toEqual(testModel);
					});
				});
				describe('when repository execution error is thrown', () => {
					it('throws a repository execution error', async () => {
						createSpy.mockImplementationOnce(() => {
							throw new RepositoryExecutionError('test error');
						});

						await expect(productBrandService.createProductBrand(testNewData)).rejects.toThrowError(
							new RepositoryExecutionError('test error')
						);
					});
				});
			});
			describe('when newProductBrandData is not valid', () => {
				it('throws a validation error', async () => {
					fromSpy.mockImplementationOnce(() => {
						throw new ValidationError('test error');
					});

					await expect(productBrandService.createProductBrand(testNewData)).rejects.toThrowError(
						new ValidationError('test error')
					);
				});
			});
		});
	});
	describe('updateProductBrand', () => {
		let updateProductBrandSpy;

		beforeEach(() => {
			updateProductBrandSpy = jest.spyOn(productBrandService, 'updateProductBrand');

			getConnectionSpy = jest.spyOn(transactionHandlerMock, 'getConnection');
			beginSpy = jest.spyOn(transactionHandlerMock, 'begin');
			commitSpy = jest.spyOn(transactionHandlerMock, 'commit');
			rollbackSpy = jest.spyOn(transactionHandlerMock, 'rollback');
			endSpy = jest.spyOn(transactionHandlerMock, 'end');

			findByIdSpy = jest.spyOn(productBrandRepositoryMock, 'findById');
			updateSpy = jest.spyOn(productBrandRepositoryMock, 'update');
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

				await expect(productBrandService.updateProductBrand('1', testUpdates)).rejects.toThrowError(
					new ValidationError('test error 1')
				);
				await expect(productBrandService.updateProductBrand(1, { prop: 'test update' })).rejects.toThrowError(
					new ValidationError('test error 2')
				);
			});
		});
		describe('when id and updates are valid', () => {
			describe('when connection is empty', () => {
				it('throws a service operation error', async () => {
					getConnectionSpy.mockImplementationOnce(() => undefined);

					await expect(productBrandService.updateProductBrand(1, testUpdates)).rejects.toThrowError(
						new ServiceOperationError('cannot retrieve database connection')
					);
				});
			});
			describe('when productBrand to update is found', () => {
				describe('when repository update execution fails', () => {
					it('throws a repository execution error', async () => {
						findByIdSpy.mockImplementationOnce(() => [testModel]);
						getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
						updateSpy.mockImplementationOnce(() => {
							throw new RepositoryExecutionError('test error');
						});

						await expect(productBrandService.updateProductBrand(1, testUpdates)).rejects.toThrowError(
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

							await expect(productBrandService.updateProductBrand(1, testUpdates)).rejects.toThrowError(
								new ServiceExecutionError('productBrand update failed, no rows affected')
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

								await expect(
									productBrandService.updateProductBrand(1, testUpdates)
								).rejects.toThrowError(new TransactionHandlingError('test error'));
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
										productBrandService.updateProductBrand(1, testUpdates)
									).rejects.toThrowError(new RepositoryExecutionError('test error'));
								});
							});
							describe('when repository findById() succeeds', () => {
								it('retuns the updated productBrand', async () => {
									findByIdSpy.mockImplementation(() => [testModel]);

									getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
									updateSpy.mockImplementationOnce(() => ({ affectedRows: 1 }));
									commitSpy.mockImplementationOnce(() => {
										return;
									});

									await expect(
										productBrandService.updateProductBrand(1, testUpdates)
									).resolves.toEqual(testModel);

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

						await expect(productBrandService.updateProductBrand(1, testUpdates)).rejects.toThrowError(
							new ServiceOperationError(`productBrand update failed, no rows affected`)
						);

						findByIdSpy.mockClear();
					});
				});
			});
			describe('when productBrand to update is not found', () => {
				it('throw a service operation error', async () => {
					findByIdSpy.mockImplementationOnce(() => []);
					getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));

					await expect(productBrandService.updateProductBrand(1, testUpdates)).rejects.toThrowError(
						new ServiceOperationError(`productBrand with id of ${testModel.id} not found`)
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
					await expect(productBrandService.updateProductBrand(1, testUpdates)).rejects.toThrowError(
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

					await expect(productBrandService.updateProductBrand(1, testUpdates)).rejects.toThrowError(
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

					await expect(productBrandService.updateProductBrand(1, testUpdates)).rejects.toThrowError(
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

						await expect(productBrandService.updateProductBrand(1, testUpdates)).rejects.toThrowError(
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

						await expect(productBrandService.updateProductBrand(1, testUpdates)).rejects.toThrowError(
							new TransactionHandlingError('rollback failed: test rollback error')
						);

						findByIdSpy.mockClear();
					});
				});
			});
		});
	});
	describe('deleteProductBrand', () => {
		let deleteProductBrandSpy;

		beforeEach(() => {
			deleteProductBrandSpy = jest.spyOn(productBrandService, 'deleteProductBrand');

			getConnectionSpy = jest.spyOn(transactionHandlerMock, 'getConnection');
			beginSpy = jest.spyOn(transactionHandlerMock, 'begin');
			commitSpy = jest.spyOn(transactionHandlerMock, 'commit');
			rollbackSpy = jest.spyOn(transactionHandlerMock, 'rollback');
			endSpy = jest.spyOn(transactionHandlerMock, 'end');

			findByIdSpy = jest.spyOn(productBrandRepositoryMock, 'findById');
			deleteSpy = jest.spyOn(productBrandRepositoryMock, 'delete');
		});
		describe('when id is not valid', () => {
			it('throws a validation error', async () => {
				fromSpy.mockImplementationOnce(() => {
					throw new ValidationError('test error');
				});

				await expect(productBrandService.deleteProductBrand(testId)).rejects.toThrowError(
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

					await expect(productBrandService.deleteProductBrand(testId)).rejects.toThrowError(
						new TransactionHandlingError('test error')
					);
				});
			});

			describe('when transactionHandler.getConnection() returns nothing', () => {
				it('throws a service operation error', async () => {
					getConnectionSpy.mockImplementationOnce(() => undefined);

					await expect(productBrandService.deleteProductBrand(testId)).rejects.toThrowError(
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

						await expect(productBrandService.deleteProductBrand(testId)).rejects.toThrowError(
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

							await expect(productBrandService.deleteProductBrand(testId)).rejects.toThrowError(
								new RepositoryExecutionError('test error')
							);
						});
					});
					describe('when repository.findById() returns an empty array', () => {
						it('throws a service operation error', async () => {
							getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
							findByIdSpy.mockImplementationOnce(() => []);

							await expect(productBrandService.deleteProductBrand(testId)).rejects.toThrowError(
								new ServiceOperationError(`productBrand with id of ${testModel.id} not found`)
							);
						});
					});
					describe('when repository.findById() returns a productBrand to delete', () => {
						describe('when repository.delete() throws an error', () => {
							it('throws a repository execution error', async () => {
								getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
								findByIdSpy.mockImplementationOnce(() => [testModel]);
								deleteSpy.mockImplementationOnce(() => {
									throw new RepositoryExecutionError('test error');
								});

								await expect(productBrandService.deleteProductBrand(testId)).rejects.toThrowError(
									new ServiceOperationError(`test error`)
								);
							});
						});

						describe('when repository.delete() returns 0 affected rows', () => {
							it('throws a service operation error', async () => {
								getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
								findByIdSpy.mockImplementationOnce(() => [testModel]);
								deleteSpy.mockImplementationOnce(() => ({ affectedRows: 0 }));

								await expect(productBrandService.deleteProductBrand(testId)).rejects.toThrowError(
									new ServiceOperationError(`productBrand deletion failed, no rows affected`)
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

									await expect(productBrandService.deleteProductBrand(testId)).rejects.toThrowError(
										new TransactionHandlingError(`test error`)
									);
								});
							});

							describe('when transactionHandler.commit() succeeds', () => {
								it('returns without any error', async () => {
									getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
									findByIdSpy.mockImplementationOnce(() => [testModel]);
									deleteSpy.mockImplementationOnce(() => ({ affectedRows: 1 }));

									await expect(productBrandService.deleteProductBrand(testId)).resolves.not.toThrow();
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
								await expect(productBrandService.deleteProductBrand(testId)).rejects.toThrowError(
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
								await expect(productBrandService.deleteProductBrand(testId)).rejects.toThrowError(
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

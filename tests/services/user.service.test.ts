// @ts-nocheck
import { jest, it, describe, beforeAll, beforeEach, afterAll, afterEach, expect } from '@jest/globals';
import { UserService } from '../../src/services';
import { UserRepository } from '../../src/repositories';
import { TransactionHandler } from '../../src/databases';
import { UserDAO } from '../../src/daos';
import Database from '../../src/databases';
import { DTO } from '../../src/dtos/DTO';
import { IDAO } from '../../src/types/IDAO';
import { IRepository } from '../../src/types/IRepository';
import { ITransactionHandler } from '../../src/types/ITransactionHandler';
import { IHashingUtility } from '../../src/types/IHashingUtility';
import { ServiceExecutionError, ServiceOperationError, ValidationError } from '../../src/errors/services';
import { RepositoryExecutionError, TransactionHandlingError } from '../../src/errors/persistence';
import { HashingUtility } from '../../src/utilities';

jest.mock('../../src/repositories/user.repository');
jest.mock('../../src/databases/TransactionHandler');
jest.mock('../../src/databases/mysql.database');
jest.mock('../../src/daos/user.dao');
jest.mock('../../src/utilities/HashingUtility');

describe('UserService', () => {
	let databaseMock: Database;
	let transactionHandlerMock: ITransactionHandler<any>;
	let userDaoMock: IDAO<any, any, any>;
	let userRepositoryMock: IRepository<any, any, any>;
	let userService: UserService;
	let hashingUtilityMock: IHashingUtility;
	const testId = 1;
	const testUsername = 'test username';
	const testModelWithoutPassword = {
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
	const testModelWithPassword = { ...testModelWithoutPassword, password: 'test password' };

	let fromSpy;
	beforeEach(() => {
		databaseMock = new Database({}, []);
		userDaoMock = new UserDAO(databaseMock);
		userRepositoryMock = new UserRepository(userDaoMock);
		transactionHandlerMock = new TransactionHandler(databaseMock);
		hashingUtilityMock = new HashingUtility(5);

		userService = new UserService({
			userRepository: userRepositoryMock,
			transactionHandler: transactionHandlerMock,
			hashingUtility: hashingUtilityMock,
		});
		fromSpy = jest.spyOn(DTO, 'from').mockImplementation((data) => ({ ...data }));
	});

	describe('getUserById', () => {
		let getUserByIdSpy;
		let findByIdSpy;
		beforeEach(() => {
			getUserByIdSpy = jest.spyOn(userService, 'getUserById');
			findByIdSpy = jest.spyOn(userRepositoryMock, 'findById');
		});
		describe('when id is given', () => {
			describe('when repository returns with the user', () => {
				describe('when showPassword option is not provided or false', () => {
					it('returns the user dto without password field', async () => {
						findByIdSpy.mockImplementationOnce(async ({ id }) => {
							return [testModelWithPassword];
						});
						await expect(userService.getUserById(testId)).resolves.toEqual({
							id: 1,
							name: 'test name',
							description: 'test description',
						});
					});
				});
				describe('when showPassword option is true', () => {
					it('returns the user dto with the password field', async () => {
						findByIdSpy.mockImplementationOnce(async ({ id }) => {
							return [testModelWithPassword];
						});
						await expect(userService.getUserById(testId, true)).resolves.toEqual(testModelWithPassword);
					});
				});
			});
			describe('when repository does not return anything', () => {
				it('returns null', async () => {
					findByIdSpy.mockImplementationOnce(async ({ id }) => {
						return [];
					});
					await expect(userService.getUserById(testId)).resolves.toBeNull();
				});
			});
			describe('when id is not valid', () => {
				it('throws a validation error', async () => {
					fromSpy.mockImplementationOnce(() => {
						throw new ValidationError('test error');
					});
					await expect(userService.getUserById('string')).rejects.toThrowError(
						new ValidationError('test error')
					);
				});
			});
		});
	});

	describe('getUserByUsername', () => {
		let getUserByUsernameSpy;
		let findSpy;
		beforeEach(() => {
			getUserByUsernameSpy = jest.spyOn(userService, 'getUserByUsername');
			findSpy = jest.spyOn(userRepositoryMock, 'find');
		});
		describe('when username is given', () => {
			describe('when repository returns with the user', () => {
				describe('when showPassword option is not provided or false', () => {
					it('returns the user dto without password field', async () => {
						findSpy.mockImplementationOnce(async ({ username }) => {
							return [testModelWithPassword];
						});
						await expect(userService.getUserByUsername(testUsername)).resolves.toEqual(
							testModelWithoutPassword
						);
					});
				});
				describe('when showPassword option is true', () => {
					it('returns the user dto with the password field', async () => {
						findSpy.mockImplementationOnce(async ({ username }) => {
							return [testModelWithPassword];
						});
						await expect(userService.getUserByUsername(testUsername, true)).resolves.toEqual(
							testModelWithPassword
						);
					});
				});
			});
			describe('when repository does not return anything', () => {
				it('returns null', async () => {
					findSpy.mockImplementationOnce(async ({ id }) => {
						return [];
					});
					await expect(userService.getUserByUsername(testUsername)).resolves.toBeNull();
				});
			});
			describe('when username is not valid', () => {
				it('throws a validation error', async () => {
					fromSpy.mockImplementationOnce(() => {
						throw new ValidationError('test error');
					});
					await expect(userService.getUserByUsername(1)).rejects.toThrowError(
						new ValidationError('test error')
					);
				});
			});
		});
	});

	describe('getUsers', () => {
		let getUsersSpy;
		let findSpy;
		let findAllSpy;
		beforeEach(() => {
			getUsersSpy = jest.spyOn(userService, 'getUsers');
			findSpy = jest.spyOn(userRepositoryMock, 'find');
			findAllSpy = jest.spyOn(userRepositoryMock, 'findAll');
		});

		describe('when criteria is given', () => {
			describe('when criteria is valid', () => {
				describe('when users exist', () => {
					describe('when showPassword option is not provided or false', () => {
						it('returns the users array without the password field', async () => {
							findSpy.mockImplementationOnce(() => [
								testModelWithPassword,
								testModelWithPassword,
								testModelWithPassword,
							]);

							await expect(userService.getUsers(testCriteria)).resolves.toEqual([
								testModelWithoutPassword,
								testModelWithoutPassword,
								testModelWithoutPassword,
							]);
						});
					});
					describe('when showPassword option is true', () => {
						it('returns the users array with the password field', async () => {
							findSpy.mockImplementationOnce(() => [
								testModelWithPassword,
								testModelWithPassword,
								testModelWithPassword,
							]);

							await expect(userService.getUsers(testCriteria, true)).resolves.toEqual([
								testModelWithPassword,
								testModelWithPassword,
								testModelWithPassword,
							]);
						});
					});
				});
				describe('when users do not exist', () => {
					it('returns an empty array', async () => {
						findSpy.mockImplementationOnce(() => []);

						await expect(userService.getUsers(testCriteria)).resolves.toEqual([]);
					});
				});
			});

			describe('when criteria is not valid', () => {
				it('throws a validation error', async () => {
					fromSpy.mockImplementationOnce(() => {
						throw new ValidationError('test error');
					});

					await expect(userService.getUsers(testCriteria)).rejects.toThrowError(
						new ValidationError('test error')
					);
				});
			});
		});
		describe('when criteria is not given', () => {
			describe('when users exist', () => {
				it('returns the users array', async () => {
					findAllSpy.mockImplementationOnce(() => [testModelWithoutPassword, testModelWithoutPassword]);

					await expect(userService.getUsers()).resolves.toEqual([
						testModelWithoutPassword,
						testModelWithoutPassword,
					]);
					expect(findAllSpy).toHaveBeenCalledTimes(1);
					expect(fromSpy).toHaveBeenCalledTimes(2);
				});
			});
			describe('when users do not exist', () => {
				it('returns an empty array', async () => {
					findAllSpy.mockImplementationOnce(() => []);

					await expect(userService.getUsers()).resolves.toEqual([]);
				});
			});
		});
	});
	describe('createUser', () => {
		let getUsersSpy;
		let createSpy;
		let findByIdSpy;
		let generateHashSpy;
		beforeEach(() => {
			createUserSpy = jest.spyOn(userService, 'createUser');
			createSpy = jest.spyOn(userRepositoryMock, 'create');
			findByIdSpy = jest.spyOn(userRepositoryMock, 'findById');
			generateHashSpy = jest.spyOn(hashingUtilityMock, 'generateHash');
		});

		describe('when newUserData is given', () => {
			describe('when newUserData is valid', () => {
				describe('when repository successfully creates a new user', () => {
					describe('when showPasswordOption is not provided or false', () => {
						it('returns the newly created user without the password field', async () => {
							generateHashSpy.mockImplementationOnce(() => {
								return 'test hash';
							});
							createSpy.mockImplementationOnce(() => ({ insertId: 1 }));
							findByIdSpy.mockImplementationOnce(() => [testModelWithPassword]);
							await expect(userService.createUser(testNewData)).resolves.toEqual(
								testModelWithoutPassword
							);
						});
					});
					describe('when showPasswordOption is true', () => {
						it('returns the newly created user with the password field', async () => {
							generateHashSpy.mockImplementationOnce(() => {
								return 'test hash';
							});
							createSpy.mockImplementationOnce(() => ({ insertId: 1 }));
							findByIdSpy.mockImplementationOnce(() => [testModelWithPassword]);
							await expect(userService.createUser(testNewData, true)).resolves.toEqual(
								testModelWithPassword
							);
						});
					});
				});
				describe('when repository execution error is thrown', () => {
					it('throws a repository execution error', async () => {
						createSpy.mockImplementationOnce(() => {
							throw new RepositoryExecutionError('test error');
						});

						await expect(userService.createUser(testNewData)).rejects.toThrowError(
							new RepositoryExecutionError('test error')
						);
					});
				});
			});
			describe('when newUserData is not valid', () => {
				it('throws a validation error', async () => {
					fromSpy.mockImplementationOnce(() => {
						throw new ValidationError('test error');
					});

					await expect(userService.createUser(testNewData)).rejects.toThrowError(
						new ValidationError('test error')
					);
				});
			});
		});
	});
	describe('updateUser', () => {
		let updateUserSpy;

		beforeEach(() => {
			updateUserSpy = jest.spyOn(userService, 'updateUser');

			getConnectionSpy = jest.spyOn(transactionHandlerMock, 'getConnection');
			beginSpy = jest.spyOn(transactionHandlerMock, 'begin');
			commitSpy = jest.spyOn(transactionHandlerMock, 'commit');
			rollbackSpy = jest.spyOn(transactionHandlerMock, 'rollback');
			endSpy = jest.spyOn(transactionHandlerMock, 'end');

			findByIdSpy = jest.spyOn(userRepositoryMock, 'findById');
			updateSpy = jest.spyOn(userRepositoryMock, 'update');
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

				await expect(userService.updateUser('1', testUpdates)).rejects.toThrowError(
					new ValidationError('test error 1')
				);
				await expect(userService.updateUser(1, { prop: 'test update' })).rejects.toThrowError(
					new ValidationError('test error 2')
				);
			});
		});
		describe('when id and updates are valid', () => {
			describe('when connection is empty', () => {
				it('throws a service operation error', async () => {
					getConnectionSpy.mockImplementationOnce(() => undefined);

					await expect(userService.updateUser(1, testUpdates)).rejects.toThrowError(
						new ServiceOperationError('cannot retrieve database connection')
					);
				});
			});
			describe('when user to update is found', () => {
				describe('when repository update execution fails', () => {
					it('throws a repository execution error', async () => {
						findByIdSpy.mockImplementationOnce(() => [testModelWithoutPassword]);
						getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
						updateSpy.mockImplementationOnce(() => {
							throw new RepositoryExecutionError('test error');
						});

						await expect(userService.updateUser(1, testUpdates)).rejects.toThrowError(
							new RepositoryExecutionError('test error')
						);
					});
				});
				describe('when repository update execution succeeds', () => {
					describe('when affected rows is 0', () => {
						it('throws a service execution error', async () => {
							findByIdSpy.mockImplementationOnce(() => [testModelWithoutPassword]);
							getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
							updateSpy.mockImplementationOnce(() => ({ affectedRows: 0 }));

							await expect(userService.updateUser(1, testUpdates)).rejects.toThrowError(
								new ServiceExecutionError('user update failed, no rows affected')
							);
						});
					});
					describe('when affected rows is not 0', () => {
						describe('when transaction commit throws an error', () => {
							it('throws a transaction handling error', async () => {
								findByIdSpy.mockImplementationOnce(() => [testModelWithoutPassword]);
								getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
								updateSpy.mockImplementationOnce(() => ({ affectedRows: 1 }));
								commitSpy.mockImplementationOnce(() => {
									throw new TransactionHandlingError('test error');
								});

								await expect(userService.updateUser(1, testUpdates)).rejects.toThrowError(
									new TransactionHandlingError('test error')
								);
							});
						});
						describe('when transaction commit succeeds', () => {
							describe('when repository findById() throws an error', () => {
								it('throws a repoisitory execution error', async () => {
									findByIdSpy
										.mockImplementationOnce(() => [testModelWithoutPassword])
										.mockImplementationOnce(() => {
											throw new RepositoryExecutionError('test error');
										});
									getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
									updateSpy.mockImplementationOnce(() => ({ affectedRows: 1 }));
									commitSpy.mockImplementationOnce(() => {
										return;
									});

									await expect(userService.updateUser(1, testUpdates)).rejects.toThrowError(
										new RepositoryExecutionError('test error')
									);
								});
							});
							describe('when repository findById() succeeds', () => {
								describe('when showPassword option is not provided or false', () => {
									it('retuns the updated user without the password field', async () => {
										findByIdSpy.mockImplementation(() => [testModelWithoutPassword]);

										getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
										updateSpy.mockImplementationOnce(() => ({ affectedRows: 1 }));
										commitSpy.mockImplementationOnce(() => {
											return;
										});

										await expect(userService.updateUser(1, testUpdates)).resolves.toEqual(
											testModelWithoutPassword
										);

										findByIdSpy.mockClear();
									});
								});
								describe('when showPassword option is true', () => {
									it('retuns the updated user with the password field', async () => {
										findByIdSpy.mockImplementation(() => [testModelWithPassword]);

										getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
										updateSpy.mockImplementationOnce(() => ({ affectedRows: 1 }));
										commitSpy.mockImplementationOnce(() => {
											return;
										});

										await expect(userService.updateUser(1, testUpdates, true)).resolves.toEqual(
											testModelWithPassword
										);

										findByIdSpy.mockClear();
									});
								});
							});
						});
					});
				});
				describe('when repository update returns nothing', () => {
					it('throws a service operation error', async () => {
						findByIdSpy.mockImplementation(() => [testModelWithoutPassword]);
						getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
						updateSpy.mockImplementationOnce(() => ({ affectedRows: 0 }));

						await expect(userService.updateUser(1, testUpdates)).rejects.toThrowError(
							new ServiceOperationError(`user update failed, no rows affected`)
						);

						findByIdSpy.mockClear();
					});
				});
			});
			describe('when user to update is not found', () => {
				it('throw a service operation error', async () => {
					findByIdSpy.mockImplementationOnce(() => []);
					getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));

					await expect(userService.updateUser(1, testUpdates)).rejects.toThrowError(
						new ServiceOperationError(`user with id of ${testModelWithoutPassword.id} not found`)
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
					await expect(userService.updateUser(1, testUpdates)).rejects.toThrowError(
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

					await expect(userService.updateUser(1, testUpdates)).rejects.toThrowError(
						new TransactionHandlingError('test error')
					);
				});
			});

			describe('commit()', () => {
				it('throws a transaction handling error', async () => {
					getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
					findByIdSpy.mockImplementation(() => [testModelWithoutPassword]);
					updateSpy.mockImplementationOnce(() => ({ affectedRows: 1 }));
					commitSpy.mockImplementationOnce(() => {
						throw new TransactionHandlingError('test error');
					});

					await expect(userService.updateUser(1, testUpdates)).rejects.toThrowError(
						new TransactionHandlingError('test error')
					);

					findByIdSpy.mockClear();
				});
			});

			describe('rollback()', () => {
				describe('when an error instance is thrown', () => {
					it('throws a transaction handling error', async () => {
						getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
						findByIdSpy.mockImplementation(() => [testModelWithoutPassword]);
						updateSpy.mockImplementationOnce(() => ({ affectedRows: 1 }));
						commitSpy.mockImplementationOnce(() => {
							throw new TransactionHandlingError('test error');
						});
						rollbackSpy.mockImplementationOnce(() => {
							throw new TransactionHandlingError('test rollback error');
						});

						await expect(userService.updateUser(1, testUpdates)).rejects.toThrowError(
							new TransactionHandlingError('rollback failed: test rollback error')
						);

						findByIdSpy.mockClear();
					});
				});
				describe('when something else is thrown', () => {
					it('throws a transaction handling error', async () => {
						getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
						findByIdSpy.mockImplementation(() => [testModelWithoutPassword]);
						updateSpy.mockImplementationOnce(() => ({ affectedRows: 1 }));
						commitSpy.mockImplementationOnce(() => {
							throw new TransactionHandlingError('test error');
						});
						rollbackSpy.mockImplementationOnce(() => {
							throw 'test rollback error';
						});

						await expect(userService.updateUser(1, testUpdates)).rejects.toThrowError(
							new TransactionHandlingError('rollback failed: test rollback error')
						);

						findByIdSpy.mockClear();
					});
				});
			});
		});
	});
	describe('deleteUser', () => {
		let deleteUserSpy;

		beforeEach(() => {
			deleteUserSpy = jest.spyOn(userService, 'deleteUser');

			getConnectionSpy = jest.spyOn(transactionHandlerMock, 'getConnection');
			beginSpy = jest.spyOn(transactionHandlerMock, 'begin');
			commitSpy = jest.spyOn(transactionHandlerMock, 'commit');
			rollbackSpy = jest.spyOn(transactionHandlerMock, 'rollback');
			endSpy = jest.spyOn(transactionHandlerMock, 'end');

			findByIdSpy = jest.spyOn(userRepositoryMock, 'findById');
			deleteSpy = jest.spyOn(userRepositoryMock, 'delete');
		});
		describe('when id is not valid', () => {
			it('throws a validation error', async () => {
				fromSpy.mockImplementationOnce(() => {
					throw new ValidationError('test error');
				});

				await expect(userService.deleteUser(testId)).rejects.toThrowError(new ValidationError('test error'));
			});
		});
		describe('when id is valid', () => {
			describe('when transactionHandler.getConnection() throws an error', () => {
				it('throws a transaction handling error', async () => {
					getConnectionSpy.mockImplementationOnce(() => {
						throw new TransactionHandlingError('test error');
					});

					await expect(userService.deleteUser(testId)).rejects.toThrowError(
						new TransactionHandlingError('test error')
					);
				});
			});

			describe('when transactionHandler.getConnection() returns nothing', () => {
				it('throws a service operation error', async () => {
					getConnectionSpy.mockImplementationOnce(() => undefined);

					await expect(userService.deleteUser(testId)).rejects.toThrowError(
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

						await expect(userService.deleteUser(testId)).rejects.toThrowError(
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

							await expect(userService.deleteUser(testId)).rejects.toThrowError(
								new RepositoryExecutionError('test error')
							);
						});
					});
					describe('when repository.findById() returns an empty array', () => {
						it('throws a service operation error', async () => {
							getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
							findByIdSpy.mockImplementationOnce(() => []);

							await expect(userService.deleteUser(testId)).rejects.toThrowError(
								new ServiceOperationError(`user with id of ${testModelWithoutPassword.id} not found`)
							);
						});
					});
					describe('when repository.findById() returns a user to delete', () => {
						describe('when repository.delete() throws an error', () => {
							it('throws a repository execution error', async () => {
								getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
								findByIdSpy.mockImplementationOnce(() => [testModelWithoutPassword]);
								deleteSpy.mockImplementationOnce(() => {
									throw new RepositoryExecutionError('test error');
								});

								await expect(userService.deleteUser(testId)).rejects.toThrowError(
									new ServiceOperationError(`test error`)
								);
							});
						});

						describe('when repository.delete() returns 0 affected rows', () => {
							it('throws a service operation error', async () => {
								getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
								findByIdSpy.mockImplementationOnce(() => [testModelWithoutPassword]);
								deleteSpy.mockImplementationOnce(() => ({ affectedRows: 0 }));

								await expect(userService.deleteUser(testId)).rejects.toThrowError(
									new ServiceOperationError(`user deletion failed, no rows affected`)
								);
							});
						});
						describe('when repository.delete() returns a number other than 0 for affected rows', () => {
							describe('when transactionHandler.commit() throws an error', () => {
								it('throws a transaction handling error', async () => {
									getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
									findByIdSpy.mockImplementationOnce(() => [testModelWithoutPassword]);
									deleteSpy.mockImplementationOnce(() => ({ affectedRows: 1 }));
									commitSpy.mockImplementationOnce(() => {
										throw new TransactionHandlingError('test error');
									});

									await expect(userService.deleteUser(testId)).rejects.toThrowError(
										new TransactionHandlingError(`test error`)
									);
								});
							});

							describe('when transactionHandler.commit() succeeds', () => {
								it('returns without any error', async () => {
									getConnectionSpy.mockImplementationOnce(() => ({ connection: true }));
									findByIdSpy.mockImplementationOnce(() => [testModelWithoutPassword]);
									deleteSpy.mockImplementationOnce(() => ({ affectedRows: 1 }));

									await expect(userService.deleteUser(testId)).resolves.not.toThrow();
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
								await expect(userService.deleteUser(testId)).rejects.toThrowError(
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
								await expect(userService.deleteUser(testId)).rejects.toThrowError(
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

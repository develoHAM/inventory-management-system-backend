import { DTO } from 'dtos/DTO';
import {
	createUserDTOSchema,
	idUserDTOSchema,
	readUserDTOSchema,
	responseUserDTOSchema,
	usernameUserDTOSchema,
} from 'dtos/schemas/user.dto.schema';
import { RepositoryExecutionError, TransactionHandlingError } from 'errors/persistence';
import { ServiceExecutionError, ServiceOperationError, ValidationError } from 'errors/services';
import { UserModel } from 'models';
import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { UserRepository } from 'repositories';
import { DatabaseLockMode } from 'types/IDAO';
import { CreateDTO, IdDTO, ReadDTO, ResponseDTO, UpdateDTO } from 'types/IDTO';
import { ITransactionHandler } from 'types/ITransactionHandler';
import { ErrorHandler } from 'utilities/ErrorHandler';
import { HashingUtility } from 'utilities/HashingUtility';

export class UserService {
	readonly #userRepository;
	readonly #transactionHandler;
	readonly #hashingUtility;

	constructor({
		userRepository,
		transactionHandler,
		hashingUtility,
	}: {
		userRepository: UserRepository<ResultSetHeader, PoolConnection>;
		transactionHandler: ITransactionHandler<any>;
		hashingUtility: HashingUtility;
	}) {
		this.#userRepository = userRepository;
		this.#transactionHandler = transactionHandler;
		this.#hashingUtility = hashingUtility;
	}

	async getUserById(id: number, showPassword: boolean = false) {
		try {
			const validatedIdDTO = DTO.from<IdDTO<UserModel>>({ id }, idUserDTOSchema);
			const [user] = await this.#userRepository.findById({ id: validatedIdDTO.id });

			if (user) {
				const validatedUserResponseDTO = DTO.from<ResponseDTO<UserModel>>(user, responseUserDTOSchema);
				const { password, ...validatedUserResponseDTOWithoutPassword } = validatedUserResponseDTO;

				return showPassword ? validatedUserResponseDTO : validatedUserResponseDTOWithoutPassword;
			} else {
				return null;
			}
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: `unexpected unknown exception from getUserById() for id: ${id}`,
			});
		}
	}

	async getUserByUsername(username: string, showPassword: boolean = false) {
		try {
			const validatedUsernameDTO = DTO.from<Pick<UserModel, 'username'>>(
				{ username: username },
				usernameUserDTOSchema
			);
			const [user] = await this.#userRepository.find({ criteria: { username: validatedUsernameDTO.username } });

			if (user) {
				const validatedUserResponseDTO = DTO.from<ResponseDTO<UserModel>>(user, responseUserDTOSchema);
				const { password, ...validatedUserResponseDTOWithoutPassword } = validatedUserResponseDTO;

				return showPassword ? validatedUserResponseDTO : validatedUserResponseDTOWithoutPassword;
			} else {
				return null;
			}
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: `unexpected unknown exception from getUserByUsername() for username: ${username}`,
			});
		}
	}

	async getUsers(criteria?: ReadDTO<UserModel>, showPassword: boolean = false) {
		try {
			let users;
			if (criteria) {
				const validatedReadUserDTO = DTO.from<ReadDTO<UserModel>>(criteria, readUserDTOSchema);
				users = await this.#userRepository.find({ criteria: validatedReadUserDTO });
			} else {
				users = await this.#userRepository.findAll();
			}

			if (users.length > 0) {
				return users.map((user) => {
					const validatedResponseUserDTO = DTO.from<ResponseDTO<UserModel>>(user, responseUserDTOSchema);
					const { password, ...validatedResponseUserDTOWithoutPassword } = validatedResponseUserDTO;
					return showPassword ? validatedResponseUserDTO : validatedResponseUserDTOWithoutPassword;
				});
			} else {
				return [];
			}
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from getUsers()',
			});
		}
	}

	async createUser(newUserData: CreateDTO<UserModel>, showPassword: boolean = false) {
		try {
			const validatedCreateUserDTO = DTO.from<CreateDTO<UserModel>>(newUserData, createUserDTOSchema);

			const validatedCreatedUserDTOWithHash = {
				...validatedCreateUserDTO,
				password: await this.#hashingUtility.generateHash(validatedCreateUserDTO.password),
			};

			const { insertId } = await this.#userRepository.create({ model: validatedCreatedUserDTOWithHash });
			const [newUser] = await this.#userRepository.findById({ id: insertId });
			const validatedResponseUserDTO = DTO.from<ResponseDTO<UserModel>>(newUser, responseUserDTOSchema);
			const { password, ...validatedResponseUserDTOWithoutPassword } = validatedResponseUserDTO;

			return showPassword ? validatedResponseUserDTO : validatedResponseUserDTOWithoutPassword;
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from createUser()',
			});
		}
	}

	async updateUser(id: number, updates: UpdateDTO<UserModel>, showPassword: boolean = false) {
		let connection;
		try {
			const validatedIdDTO = DTO.from<IdDTO<UserModel>>({ id: id }, idUserDTOSchema);
			const validatedUpdateUserDTO = DTO.from<UpdateDTO<UserModel>>(updates, idUserDTOSchema);

			connection = await this.#transactionHandler.getConnection();

			if (!connection) {
				throw new ServiceOperationError(`cannot retrieve database connection`);
			}

			await this.#transactionHandler.begin(connection);

			const [userToUpdate] = await this.#userRepository.findById({
				id: validatedIdDTO.id,
				connection: connection,
				lock: DatabaseLockMode.FOR_UPDATE,
			});

			if (!userToUpdate) {
				throw new ServiceOperationError(`user with id of ${validatedIdDTO.id} not found`);
			}

			const { affectedRows } = await this.#userRepository.update({
				id: validatedIdDTO.id,
				updates: validatedUpdateUserDTO,
				connection: connection,
			});

			if (affectedRows === 0) {
				throw new ServiceOperationError(`user update failed, no rows affected`);
			}

			await this.#transactionHandler.commit(connection);

			const [updatedUser] = await this.#userRepository.findById({
				id: validatedIdDTO.id,
			});

			const validatedResponseUserDTO = DTO.from<ResponseDTO<UserModel>>(updatedUser, responseUserDTOSchema);
			const { password, ...validatedResponseUserDTOWithoutPassword } = validatedResponseUserDTO;

			return showPassword ? validatedResponseUserDTO : validatedResponseUserDTOWithoutPassword;
		} catch (error) {
			if (connection) {
				try {
					await this.#transactionHandler.rollback(connection);
				} catch (rollbackError) {
					if (!(rollbackError instanceof Error)) {
						throw new TransactionHandlingError(
							`rollback failed: ` + JSON.parse(JSON.stringify(rollbackError))
						);
					}
					throw new ServiceExecutionError(`rollback failed: ` + rollbackError.message);
				}
			}

			ErrorHandler.handle({
				error: error,
				errorsToCatch: [
					ValidationError,
					RepositoryExecutionError,
					ServiceOperationError,
					TransactionHandlingError,
				],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from updatedUser()',
			});
		} finally {
			if (connection) {
				this.#transactionHandler.end(connection);
			}
		}
	}

	async deleteUser(id: number) {
		let connection;
		try {
			const validatedIdDTO = DTO.from<IdDTO<UserModel>>({ id: id }, idUserDTOSchema);

			connection = await this.#transactionHandler.getConnection();
			if (!connection) {
				throw new ServiceOperationError(`cannot retrieve database connection`);
			}
			await this.#transactionHandler.begin(connection);

			const [userToDelete] = await this.#userRepository.findById({
				id: validatedIdDTO.id,
				connection: connection,
				lock: DatabaseLockMode.FOR_UPDATE,
			});

			if (!userToDelete) {
				throw new ServiceOperationError(`user with id of ${validatedIdDTO.id} not found`);
			}

			const { affectedRows } = await this.#userRepository.delete({
				id: validatedIdDTO.id,
				connection: connection,
			});

			if (affectedRows === 0) {
				throw new ServiceOperationError(`user deletion failed, no rows affected`);
			}

			await this.#transactionHandler.commit(connection);
		} catch (error) {
			if (connection) {
				try {
					await this.#transactionHandler.rollback(connection);
				} catch (rollbackError) {
					if (!(rollbackError instanceof Error)) {
						throw new TransactionHandlingError(
							`rollback failed: ` + JSON.parse(JSON.stringify(rollbackError))
						);
					}
					throw new ServiceExecutionError('rollback failed: ' + rollbackError.message);
				}
			}

			ErrorHandler.handle({
				error: error,
				errorsToCatch: [
					ValidationError,
					RepositoryExecutionError,
					ServiceExecutionError,
					TransactionHandlingError,
					ServiceOperationError,
				],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from deleteUser()',
			});
		} finally {
			if (connection) {
				this.#transactionHandler.end(connection);
			}
		}
	}
}

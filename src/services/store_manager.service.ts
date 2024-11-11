import { DTO } from 'dtos/DTO';
import {
	createStoreManagerDTOSchema,
	idStoreManagerDTOSchema,
	readStoreManagerDTOSchema,
	responseStoreManagerDTOSchema,
	updateStoreManagerDTOSchema,
} from 'dtos/schemas/store_manager.dto.schema';
import { RepositoryExecutionError, TransactionHandlingError } from 'errors/persistence';
import { ServiceExecutionError, ServiceOperationError, ValidationError } from 'errors/services';
import { StoreManagerModel } from 'models';
import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { StoreManagerRepository } from 'repositories';
import { DatabaseLockMode } from 'types/IDAO';
import { CreateDTO, IdDTO, ReadDTO, ResponseDTO, UpdateDTO } from 'types/IDTO';
import { ITransactionHandler } from 'types/ITransactionHandler';
import { ErrorHandler } from 'utilities/ErrorHandler';

export class StoreManagerService {
	readonly #storeManagerRepository;
	readonly #transactionHandler;

	constructor({
		storeManagerRepository,
		transactionHandler,
	}: {
		storeManagerRepository: StoreManagerRepository<ResultSetHeader, PoolConnection>;
		transactionHandler: ITransactionHandler<any>;
	}) {
		this.#storeManagerRepository = storeManagerRepository;
		this.#transactionHandler = transactionHandler;
	}

	async getStoreManagerById(id: number) {
		try {
			const idStoreManagerDTO = DTO.from<IdDTO<StoreManagerModel>>({ id }, idStoreManagerDTOSchema);

			const [storeManager] = await this.#storeManagerRepository.findById({ id: idStoreManagerDTO.id });

			if (storeManager) {
				return DTO.from<ResponseDTO<StoreManagerModel>>(storeManager, responseStoreManagerDTOSchema);
			} else {
				return null;
			}
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from getStoreManagerById()',
			});
		}
	}

	async getStoreManagers(criteria?: ReadDTO<StoreManagerModel>) {
		try {
			let storeManagers;
			if (criteria) {
				const readStoreManagerDTO = DTO.from<ReadDTO<StoreManagerModel>>(criteria, readStoreManagerDTOSchema);

				storeManagers = await this.#storeManagerRepository.find({ criteria: readStoreManagerDTO });
			} else {
				storeManagers = await this.#storeManagerRepository.findAll();
			}

			if (storeManagers.length > 0) {
				return storeManagers.map((storeManager) =>
					DTO.from<ResponseDTO<StoreManagerModel>>(storeManager, responseStoreManagerDTOSchema)
				);
			} else {
				return [];
			}
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from getStoreManagers():',
			});
		}
	}

	async createStoreManager(newStoreManagerData: CreateDTO<StoreManagerModel>) {
		try {
			const createStoreManagerDTO = DTO.from<CreateDTO<StoreManagerModel>>(
				newStoreManagerData,
				createStoreManagerDTOSchema
			);

			const { insertId } = await this.#storeManagerRepository.create({ model: createStoreManagerDTO });

			const [newStoreManager] = await this.#storeManagerRepository.findById({ id: insertId });

			return DTO.from<ResponseDTO<StoreManagerModel>>(newStoreManager, responseStoreManagerDTOSchema);
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError, ServiceOperationError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from createStoreManager()',
			});
		}
	}

	async updateStoreManager(id: number, updates: UpdateDTO<StoreManagerModel>) {
		let connection;
		try {
			const idStoreManagerDTO = DTO.from<IdDTO<StoreManagerModel>>({ id: id }, idStoreManagerDTOSchema);
			const updateStoreManagerDTO = DTO.from<UpdateDTO<StoreManagerModel>>(updates, updateStoreManagerDTOSchema);

			connection = await this.#transactionHandler.getConnection();

			if (!connection) {
				throw new ServiceOperationError(`cannot retrieve database connection`);
			}

			await this.#transactionHandler.begin(connection);

			const [storeManagerToUpdate] = await this.#storeManagerRepository.findById({
				id: idStoreManagerDTO.id,
				connection: connection,
				lock: DatabaseLockMode.FOR_UPDATE,
			});

			if (!storeManagerToUpdate) {
				throw new ServiceOperationError(`storeManager with id of ${idStoreManagerDTO.id} not found`);
			}

			const { affectedRows } = await this.#storeManagerRepository.update({
				id: storeManagerToUpdate.id,
				updates: updateStoreManagerDTO,
				connection: connection,
			});

			if (affectedRows === 0) {
				throw new ServiceOperationError(`storeManager update failed, no rows affected`);
			}

			await this.#transactionHandler.commit(connection);

			const [updatedStoreManager] = await this.#storeManagerRepository.findById({ id: idStoreManagerDTO.id });

			return DTO.from<ResponseDTO<StoreManagerModel>>(updatedStoreManager, responseStoreManagerDTOSchema);
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
					TransactionHandlingError,
					ServiceOperationError,
				],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from updateStoreManager()',
			});
		} finally {
			if (connection) {
				this.#transactionHandler.end(connection);
			}
		}
	}

	async deleteStoreManager(id: number) {
		let connection;
		try {
			const idStoreManagerDTO = DTO.from<IdDTO<StoreManagerModel>>({ id }, idStoreManagerDTOSchema);

			connection = await this.#transactionHandler.getConnection();

			if (!connection) {
				throw new ServiceOperationError(`cannot retrieve database connection`);
			}

			await this.#transactionHandler.begin(connection);

			const [storeManagerToDelete] = await this.#storeManagerRepository.findById({
				id: idStoreManagerDTO.id,
				connection: connection,
				lock: DatabaseLockMode.FOR_UPDATE,
			});

			if (!storeManagerToDelete) {
				throw new ServiceOperationError(`storeManager with id of ${idStoreManagerDTO.id} not found`);
			}

			const { affectedRows } = await this.#storeManagerRepository.delete({
				id: idStoreManagerDTO.id,
				connection: connection,
			});

			if (affectedRows === 0) {
				throw new ServiceOperationError(`storeManager deletion failed, no rows affected`);
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
				errorMessagePrefix: 'unexpected unknown exception from deleteStoreManager()',
			});
		} finally {
			if (connection) {
				this.#transactionHandler.end(connection);
			}
		}
	}
}

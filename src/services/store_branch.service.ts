import { DTO } from 'dtos/DTO';
import {
	createStoreBranchDTOSchema,
	idStoreBranchDTOSchema,
	readStoreBranchDTOSchema,
	responseStoreBranchDTOSchema,
	updateStoreBranchDTOSchema,
} from 'dtos/schemas/store_branch.dto.schema';
import { RepositoryExecutionError, TransactionHandlingError } from 'errors/persistence';
import { ServiceExecutionError, ServiceOperationError, ValidationError } from 'errors/services';
import { StoreBranchModel } from 'models';
import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { StoreBranchRepository } from 'repositories';
import { DatabaseLockMode } from 'types/IDAO';
import { CreateDTO, IdDTO, ReadDTO, ResponseDTO, UpdateDTO } from 'types/IDTO';
import { ITransactionHandler } from 'types/ITransactionHandler';
import { ErrorHandler } from 'utilities/ErrorHandler';

export class StoreBranchService {
	readonly #storeBranchRepository;
	readonly #transactionHandler;

	constructor({
		storeBranchRepository,
		transactionHandler,
	}: {
		storeBranchRepository: StoreBranchRepository<ResultSetHeader, PoolConnection>;
		transactionHandler: ITransactionHandler<any>;
	}) {
		this.#storeBranchRepository = storeBranchRepository;
		this.#transactionHandler = transactionHandler;
	}

	async getStoreBranchById(id: number) {
		try {
			const idStoreBranchDTO = DTO.from<IdDTO<StoreBranchModel>>({ id }, idStoreBranchDTOSchema);

			const [storeBranch] = await this.#storeBranchRepository.findById({ id: idStoreBranchDTO.id });

			if (storeBranch) {
				return DTO.from<ResponseDTO<StoreBranchModel>>(storeBranch, responseStoreBranchDTOSchema);
			} else {
				return null;
			}
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from getStoreBranchById()',
			});
		}
	}

	async getStoreBranches(criteria?: ReadDTO<StoreBranchModel>) {
		try {
			let storeBranches;
			if (criteria) {
				const readStoreBranchDTO = DTO.from<ReadDTO<StoreBranchModel>>(criteria, readStoreBranchDTOSchema);

				storeBranches = await this.#storeBranchRepository.find({ criteria: readStoreBranchDTO });
			} else {
				storeBranches = await this.#storeBranchRepository.findAll();
			}

			if (storeBranches.length > 0) {
				return storeBranches.map((storeBranch) =>
					DTO.from<ResponseDTO<StoreBranchModel>>(storeBranch, responseStoreBranchDTOSchema)
				);
			} else {
				return [];
			}
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from getStoreBranches()',
			});
		}
	}

	async createStoreBranch(newStoreBranchData: CreateDTO<StoreBranchModel>) {
		try {
			const createStoreBranchDTO = DTO.from<CreateDTO<StoreBranchModel>>(
				newStoreBranchData,
				createStoreBranchDTOSchema
			);

			const { insertId } = await this.#storeBranchRepository.create({ model: createStoreBranchDTO });

			const [newStoreBranch] = await this.#storeBranchRepository.findById({ id: insertId });

			return DTO.from<ResponseDTO<StoreBranchModel>>(newStoreBranch, responseStoreBranchDTOSchema);
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError, ServiceOperationError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from createStoreBranch()',
			});
		}
	}

	async updateStoreBranch(id: number, updates: UpdateDTO<StoreBranchModel>) {
		let connection;
		try {
			const idStoreBranchDTO = DTO.from<IdDTO<StoreBranchModel>>({ id: id }, idStoreBranchDTOSchema);
			const updateStoreBranchDTO = DTO.from<UpdateDTO<StoreBranchModel>>(updates, updateStoreBranchDTOSchema);

			connection = await this.#transactionHandler.getConnection();

			if (!connection) {
				throw new ServiceOperationError(`cannot retrieve database connection`);
			}

			await this.#transactionHandler.begin(connection);

			const [storeBranchToUpdate] = await this.#storeBranchRepository.findById({
				id: idStoreBranchDTO.id,
				connection: connection,
				lock: DatabaseLockMode.FOR_UPDATE,
			});

			if (!storeBranchToUpdate) {
				throw new ServiceOperationError(`storeBranch with id of ${idStoreBranchDTO.id} not found`);
			}

			const { affectedRows } = await this.#storeBranchRepository.update({
				id: storeBranchToUpdate.id,
				updates: updateStoreBranchDTO,
				connection: connection,
			});

			if (affectedRows === 0) {
				throw new ServiceOperationError(`storeBranch update failed, no rows affected`);
			}

			await this.#transactionHandler.commit(connection);

			const [updatedStoreBranch] = await this.#storeBranchRepository.findById({ id: idStoreBranchDTO.id });

			return DTO.from<ResponseDTO<StoreBranchModel>>(updatedStoreBranch, responseStoreBranchDTOSchema);
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
				errorMessagePrefix: 'unexpected unknown exception from updateStoreBranch()',
			});
		} finally {
			if (connection) {
				this.#transactionHandler.end(connection);
			}
		}
	}

	async deleteStoreBranch(id: number) {
		let connection;
		try {
			const idStoreBranchDTO = DTO.from<IdDTO<StoreBranchModel>>({ id }, idStoreBranchDTOSchema);

			connection = await this.#transactionHandler.getConnection();

			if (!connection) {
				throw new ServiceOperationError(`cannot retrieve database connection`);
			}

			await this.#transactionHandler.begin(connection);

			const [storeBranchToDelete] = await this.#storeBranchRepository.findById({
				id: idStoreBranchDTO.id,
				connection: connection,
				lock: DatabaseLockMode.FOR_UPDATE,
			});

			if (!storeBranchToDelete) {
				throw new ServiceOperationError(`storeBranch with id of ${idStoreBranchDTO.id} not found`);
			}

			const { affectedRows } = await this.#storeBranchRepository.delete({
				id: idStoreBranchDTO.id,
				connection: connection,
			});

			if (affectedRows === 0) {
				throw new ServiceOperationError(`storeBranch deletion failed, no rows affected`);
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
				errorMessagePrefix: 'unexpected unknown exception from deleteStoreBranch()',
			});
		} finally {
			if (connection) {
				this.#transactionHandler.end(connection);
			}
		}
	}
}

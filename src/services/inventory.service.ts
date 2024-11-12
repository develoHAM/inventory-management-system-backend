import { DTO } from 'dtos/DTO';
import {
	createInventoryDTOSchema,
	idInventoryDTOSchema,
	readInventoryDTOSchema,
	responseInventoryDTOSchema,
	updateInventoryDTOSchema,
} from 'dtos/schemas/inventory.dto.schema';
import { RepositoryExecutionError, TransactionHandlingError } from 'errors/persistence';
import { ServiceExecutionError, ServiceOperationError, ValidationError } from 'errors/services';
import { InventoryModel } from 'models';
import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { InventoryRepository } from 'repositories';
import { DatabaseLockMode } from 'types/IDAO';
import { CreateDTO, IdDTO, ReadDTO, ResponseDTO, UpdateDTO } from 'types/IDTO';
import { ITransactionHandler } from 'types/ITransactionHandler';
import { ErrorHandler } from 'utilities/ErrorHandler';

export class InventoryService {
	readonly #inventoryRepository;
	readonly #transactionHandler;

	constructor({
		inventoryRepository,
		transactionHandler,
	}: {
		inventoryRepository: InventoryRepository<ResultSetHeader, PoolConnection>;
		transactionHandler: ITransactionHandler<any>;
	}) {
		this.#inventoryRepository = inventoryRepository;
		this.#transactionHandler = transactionHandler;
	}

	async getInventoryById(id: number) {
		try {
			const idInventoryDTO = DTO.from<IdDTO<InventoryModel>>({ id }, idInventoryDTOSchema);

			const [inventory] = await this.#inventoryRepository.findById({
				id: idInventoryDTO.id,
			});

			if (inventory) {
				return DTO.from<ResponseDTO<InventoryModel>>(inventory, responseInventoryDTOSchema);
			} else {
				return null;
			}
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from getInventoryById()',
			});
		}
	}

	async getInventories(criteria?: ReadDTO<InventoryModel>) {
		try {
			let inventorys;
			if (criteria) {
				const readInventoryDTO = DTO.from<ReadDTO<InventoryModel>>(criteria, readInventoryDTOSchema);

				inventorys = await this.#inventoryRepository.find({ criteria: readInventoryDTO });
			} else {
				inventorys = await this.#inventoryRepository.findAll();
			}

			if (inventorys.length > 0) {
				return inventorys.map((inventory) =>
					DTO.from<ResponseDTO<InventoryModel>>(inventory, responseInventoryDTOSchema)
				);
			} else {
				return [];
			}
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from getInventories()',
			});
		}
	}

	async createInventory(newInventoryData: CreateDTO<InventoryModel>) {
		try {
			const createInventoryDTO = DTO.from<CreateDTO<InventoryModel>>(newInventoryData, createInventoryDTOSchema);

			const { insertId } = await this.#inventoryRepository.create({ model: createInventoryDTO });

			const [newInventory] = await this.#inventoryRepository.findById({ id: insertId });

			return DTO.from<ResponseDTO<InventoryModel>>(newInventory, responseInventoryDTOSchema);
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError, ServiceOperationError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from createInventory()',
			});
		}
	}

	async updateInventory(id: number, updates: UpdateDTO<InventoryModel>) {
		let connection;
		try {
			const idInventoryDTO = DTO.from<IdDTO<InventoryModel>>({ id: id }, idInventoryDTOSchema);
			const updateInventoryDTO = DTO.from<UpdateDTO<InventoryModel>>(updates, updateInventoryDTOSchema);

			connection = await this.#transactionHandler.getConnection();
			if (!connection) {
				throw new ServiceOperationError(`cannot retrieve database connection`);
			}
			await this.#transactionHandler.begin(connection);

			const [inventoryToUpdate] = await this.#inventoryRepository.findById({
				id: idInventoryDTO.id,
				connection: connection,
				lock: DatabaseLockMode.FOR_UPDATE,
			});

			if (!inventoryToUpdate) {
				throw new ServiceOperationError(`inventory with id of ${idInventoryDTO.id} not found`);
			}

			const { affectedRows } = await this.#inventoryRepository.update({
				id: inventoryToUpdate.id,
				updates: updateInventoryDTO,
				connection: connection,
			});

			if (affectedRows === 0) {
				throw new ServiceOperationError(`inventory update failed, no rows affected`);
			}

			await this.#transactionHandler.commit(connection);

			const [updatedInventory] = await this.#inventoryRepository.findById({
				id: idInventoryDTO.id,
			});

			return DTO.from<ResponseDTO<InventoryModel>>(updatedInventory, responseInventoryDTOSchema);
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
				errorMessagePrefix: 'unexpected unknown exception from updateInventory()',
			});
		} finally {
			if (connection) {
				this.#transactionHandler.end(connection);
			}
		}
	}

	async deleteInventory(id: number) {
		let connection;
		try {
			const idInventoryDTO = DTO.from<IdDTO<InventoryModel>>({ id }, idInventoryDTOSchema);

			connection = await this.#transactionHandler.getConnection();
			if (!connection) {
				throw new ServiceOperationError(`cannot retrieve database connection`);
			}
			await this.#transactionHandler.begin(connection);

			const [inventoryToDelete] = await this.#inventoryRepository.findById({
				id: idInventoryDTO.id,
				connection: connection,
				lock: DatabaseLockMode.FOR_UPDATE,
			});

			if (!inventoryToDelete) {
				throw new ServiceOperationError(`inventory with id of ${idInventoryDTO.id} not found`);
			}

			const { affectedRows } = await this.#inventoryRepository.delete({
				id: idInventoryDTO.id,
				connection: connection,
			});

			if (affectedRows === 0) {
				throw new ServiceOperationError(`inventory deletion failed, no rows affected`);
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
				errorMessagePrefix: 'unexpected unknown exception from deleteInventory()',
			});
		} finally {
			if (connection) {
				this.#transactionHandler.end(connection);
			}
		}
	}
}

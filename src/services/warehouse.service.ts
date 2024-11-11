import { DTO } from 'dtos/DTO';
import {
	createWarehouseDTOSchema,
	idWarehouseDTOSchema,
	readWarehouseDTOSchema,
	responseWarehouseDTOSchema,
	updateWarehouseDTOSchema,
} from 'dtos/schemas/warehouse.dto.schema';
import { RepositoryExecutionError, TransactionHandlingError } from 'errors/persistence';
import { ServiceExecutionError, ServiceOperationError, ValidationError } from 'errors/services';
import { WarehouseModel } from 'models';
import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { WarehouseRepository } from 'repositories';
import { DatabaseLockMode } from 'types/IDAO';
import { CreateDTO, IdDTO, ReadDTO, ResponseDTO, UpdateDTO } from 'types/IDTO';
import { ITransactionHandler } from 'types/ITransactionHandler';
import { ErrorHandler } from 'utilities/ErrorHandler';

export class WarehouseService {
	readonly #warehouseRepository;
	readonly #transactionHandler;

	constructor({
		warehouseRepository,
		transactionHandler,
	}: {
		warehouseRepository: WarehouseRepository<ResultSetHeader, PoolConnection>;
		transactionHandler: ITransactionHandler<any>;
	}) {
		this.#warehouseRepository = warehouseRepository;
		this.#transactionHandler = transactionHandler;
	}

	async getWarehouseById(id: number) {
		try {
			const idWarehouseDTO = DTO.from<IdDTO<WarehouseModel>>({ id }, idWarehouseDTOSchema);

			const [warehouse] = await this.#warehouseRepository.findById({ id: idWarehouseDTO.id });

			if (warehouse) {
				return DTO.from<ResponseDTO<WarehouseModel>>(warehouse, responseWarehouseDTOSchema);
			} else {
				return null;
			}
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from getWarehouseById()',
			});
		}
	}

	async getWarehouses(criteria?: ReadDTO<WarehouseModel>) {
		try {
			let warehouses;
			if (criteria) {
				const readWarehouseDTO = DTO.from<ReadDTO<WarehouseModel>>(criteria, readWarehouseDTOSchema);

				warehouses = await this.#warehouseRepository.find({ criteria: readWarehouseDTO });
			} else {
				warehouses = await this.#warehouseRepository.findAll();
			}

			if (warehouses.length > 0) {
				return warehouses.map((warehouse) =>
					DTO.from<ResponseDTO<WarehouseModel>>(warehouse, responseWarehouseDTOSchema)
				);
			} else {
				return [];
			}
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from getWarehouses()',
			});
		}
	}

	async createWarehouse(newWarehouseData: CreateDTO<WarehouseModel>) {
		try {
			const createWarehouseDTO = DTO.from<CreateDTO<WarehouseModel>>(newWarehouseData, createWarehouseDTOSchema);

			const { insertId } = await this.#warehouseRepository.create({ model: createWarehouseDTO });

			const [newWarehouse] = await this.#warehouseRepository.findById({ id: insertId });

			return DTO.from<ResponseDTO<WarehouseModel>>(newWarehouse, responseWarehouseDTOSchema);
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError, ServiceOperationError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from createWarehouse()',
			});
		}
	}

	async updateWarehouse(id: number, updates: UpdateDTO<WarehouseModel>) {
		let connection;
		try {
			const idWarehouseDTO = DTO.from<IdDTO<WarehouseModel>>({ id: id }, idWarehouseDTOSchema);
			const updateWarehouseDTO = DTO.from<UpdateDTO<WarehouseModel>>(updates, updateWarehouseDTOSchema);

			connection = await this.#transactionHandler.getConnection();

			if (!connection) {
				throw new ServiceOperationError(`cannot retrieve database connection`);
			}

			await this.#transactionHandler.begin(connection);

			const [warehouseToUpdate] = await this.#warehouseRepository.findById({
				id: idWarehouseDTO.id,
				connection: connection,
				lock: DatabaseLockMode.FOR_UPDATE,
			});

			if (!warehouseToUpdate) {
				throw new ServiceOperationError(`warehouse with id of ${idWarehouseDTO.id} not found`);
			}

			const { affectedRows } = await this.#warehouseRepository.update({
				id: warehouseToUpdate.id,
				updates: updateWarehouseDTO,
				connection: connection,
			});

			if (affectedRows === 0) {
				throw new ServiceOperationError(`warehouse update failed, no rows affected`);
			}

			await this.#transactionHandler.commit(connection);

			const [updatedWarehouse] = await this.#warehouseRepository.findById({ id: idWarehouseDTO.id });

			return DTO.from<ResponseDTO<WarehouseModel>>(updatedWarehouse, responseWarehouseDTOSchema);
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
				errorMessagePrefix: 'unexpected unknown exception from updateWarehouse()',
			});
		} finally {
			if (connection) {
				this.#transactionHandler.end(connection);
			}
		}
	}

	async deleteWarehouse(id: number) {
		let connection;
		try {
			const idWarehouseDTO = DTO.from<IdDTO<WarehouseModel>>({ id }, idWarehouseDTOSchema);

			connection = await this.#transactionHandler.getConnection();

			if (!connection) {
				throw new ServiceOperationError(`cannot retrieve database connection`);
			}

			await this.#transactionHandler.begin(connection);

			const [warehouseToDelete] = await this.#warehouseRepository.findById({
				id: idWarehouseDTO.id,
				connection: connection,
				lock: DatabaseLockMode.FOR_UPDATE,
			});

			if (!warehouseToDelete) {
				throw new ServiceOperationError(`warehouse with id of ${idWarehouseDTO.id} not found`);
			}

			const { affectedRows } = await this.#warehouseRepository.delete({
				id: idWarehouseDTO.id,
				connection: connection,
			});

			if (affectedRows === 0) {
				throw new ServiceOperationError(`warehouse deletion failed, no rows affected`);
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
				errorMessagePrefix: 'unexpected unknown exception from deleteWarehouse()',
			});
		} finally {
			if (connection) {
				this.#transactionHandler.end(connection);
			}
		}
	}
}

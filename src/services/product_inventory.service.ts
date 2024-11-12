import { DTO } from 'dtos/DTO';
import {
	createProductInventoryDTOSchema,
	idProductInventoryDTOSchema,
	readProductInventoryDTOSchema,
	responseProductInventoryDTOSchema,
	updateProductInventoryDTOSchema,
} from 'dtos/schemas/product_inventory.dto.schema';
import { RepositoryExecutionError, TransactionHandlingError } from 'errors/persistence';
import { ServiceExecutionError, ServiceOperationError, ValidationError } from 'errors/services';
import { ProductInventoryModel } from 'models';
import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { ProductInventoryRepository } from 'repositories';
import { DatabaseLockMode } from 'types/IDAO';
import { CreateDTO, IdDTO, ReadDTO, ResponseDTO, UpdateDTO } from 'types/IDTO';
import { ITransactionHandler } from 'types/ITransactionHandler';
import { ErrorHandler } from 'utilities/ErrorHandler';

export class ProductInventoryService {
	readonly #productInventoryRepository;
	readonly #transactionHandler;

	constructor({
		productInventoryRepository,
		transactionHandler,
	}: {
		productInventoryRepository: ProductInventoryRepository<ResultSetHeader, PoolConnection>;
		transactionHandler: ITransactionHandler<any>;
	}) {
		this.#productInventoryRepository = productInventoryRepository;
		this.#transactionHandler = transactionHandler;
	}

	async getProductInventoryById(id: number) {
		try {
			const idProductInventoryDTO = DTO.from<IdDTO<ProductInventoryModel>>({ id }, idProductInventoryDTOSchema);

			const [productInventory] = await this.#productInventoryRepository.findById({
				id: idProductInventoryDTO.id,
			});

			if (productInventory) {
				return DTO.from<ResponseDTO<ProductInventoryModel>>(
					productInventory,
					responseProductInventoryDTOSchema
				);
			} else {
				return null;
			}
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from getProductInventoryById()',
			});
		}
	}

	async getProductInventories(criteria?: ReadDTO<ProductInventoryModel>) {
		try {
			let productInventories;
			if (criteria) {
				const readProductInventoryDTO = DTO.from<ReadDTO<ProductInventoryModel>>(
					criteria,
					readProductInventoryDTOSchema
				);

				productInventories = await this.#productInventoryRepository.find({ criteria: readProductInventoryDTO });
			} else {
				productInventories = await this.#productInventoryRepository.findAll();
			}

			if (productInventories.length > 0) {
				return productInventories.map((productInventory) =>
					DTO.from<ResponseDTO<ProductInventoryModel>>(productInventory, responseProductInventoryDTOSchema)
				);
			} else {
				return [];
			}
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from getProductInventories()',
			});
		}
	}

	async createProductInventory(newProductInventoryData: CreateDTO<ProductInventoryModel>) {
		try {
			const createProductInventoryDTO = DTO.from<CreateDTO<ProductInventoryModel>>(
				newProductInventoryData,
				createProductInventoryDTOSchema
			);

			const { insertId } = await this.#productInventoryRepository.create({ model: createProductInventoryDTO });

			const [newProductInventory] = await this.#productInventoryRepository.findById({ id: insertId });

			return DTO.from<ResponseDTO<ProductInventoryModel>>(newProductInventory, responseProductInventoryDTOSchema);
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError, ServiceOperationError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from createProductInventory()',
			});
		}
	}

	async updateProductInventory(id: number, updates: UpdateDTO<ProductInventoryModel>) {
		let connection;
		try {
			const idProductInventoryDTO = DTO.from<IdDTO<ProductInventoryModel>>(
				{ id: id },
				idProductInventoryDTOSchema
			);
			const updateProductInventoryDTO = DTO.from<UpdateDTO<ProductInventoryModel>>(
				updates,
				updateProductInventoryDTOSchema
			);

			connection = await this.#transactionHandler.getConnection();
			if (!connection) {
				throw new ServiceOperationError(`cannot retrieve database connection`);
			}
			await this.#transactionHandler.begin(connection);

			const [productInventoryToUpdate] = await this.#productInventoryRepository.findById({
				id: idProductInventoryDTO.id,
				connection: connection,
				lock: DatabaseLockMode.FOR_UPDATE,
			});

			if (!productInventoryToUpdate) {
				throw new ServiceOperationError(`productInventory with id of ${idProductInventoryDTO.id} not found`);
			}

			const { affectedRows } = await this.#productInventoryRepository.update({
				id: productInventoryToUpdate.id,
				updates: updateProductInventoryDTO,
				connection: connection,
			});

			if (affectedRows === 0) {
				throw new ServiceOperationError(`productInventory update failed, no rows affected`);
			}

			await this.#transactionHandler.commit(connection);

			const [updatedProductInventory] = await this.#productInventoryRepository.findById({
				id: idProductInventoryDTO.id,
			});

			return DTO.from<ResponseDTO<ProductInventoryModel>>(
				updatedProductInventory,
				responseProductInventoryDTOSchema
			);
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
				errorMessagePrefix: 'unexpected unknown exception from updateProductInventory()',
			});
		} finally {
			if (connection) {
				this.#transactionHandler.end(connection);
			}
		}
	}

	async deleteProductInventory(id: number) {
		let connection;
		try {
			const idProductInventoryDTO = DTO.from<IdDTO<ProductInventoryModel>>({ id }, idProductInventoryDTOSchema);

			connection = await this.#transactionHandler.getConnection();
			if (!connection) {
				throw new ServiceOperationError(`cannot retrieve database connection`);
			}
			await this.#transactionHandler.begin(connection);

			const [productInventoryToDelete] = await this.#productInventoryRepository.findById({
				id: idProductInventoryDTO.id,
				connection: connection,
				lock: DatabaseLockMode.FOR_UPDATE,
			});

			if (!productInventoryToDelete) {
				throw new ServiceOperationError(`productInventory with id of ${idProductInventoryDTO.id} not found`);
			}

			const { affectedRows } = await this.#productInventoryRepository.delete({
				id: idProductInventoryDTO.id,
				connection: connection,
			});

			if (affectedRows === 0) {
				throw new ServiceOperationError(`productInventory deletion failed, no rows affected`);
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
				errorMessagePrefix: 'unexpected unknown exception from deleteProductInventory()',
			});
		} finally {
			if (connection) {
				this.#transactionHandler.end(connection);
			}
		}
	}
}

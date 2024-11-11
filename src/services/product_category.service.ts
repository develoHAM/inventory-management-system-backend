import { DTO } from 'dtos/DTO';
import {
	createProductCategoryDTOSchema,
	idProductCategoryDTOSchema,
	readProductCategoryDTOSchema,
	responseProductCategoryDTOSchema,
	updateProductCategoryDTOSchema,
} from 'dtos/schemas/product_category.dto.schema';
import { RepositoryExecutionError, TransactionHandlingError } from 'errors/persistence';
import { ServiceExecutionError, ServiceOperationError, ValidationError } from 'errors/services';
import { ProductCategoryModel } from 'models';
import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { ProductCategoryRepository } from 'repositories';
import { DatabaseLockMode } from 'types/IDAO';
import { CreateDTO, IdDTO, ReadDTO, ResponseDTO, UpdateDTO } from 'types/IDTO';
import { ITransactionHandler } from 'types/ITransactionHandler';
import { ErrorHandler } from 'utilities/ErrorHandler';

export class ProductCategoryService {
	readonly #productCategoryRepository;
	readonly #transactionHandler;

	constructor({
		productCategoryRepository,
		transactionHandler,
	}: {
		productCategoryRepository: ProductCategoryRepository<ResultSetHeader, PoolConnection>;
		transactionHandler: ITransactionHandler<any>;
	}) {
		this.#productCategoryRepository = productCategoryRepository;
		this.#transactionHandler = transactionHandler;
	}

	async getProductCategoryById(id: number) {
		try {
			const idProductCategoryDTO = DTO.from<IdDTO<ProductCategoryModel>>({ id }, idProductCategoryDTOSchema);

			const [productCategory] = await this.#productCategoryRepository.findById({
				id: idProductCategoryDTO.id,
			});

			if (productCategory) {
				return DTO.from<ResponseDTO<ProductCategoryModel>>(productCategory, responseProductCategoryDTOSchema);
			} else {
				return null;
			}
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from getProductCategoryById()',
			});
		}
	}

	async getProductCategories(criteria?: ReadDTO<ProductCategoryModel>) {
		try {
			let productCategories;
			if (criteria) {
				const readProductCategoryDTO = DTO.from<ReadDTO<ProductCategoryModel>>(
					criteria,
					readProductCategoryDTOSchema
				);

				productCategories = await this.#productCategoryRepository.find({ criteria: readProductCategoryDTO });
			} else {
				productCategories = await this.#productCategoryRepository.findAll();
			}

			if (productCategories.length > 0) {
				return productCategories.map((productCategory) =>
					DTO.from<ResponseDTO<ProductCategoryModel>>(productCategory, responseProductCategoryDTOSchema)
				);
			} else {
				return [];
			}
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from getProductCategories()',
			});
		}
	}

	async createProductCategory(newProductCategoryData: CreateDTO<ProductCategoryModel>) {
		try {
			const createProductCategoryDTO = DTO.from<CreateDTO<ProductCategoryModel>>(
				newProductCategoryData,
				createProductCategoryDTOSchema
			);

			const { insertId } = await this.#productCategoryRepository.create({ model: createProductCategoryDTO });

			const [newProductCategory] = await this.#productCategoryRepository.findById({ id: insertId });

			return DTO.from<ResponseDTO<ProductCategoryModel>>(newProductCategory, responseProductCategoryDTOSchema);
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError, ServiceOperationError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from createProductCategory()',
			});
		}
	}

	async updateProductCategory(id: number, updates: UpdateDTO<ProductCategoryModel>) {
		let connection;
		try {
			const idProductCategoryDTO = DTO.from<IdDTO<ProductCategoryModel>>({ id: id }, idProductCategoryDTOSchema);
			const updateProductCategoryDTO = DTO.from<UpdateDTO<ProductCategoryModel>>(
				updates,
				updateProductCategoryDTOSchema
			);

			connection = await this.#transactionHandler.getConnection();
			if (!connection) {
				throw new ServiceOperationError(`cannot retrieve database connection`);
			}
			await this.#transactionHandler.begin(connection);

			const [productCategoryToUpdate] = await this.#productCategoryRepository.findById({
				id: idProductCategoryDTO.id,
				connection: connection,
				lock: DatabaseLockMode.FOR_UPDATE,
			});

			if (!productCategoryToUpdate) {
				throw new ServiceOperationError(`productCategory with id of ${idProductCategoryDTO.id} not found`);
			}

			const { affectedRows } = await this.#productCategoryRepository.update({
				id: productCategoryToUpdate.id,
				updates: updateProductCategoryDTO,
				connection: connection,
			});

			if (affectedRows === 0) {
				throw new ServiceOperationError(`productCategory update failed, no rows affected`);
			}

			await this.#transactionHandler.commit(connection);

			const [updatedProductCategory] = await this.#productCategoryRepository.findById({
				id: idProductCategoryDTO.id,
			});

			return DTO.from<ResponseDTO<ProductCategoryModel>>(
				updatedProductCategory,
				responseProductCategoryDTOSchema
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
				errorMessagePrefix: 'unexpected unknown exception from updateProductCategory()',
			});
		} finally {
			if (connection) {
				this.#transactionHandler.end(connection);
			}
		}
	}

	async deleteProductCategory(id: number) {
		let connection;
		try {
			const idProductCategoryDTO = DTO.from<IdDTO<ProductCategoryModel>>({ id }, idProductCategoryDTOSchema);

			connection = await this.#transactionHandler.getConnection();
			if (!connection) {
				throw new ServiceOperationError(`cannot retrieve database connection`);
			}
			await this.#transactionHandler.begin(connection);

			const [productCategoryToDelete] = await this.#productCategoryRepository.findById({
				id: idProductCategoryDTO.id,
				connection: connection,
				lock: DatabaseLockMode.FOR_UPDATE,
			});

			if (!productCategoryToDelete) {
				throw new ServiceOperationError(`productCategory with id of ${idProductCategoryDTO.id} not found`);
			}

			const { affectedRows } = await this.#productCategoryRepository.delete({
				id: idProductCategoryDTO.id,
				connection: connection,
			});

			if (affectedRows === 0) {
				throw new ServiceOperationError(`productCategory deletion failed, no rows affected`);
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
				errorMessagePrefix: 'unexpected unknown exception from deleteProductCategory()',
			});
		} finally {
			if (connection) {
				this.#transactionHandler.end(connection);
			}
		}
	}
}

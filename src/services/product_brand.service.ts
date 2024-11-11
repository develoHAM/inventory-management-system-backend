import { DTO } from 'dtos/DTO';
import {
	createProductBrandDTOSchema,
	idProductBrandDTOSchema,
	readProductBrandDTOSchema,
	responseProductBrandDTOSchema,
	updateProductBrandDTOSchema,
} from 'dtos/schemas/product_brand.dto.schema';
import { RepositoryExecutionError, TransactionHandlingError } from 'errors/persistence';
import { ServiceExecutionError, ServiceOperationError, ValidationError } from 'errors/services';
import { ProductBrandModel } from 'models';
import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { ProductBrandRepository } from 'repositories';
import { DatabaseLockMode } from 'types/IDAO';
import { CreateDTO, IdDTO, ReadDTO, ResponseDTO, UpdateDTO } from 'types/IDTO';
import { ITransactionHandler } from 'types/ITransactionHandler';
import { ErrorHandler } from 'utilities/ErrorHandler';

export class ProductBrandService {
	readonly #productBrandRepository;
	readonly #transactionHandler;

	constructor({
		productBrandRepository,
		transactionHandler,
	}: {
		productBrandRepository: ProductBrandRepository<ResultSetHeader, PoolConnection>;
		transactionHandler: ITransactionHandler<any>;
	}) {
		this.#productBrandRepository = productBrandRepository;
		this.#transactionHandler = transactionHandler;
	}

	async getProductBrandById(id: number) {
		try {
			const idProductBrandDTO = DTO.from<IdDTO<ProductBrandModel>>({ id }, idProductBrandDTOSchema);

			const [productBrand] = await this.#productBrandRepository.findById({
				id: idProductBrandDTO.id,
			});

			if (productBrand) {
				return DTO.from<ResponseDTO<ProductBrandModel>>(productBrand, responseProductBrandDTOSchema);
			} else {
				return null;
			}
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from getProductBrandById()',
			});
		}
	}

	async getProductBrands(criteria?: ReadDTO<ProductBrandModel>) {
		try {
			let productBrands;
			if (criteria) {
				const readProductBrandDTO = DTO.from<ReadDTO<ProductBrandModel>>(criteria, readProductBrandDTOSchema);

				productBrands = await this.#productBrandRepository.find({ criteria: readProductBrandDTO });
			} else {
				productBrands = await this.#productBrandRepository.findAll();
			}

			if (productBrands.length > 0) {
				return productBrands.map((productBrand) =>
					DTO.from<ResponseDTO<ProductBrandModel>>(productBrand, responseProductBrandDTOSchema)
				);
			} else {
				return [];
			}
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from getProductBrands()',
			});
		}
	}

	async createProductBrand(newProductBrandData: CreateDTO<ProductBrandModel>) {
		try {
			const createProductBrandDTO = DTO.from<CreateDTO<ProductBrandModel>>(
				newProductBrandData,
				createProductBrandDTOSchema
			);

			const { insertId } = await this.#productBrandRepository.create({ model: createProductBrandDTO });

			const [newProductBrand] = await this.#productBrandRepository.findById({ id: insertId });

			return DTO.from<ResponseDTO<ProductBrandModel>>(newProductBrand, responseProductBrandDTOSchema);
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError, ServiceOperationError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from createProductBrand()',
			});
		}
	}

	async updateProductBrand(id: number, updates: UpdateDTO<ProductBrandModel>) {
		let connection;
		try {
			const idProductBrandDTO = DTO.from<IdDTO<ProductBrandModel>>({ id: id }, idProductBrandDTOSchema);
			const updateProductBrandDTO = DTO.from<UpdateDTO<ProductBrandModel>>(updates, updateProductBrandDTOSchema);

			connection = await this.#transactionHandler.getConnection();
			if (!connection) {
				throw new ServiceOperationError(`cannot retrieve database connection`);
			}
			await this.#transactionHandler.begin(connection);

			const [productBrandToUpdate] = await this.#productBrandRepository.findById({
				id: idProductBrandDTO.id,
				connection: connection,
				lock: DatabaseLockMode.FOR_UPDATE,
			});

			if (!productBrandToUpdate) {
				throw new ServiceOperationError(`productBrand with id of ${idProductBrandDTO.id} not found`);
			}

			const { affectedRows } = await this.#productBrandRepository.update({
				id: productBrandToUpdate.id,
				updates: updateProductBrandDTO,
				connection: connection,
			});

			if (affectedRows === 0) {
				throw new ServiceOperationError(`productBrand update failed, no rows affected`);
			}

			await this.#transactionHandler.commit(connection);

			const [updatedProductBrand] = await this.#productBrandRepository.findById({
				id: idProductBrandDTO.id,
			});

			return DTO.from<ResponseDTO<ProductBrandModel>>(updatedProductBrand, responseProductBrandDTOSchema);
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
				errorMessagePrefix: 'unexpected unknown exception from updateProductBrand()',
			});
		} finally {
			if (connection) {
				this.#transactionHandler.end(connection);
			}
		}
	}

	async deleteProductBrand(id: number) {
		let connection;
		try {
			const idProductBrandDTO = DTO.from<IdDTO<ProductBrandModel>>({ id }, idProductBrandDTOSchema);

			connection = await this.#transactionHandler.getConnection();
			if (!connection) {
				throw new ServiceOperationError(`cannot retrieve database connection`);
			}
			await this.#transactionHandler.begin(connection);

			const [productBrandToDelete] = await this.#productBrandRepository.findById({
				id: idProductBrandDTO.id,
				connection: connection,
				lock: DatabaseLockMode.FOR_UPDATE,
			});

			if (!productBrandToDelete) {
				throw new ServiceOperationError(`productBrand with id of ${idProductBrandDTO.id} not found`);
			}

			const { affectedRows } = await this.#productBrandRepository.delete({
				id: idProductBrandDTO.id,
				connection: connection,
			});

			if (affectedRows === 0) {
				throw new ServiceOperationError(`productBrand deletion failed, no rows affected`);
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
				errorMessagePrefix: 'unexpected unknown exception from deleteProductBrand()',
			});
		} finally {
			if (connection) {
				this.#transactionHandler.end(connection);
			}
		}
	}
}

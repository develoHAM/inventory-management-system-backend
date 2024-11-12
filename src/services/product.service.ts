import { DTO } from 'dtos/DTO';
import {
	createProductDTOSchema,
	idProductDTOSchema,
	readProductDTOSchema,
	responseProductDTOSchema,
	updateProductDTOSchema,
} from 'dtos/schemas/product.dto.schema';
import { RepositoryExecutionError, TransactionHandlingError } from 'errors/persistence';
import { ServiceExecutionError, ServiceOperationError, ValidationError } from 'errors/services';
import { ProductModel } from 'models';
import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { ProductRepository } from 'repositories';
import { DatabaseLockMode } from 'types/IDAO';
import { CreateDTO, IdDTO, ReadDTO, ResponseDTO, UpdateDTO } from 'types/IDTO';
import { ITransactionHandler } from 'types/ITransactionHandler';
import { ErrorHandler } from 'utilities/ErrorHandler';

export class ProductService {
	readonly #productRepository;
	readonly #transactionHandler;

	constructor({
		productRepository,
		transactionHandler,
	}: {
		productRepository: ProductRepository<ResultSetHeader, PoolConnection>;
		transactionHandler: ITransactionHandler<any>;
	}) {
		this.#productRepository = productRepository;
		this.#transactionHandler = transactionHandler;
	}

	async getProductById(id: number) {
		try {
			const idProductDTO = DTO.from<IdDTO<ProductModel>>({ id }, idProductDTOSchema);

			const [product] = await this.#productRepository.findById({ id: idProductDTO.id });

			if (product) {
				return DTO.from<ResponseDTO<ProductModel>>(product, responseProductDTOSchema);
			} else {
				return null;
			}
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from getProductById()',
			});
		}
	}

	async getProducts(criteria?: ReadDTO<ProductModel>) {
		try {
			let products;
			if (criteria) {
				const readProductDTO = DTO.from<ReadDTO<ProductModel>>(criteria, readProductDTOSchema);

				products = await this.#productRepository.find({ criteria: readProductDTO });
			} else {
				products = await this.#productRepository.findAll();
			}

			if (products.length > 0) {
				return products.map((product) =>
					DTO.from<ResponseDTO<ProductModel>>(product, responseProductDTOSchema)
				);
			} else {
				return [];
			}
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from getProducts()',
			});
		}
	}

	async createProduct(newProductData: CreateDTO<ProductModel>) {
		try {
			const createProductDTO = DTO.from<CreateDTO<ProductModel>>(newProductData, createProductDTOSchema);

			const { insertId } = await this.#productRepository.create({ model: createProductDTO });

			const [newProduct] = await this.#productRepository.findById({ id: insertId });

			return DTO.from<ResponseDTO<ProductModel>>(newProduct, responseProductDTOSchema);
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError, ServiceOperationError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from createProduct()',
			});
		}
	}

	async updateProduct(id: number, updates: UpdateDTO<ProductModel>) {
		let connection;
		try {
			const idProductDTO = DTO.from<IdDTO<ProductModel>>({ id: id }, idProductDTOSchema);
			const updateProductDTO = DTO.from<UpdateDTO<ProductModel>>(updates, updateProductDTOSchema);

			connection = await this.#transactionHandler.getConnection();
			if (!connection) {
				throw new ServiceOperationError(`cannot retrieve database connection`);
			}
			await this.#transactionHandler.begin(connection);

			const [productToUpdate] = await this.#productRepository.findById({
				id: idProductDTO.id,
				connection: connection,
				lock: DatabaseLockMode.FOR_UPDATE,
			});

			if (!productToUpdate) {
				throw new ServiceOperationError(`product with id of ${idProductDTO.id} not found`);
			}

			const { affectedRows } = await this.#productRepository.update({
				id: productToUpdate.id,
				updates: updateProductDTO,
				connection: connection,
			});

			if (affectedRows === 0) {
				throw new ServiceOperationError(`product update failed, no rows affected`);
			}

			await this.#transactionHandler.commit(connection);

			const [updatedProduct] = await this.#productRepository.findById({ id: idProductDTO.id });

			return DTO.from<ResponseDTO<ProductModel>>(updatedProduct, responseProductDTOSchema);
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
				errorMessagePrefix: 'unexpected unknown exception from updateProduct()',
			});
		} finally {
			if (connection) {
				this.#transactionHandler.end(connection);
			}
		}
	}

	async deleteProduct(id: number) {
		let connection;
		try {
			const idProductDTO = DTO.from<IdDTO<ProductModel>>({ id }, idProductDTOSchema);

			connection = await this.#transactionHandler.getConnection();
			if (!connection) {
				throw new ServiceOperationError(`cannot retrieve database connection`);
			}
			await this.#transactionHandler.begin(connection);

			const [productToDelete] = await this.#productRepository.findById({
				id: idProductDTO.id,
				connection: connection,
				lock: DatabaseLockMode.FOR_UPDATE,
			});

			if (!productToDelete) {
				throw new ServiceOperationError(`product with id of ${idProductDTO.id} not found`);
			}

			const { affectedRows } = await this.#productRepository.delete({
				id: idProductDTO.id,
				connection: connection,
			});

			if (affectedRows === 0) {
				throw new ServiceOperationError(`product deletion failed, no rows affected`);
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
				errorMessagePrefix: 'unexpected unknown exception from deleteProduct()',
			});
		} finally {
			if (connection) {
				this.#transactionHandler.end(connection);
			}
		}
	}
}

import { DTO } from 'dtos/DTO';
import {
	createCompanyDTOSchema,
	idCompanyDTOSchema,
	readCompanyDTOSchema,
	responseCompanyDTOSchema,
	updateCompanyDTOSchema,
} from 'dtos/schemas/company.dto.schema';
import { RepositoryExecutionError, TransactionHandlingError } from 'errors/persistence';
import { ServiceExecutionError, ServiceOperationError, ValidationError } from 'errors/services';
import { CompanyModel } from 'models';
import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { CompanyRepository } from 'repositories';
import { DatabaseLockMode } from 'types/IDAO';
import { CreateDTO, IdDTO, ReadDTO, ResponseDTO, UpdateDTO } from 'types/IDTO';
import { ITransactionHandler } from 'types/ITransactionHandler';
import { ErrorHandler } from 'utilities/ErrorHandler';

export class CompanyService {
	readonly #companyRepository;
	readonly #transactionHandler;

	constructor({
		companyRepository,
		transactionHandler,
	}: {
		companyRepository: CompanyRepository<ResultSetHeader, PoolConnection>;
		transactionHandler: ITransactionHandler<any>;
	}) {
		this.#companyRepository = companyRepository;
		this.#transactionHandler = transactionHandler;
	}

	async getCompanyById(id: number) {
		try {
			const idCompanyDTO = DTO.from<IdDTO<CompanyModel>>({ id }, idCompanyDTOSchema);

			const [company] = await this.#companyRepository.findById({
				id: idCompanyDTO.id,
			});

			if (company) {
				return DTO.from<ResponseDTO<CompanyModel>>(company, responseCompanyDTOSchema);
			} else {
				return null;
			}
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from getCompanyById()',
			});
		}
	}

	async getCompanies(criteria?: ReadDTO<CompanyModel>) {
		try {
			let companies;
			if (criteria) {
				const readCompanyDTO = DTO.from<ReadDTO<CompanyModel>>(criteria, readCompanyDTOSchema);

				companies = await this.#companyRepository.find({ criteria: readCompanyDTO });
			} else {
				companies = await this.#companyRepository.findAll();
			}

			if (companies.length > 0) {
				return companies.map((company) =>
					DTO.from<ResponseDTO<CompanyModel>>(company, responseCompanyDTOSchema)
				);
			} else {
				return [];
			}
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from getCompanies()',
			});
		}
	}

	async createCompany(newCompanyData: CreateDTO<CompanyModel>) {
		try {
			const createCompanyDTO = DTO.from<CreateDTO<CompanyModel>>(newCompanyData, createCompanyDTOSchema);

			const { insertId } = await this.#companyRepository.create({ model: createCompanyDTO });

			const [newCompany] = await this.#companyRepository.findById({ id: insertId });

			return DTO.from<ResponseDTO<CompanyModel>>(newCompany, responseCompanyDTOSchema);
		} catch (error) {
			ErrorHandler.handle({
				error: error,
				errorsToCatch: [ValidationError, RepositoryExecutionError, ServiceOperationError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'unexpected unknown exception from createCompany()',
			});
		}
	}

	async updateCompany(id: number, updates: UpdateDTO<CompanyModel>) {
		let connection;
		try {
			const idCompanyDTO = DTO.from<IdDTO<CompanyModel>>({ id: id }, idCompanyDTOSchema);
			const updateCompanyDTO = DTO.from<UpdateDTO<CompanyModel>>(updates, updateCompanyDTOSchema);

			connection = await this.#transactionHandler.getConnection();
			if (!connection) {
				throw new ServiceOperationError(`cannot retrieve database connection`);
			}
			await this.#transactionHandler.begin(connection);

			const [companyToUpdate] = await this.#companyRepository.findById({
				id: idCompanyDTO.id,
				connection: connection,
				lock: DatabaseLockMode.FOR_UPDATE,
			});

			if (!companyToUpdate) {
				throw new ServiceOperationError(`company with id of ${idCompanyDTO.id} not found`);
			}

			const { affectedRows } = await this.#companyRepository.update({
				id: companyToUpdate.id,
				updates: updateCompanyDTO,
				connection: connection,
			});

			if (affectedRows === 0) {
				throw new ServiceOperationError(`company update failed, no rows affected`);
			}

			await this.#transactionHandler.commit(connection);

			const [updatedCompany] = await this.#companyRepository.findById({
				id: idCompanyDTO.id,
			});

			return DTO.from<ResponseDTO<CompanyModel>>(updatedCompany, responseCompanyDTOSchema);
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
				errorMessagePrefix: 'unexpected unknown exception from updateCompany()',
			});
		} finally {
			if (connection) {
				this.#transactionHandler.end(connection);
			}
		}
	}

	async deleteCompany(id: number) {
		let connection;
		try {
			const idCompanyDTO = DTO.from<IdDTO<CompanyModel>>({ id }, idCompanyDTOSchema);

			connection = await this.#transactionHandler.getConnection();
			if (!connection) {
				throw new ServiceOperationError(`cannot retrieve database connection`);
			}
			await this.#transactionHandler.begin(connection);

			const [companyToDelete] = await this.#companyRepository.findById({
				id: idCompanyDTO.id,
				connection: connection,
				lock: DatabaseLockMode.FOR_UPDATE,
			});

			if (!companyToDelete) {
				throw new ServiceOperationError(`company with id of ${idCompanyDTO.id} not found`);
			}

			const { affectedRows } = await this.#companyRepository.delete({
				id: idCompanyDTO.id,
				connection: connection,
			});

			if (affectedRows === 0) {
				throw new ServiceOperationError(`company deletion failed, no rows affected`);
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
				errorMessagePrefix: 'unexpected unknown exception from deleteCompany()',
			});
		} finally {
			if (connection) {
				this.#transactionHandler.end(connection);
			}
		}
	}
}

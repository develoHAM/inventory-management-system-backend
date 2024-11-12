import { IModel } from 'types/IModel';
import {
	CreateParameter,
	DeleteParamter,
	FindAllParameter,
	FindByIdParameter,
	FindParameter,
	IRepository,
	UpdateParameter,
} from 'types/IRepository';
import { IDAO } from 'types/IDAO';
import { DatabaseQueryError, RepositoryExecutionError } from '../errors/persistence';
import { IDatabaseConnection } from 'types/IDatabase';

export abstract class Repository<ResultType, ModelType extends IModel, ConnectionType extends IDatabaseConnection>
	implements IRepository<ResultType, ModelType, ConnectionType>
{
	#dao: IDAO<ResultType, ModelType, any>;

	constructor(dao: IDAO<ResultType, ModelType, any>) {
		this.#dao = dao;
	}

	async findAll({ connection, lock }: FindAllParameter<ConnectionType> = {}): Promise<ModelType[]> {
		try {
			const result = await this.#dao.selectAll({ connection, lock });
			return result;
		} catch (error) {
			if (error instanceof DatabaseQueryError) {
				throw error;
			}
			throw new RepositoryExecutionError('failed to find resources');
		}
	}
	async findById({ id, connection, lock }: FindByIdParameter<ConnectionType>): Promise<ModelType[]> {
		try {
			const result = await this.#dao.selectById({ id, connection, lock });
			return result;
		} catch (error) {
			if (error instanceof DatabaseQueryError) {
				throw error;
			}

			throw new RepositoryExecutionError('failed to find resource by id');
		}
	}
	async find({ criteria, connection, lock }: FindParameter<ModelType, ConnectionType>): Promise<ModelType[]> {
		try {
			const result = await this.#dao.selectWhere({ criteria, connection, lock });
			return result;
		} catch (error) {
			if (error instanceof DatabaseQueryError) {
				throw error;
			}

			throw new RepositoryExecutionError('failed to find resource by given criteria');
		}
	}
	async create({ model, connection }: CreateParameter<ModelType, ConnectionType>): Promise<ResultType> {
		try {
			const result = await this.#dao.insertOne({ model, connection });
			return result;
		} catch (error) {
			if (error instanceof DatabaseQueryError) {
				throw error;
			}

			throw new RepositoryExecutionError('failed to create resource');
		}
	}
	async update({ id, updates, connection }: UpdateParameter<ModelType, ConnectionType>): Promise<ResultType> {
		try {
			const result = await this.#dao.updateById({ id, updates, connection });
			return result;
		} catch (error) {
			if (error instanceof DatabaseQueryError) {
				throw error;
			}

			throw new RepositoryExecutionError('failed to update resource');
		}
	}
	async delete({ id, connection }: DeleteParamter<ConnectionType>): Promise<ResultType> {
		try {
			const result = await this.#dao.deleteById({ id, connection });
			return result;
		} catch (error) {
			if (error instanceof DatabaseQueryError) {
				throw error;
			}

			throw new RepositoryExecutionError('failed to delete resource');
		}
	}
}

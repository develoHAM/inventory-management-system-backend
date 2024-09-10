import { IModel } from 'interfaces/IModel';
import { IRepository } from 'interfaces/IRepository';
import { IDAO } from 'interfaces/IDAO';
import { DatabaseQueryError, RepositoryExecutionError } from '../errors/persistence';
import { IDatabaseConnection } from 'interfaces/IDatabase';

export abstract class Repository<ModelType extends IModel> implements IRepository<ModelType> {
	#dao: IDAO<ModelType, any>;

	constructor(dao: IDAO<ModelType, any>) {
		this.#dao = dao;
	}

	async findAll(connection?: IDatabaseConnection): Promise<ModelType[]> {
		try {
			const result = await this.#dao.selectAll(connection);
			return result;
		} catch (error) {
			if (error instanceof DatabaseQueryError) {
				throw error;
			}
			throw new RepositoryExecutionError('failed to find resources');
		}
	}
	async findById(id: number, connection?: IDatabaseConnection): Promise<ModelType[]> {
		try {
			const result = await this.#dao.selectById(id, connection);
			return result;
		} catch (error) {
			if (error instanceof DatabaseQueryError) {
				throw error;
			}

			throw new RepositoryExecutionError('failed to find resource by id');
		}
	}
	async find(criteria: Partial<ModelType>, connection?: IDatabaseConnection): Promise<ModelType[]> {
		try {
			const result = await this.#dao.selectWhere(criteria, connection);
			return result;
		} catch (error) {
			if (error instanceof DatabaseQueryError) {
				throw error;
			}

			throw new RepositoryExecutionError('failed to find resource by given criteria');
		}
	}
	async create(model: Omit<ModelType, 'id'>, connection?: IDatabaseConnection): Promise<Record<string, any>> {
		try {
			const result = await this.#dao.insertOne(model, connection);
			return result;
		} catch (error) {
			if (error instanceof DatabaseQueryError) {
				throw error;
			}

			throw new RepositoryExecutionError('failed to create resource');
		}
	}
	async update(
		id: number,
		updates: Partial<Omit<ModelType, 'id'>>,
		connection?: IDatabaseConnection
	): Promise<Record<string, any>> {
		try {
			const result = await this.#dao.updateById(id, updates, connection);
			return result;
		} catch (error) {
			if (error instanceof DatabaseQueryError) {
				throw error;
			}

			throw new RepositoryExecutionError('failed to update resource');
		}
	}
	async delete(id: number, connection?: IDatabaseConnection): Promise<Record<string, any>> {
		try {
			const result = await this.#dao.deleteById(id, connection);
			return result;
		} catch (error) {
			if (error instanceof DatabaseQueryError) {
				throw error;
			}

			throw new RepositoryExecutionError('failed to delete resource');
		}
	}
}

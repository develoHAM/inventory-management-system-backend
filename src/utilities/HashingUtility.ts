import bcrypt from 'bcrypt';
import { DataHashingError } from '../errors/utilities/DataHashingError';
import { IHashingUtility } from 'types/IHashingUtility';

export class HashingUtility implements IHashingUtility {
	readonly #saltRounds: number;

	constructor(saltRounds: number) {
		this.#saltRounds = saltRounds;
	}
	async generateHash(value: string): Promise<string> {
		try {
			const hash = await bcrypt.hash(value, this.#saltRounds);
			return hash;
		} catch (error) {
			throw new DataHashingError(
				`error generating hash: ${error instanceof Error ? error.message : JSON.parse(JSON.stringify(error))}`
			);
		}
	}

	async compareHash(value: string, hash: string): Promise<boolean> {
		try {
			const isMatch = await bcrypt.compare(value, hash);

			return isMatch;
		} catch (error) {
			throw new DataHashingError(
				`error comparing hash: ${error instanceof Error ? error.message : JSON.parse(JSON.stringify(error))}`
			);
		}
	}
}

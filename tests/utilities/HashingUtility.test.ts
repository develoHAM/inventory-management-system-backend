import { jest, describe, it, expect, afterAll, afterEach, beforeAll, beforeEach } from '@jest/globals';
import bcrypt from 'bcrypt';
import { HashingUtility } from '../../src/utilities';
import { DataHashingError } from '../../src/errors/utilities/DataHashingError';

beforeEach(() => {
	jest.clearAllMocks();
});
describe('HashingUtility class', () => {
	const hashingUtilityGenerateHashSpy = jest.spyOn(HashingUtility.prototype, 'generateHash');
	const hashingUtilityCompareHashSpy = jest.spyOn(HashingUtility.prototype, 'compareHash');

	const hashingUtility = new HashingUtility(10);
	const valueToHash = 'test';
	let hash: string;

	describe('generateHash()', () => {
		it('returns hash (string with length of 60)', async () => {
			hash = await hashingUtility.generateHash(valueToHash);

			expect(hashingUtilityGenerateHashSpy).toHaveBeenCalledWith(valueToHash);
			expect(hashingUtilityGenerateHashSpy).toHaveBeenCalledTimes(1);
			expect(hash).toHaveLength(60);
			expect(typeof hash).toBe('string');
		});

		it('throws DataHashingError if bcrypt.hash fails and throws an Error instance', async () => {
			jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
				throw new Error('hash error');
			});

			expect(hashingUtility.generateHash(valueToHash)).rejects.toThrow(
				new DataHashingError('error generating hash: hash error')
			);
		});

		it('throws DataHashingError if bcrypt.hash fails and throws something else', () => {
			jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
				throw 'something else';
			});

			expect(hashingUtility.generateHash(valueToHash)).rejects.toThrow(
				new DataHashingError('error generating hash: something else')
			);
		});
	});

	describe('compareHash()', () => {
		it('compares hash and return true if provided value and hash matches', async () => {
			const result = await hashingUtility.compareHash(valueToHash, hash);

			expect(hashingUtilityCompareHashSpy).toHaveBeenCalledWith(valueToHash, hash);
			expect(hashingUtilityCompareHashSpy).toHaveBeenCalledTimes(1);
			expect(typeof result).toBe('boolean');
			expect(result).toBeTruthy();
		});

		it('compares hash and return false if provided value and hash do not match', async () => {
			const result = await hashingUtility.compareHash('random value', hash);

			expect(hashingUtilityCompareHashSpy).toHaveBeenCalledWith('random value', hash);
			expect(hashingUtilityCompareHashSpy).toHaveBeenCalledTimes(1);
			expect(typeof result).toBe('boolean');
			expect(result).toBeFalsy();
		});

		it('throws DataHashingError if bcrypt.compare fails and throws an Error instance', async () => {
			jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
				throw new Error('hash error');
			});

			expect(hashingUtility.compareHash(valueToHash, hash)).rejects.toThrow(
				new DataHashingError('error comparing hash: hash error')
			);
		});

		it('throws DataHashingError if bcrypt.compare fails and throws something else', () => {
			jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
				throw 'something else';
			});

			expect(hashingUtility.compareHash(valueToHash, hash)).rejects.toThrow(
				new DataHashingError('error comparing hash: something else')
			);
		});
	});
});

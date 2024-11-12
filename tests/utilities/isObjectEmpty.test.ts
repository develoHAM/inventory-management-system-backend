import { jest, describe, it, expect, afterAll, afterEach, beforeAll, beforeEach } from '@jest/globals';

import { isObjectEmpty } from '../../src/utilities';

describe('isObjectEmpty function', () => {
	describe('when an array is passed', () => {
		it('returns true if an empty array is passed', () => {
			const result = isObjectEmpty([]);

			expect(result).toBe(true);
		});
		it('returns false if the array is not empty', () => {
			const result = isObjectEmpty(['']);

			expect(result).toBe(false);
		});
	});

	describe('when an object is passed', () => {
		it('returns true if an empty object is passed', () => {
			const result = isObjectEmpty({});

			expect(result).toBe(true);
		});

		it('returns false if the object is not empty', () => {
			const result = isObjectEmpty({ test: 'test' });

			expect(result).toBe(false);
		});
	});
});

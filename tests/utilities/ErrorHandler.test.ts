import { jest, describe, it, expect, afterAll, afterEach, beforeAll, beforeEach } from '@jest/globals';

import { ValidationError, ServiceOperationError, ServiceExecutionError } from '../../src/errors/services';
import { TransactionHandlingError } from '../../src/errors/persistence/TransactionHandlingError';
import { ErrorHandler } from '../../src/utilities/ErrorHandler';
import exp from 'constants';

beforeEach(() => {
	jest.clearAllMocks();
});
describe('ErrorHandler', () => {
	const errorHandlerHandleSpy = jest.spyOn(ErrorHandler, 'handle');

	describe('when error provided is a valid Error instance', () => {
		describe('when error is an instance of one of the error classes provided in the errorsToThrow array', () => {
			const errorHandlerOptions = {
				error: new ValidationError('test validation error'),
				errorsToCatch: [ValidationError, ServiceOperationError, TransactionHandlingError],
				errorToThrow: Error,
			};

			it('rethrows the error', () => {
				expect(() => ErrorHandler.handle(errorHandlerOptions)).toThrowError(
					new ValidationError('test validation error')
				);
				expect(errorHandlerHandleSpy).toHaveBeenCalledWith(errorHandlerOptions);
				expect(errorHandlerHandleSpy).toHaveBeenCalledTimes(1);
			});
		});

		describe('when error is not an instance of one of the error classes provided in the errorsToThrow array', () => {
			describe('when errorMessagePrefix is provided', () => {
				const errorHandlerOptions = {
					error: new Error('test validation error'),
					errorsToCatch: [ServiceOperationError, TransactionHandlingError],
					errorToThrow: ServiceExecutionError,
					errorMessagePrefix: 'test prefix',
				};

				it('throws an error provided as the errorToThrow with the errorMessagePrefix', () => {
					expect(() => ErrorHandler.handle(errorHandlerOptions)).toThrowError(
						new Error('test prefix: test validation error')
					);
					expect(errorHandlerHandleSpy).toHaveBeenCalledWith(errorHandlerOptions);
					expect(errorHandlerHandleSpy).toHaveBeenCalledTimes(1);
				});
			});

			describe('when errorMessagePrefix is not provided', () => {
				const errorHandlerOptions = {
					error: new Error('test error'),
					errorsToCatch: [ServiceOperationError, TransactionHandlingError],
					errorToThrow: ServiceExecutionError,
				};

				it('throws an error provided as the errorToThrow without the errorMessagePrefix', () => {
					expect(() => ErrorHandler.handle(errorHandlerOptions)).toThrowError(
						new ServiceExecutionError('test error')
					);
					expect(errorHandlerHandleSpy).toHaveBeenCalledWith(errorHandlerOptions);
					expect(errorHandlerHandleSpy).toHaveBeenCalledTimes(1);
				});
			});
		});
	});

	describe('when error provided is a not a valid Error instance', () => {
		describe('when errorMessagePrefix is provided', () => {
			const errorHandlerOptions = {
				error: 'test string',
				errorsToCatch: [ServiceOperationError, TransactionHandlingError],
				errorToThrow: ServiceExecutionError,
				errorMessagePrefix: 'test prefix',
			};

			it('throws an error provided as the errorToThrow with the errorMessagePrefix', () => {
				expect(() => ErrorHandler.handle(errorHandlerOptions)).toThrowError(
					new ServiceExecutionError('test prefix: test string')
				);
				expect(errorHandlerHandleSpy).toHaveBeenCalledWith(errorHandlerOptions);
				expect(errorHandlerHandleSpy).toHaveBeenCalledTimes(1);
			});
		});

		describe('when errorMessagePrefix is not provided', () => {
			const errorHandlerOptions = {
				error: 'test string',
				errorsToCatch: [ServiceOperationError, TransactionHandlingError],
				errorToThrow: ServiceExecutionError,
			};

			it('throws an error provided as the errorToThrow without the errorMessagePrefix', () => {
				expect(() => ErrorHandler.handle(errorHandlerOptions)).toThrowError(
					new ServiceExecutionError('test string')
				);
				expect(errorHandlerHandleSpy).toHaveBeenCalledWith(errorHandlerOptions);
				expect(errorHandlerHandleSpy).toHaveBeenCalledTimes(1);
			});
		});
	});
});

import { jest, describe, it, expect, afterAll, afterEach, beforeAll, beforeEach } from '@jest/globals';
import { TypeValidator } from '../../src/utilities';
import { StringTypeValidation, NumberTypeValidation, DateTypeValidation } from '../../src/types/IDTO';

// email
const emailRegex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

// at least 1 special character, number, smaller case letter, upper case letter
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]+$/;

const assertNoErrorStringAppended = ({
	functionToRun,
	spyFunction,
	value,
	options,
}: {
	functionToRun: any;
	spyFunction: any;
	value: any;
	options: Record<string, any>;
}) => {
	it('does not push anything into the errors array', () => {
		const errors = functionToRun(value, options);

		expect(spyFunction).toHaveBeenCalledWith(value, options);
		expect(spyFunction).toHaveBeenCalledTimes(1);
		expect(Array.isArray(errors)).toBe(true);
		expect(errors.length).toBe(0);
		expect(errors).toEqual([]);
	});
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('TypeValidator class', () => {
	describe('static methods', () => {
		describe('containSpaces()', () => {
			const containSpacesSpy = jest.spyOn(TypeValidator, 'containsSpaces');

			it('returns true if the value contains any spaces', () => {
				const valueWithSpace = ' v a l u e';
				const result = TypeValidator.containsSpaces(valueWithSpace);

				expect(containSpacesSpy).toBeCalledWith(valueWithSpace);
				expect(containSpacesSpy).toHaveBeenCalledTimes(1);
				expect(result).toBe(true);
			});

			it('retruns false if value does not contain any spaces', () => {
				const valueWithoutSpace = 'value';
				const result = TypeValidator.containsSpaces(valueWithoutSpace);

				expect(containSpacesSpy).toBeCalledWith(valueWithoutSpace);
				expect(containSpacesSpy).toHaveBeenCalledTimes(1);
				expect(result).toBe(false);
			});
		});
		describe('isBelow()', () => {
			const isBelowSpy = jest.spyOn(TypeValidator, 'isBelow');

			it('returns true if the value is below the specified length', () => {
				const value = 10;
				const result = TypeValidator.isBelow(value, 100);

				expect(isBelowSpy).toBeCalledWith(value, 100);
				expect(isBelowSpy).toHaveBeenCalledTimes(1);
				expect(result).toBe(true);
			});

			it('returns false if the value is not below the specified length', () => {
				const value = 10;
				const result = TypeValidator.isBelow(value, 1);

				expect(isBelowSpy).toBeCalledWith(value, 1);
				expect(isBelowSpy).toHaveBeenCalledTimes(1);
				expect(result).toBe(false);
			});
		});

		describe('isOver()', () => {
			const isOverSpy = jest.spyOn(TypeValidator, 'isOver');

			it('returns true if the value is over the specified length', () => {
				const value = 10;
				const result = TypeValidator.isOver(value, 1);

				expect(isOverSpy).toBeCalledWith(value, 1);
				expect(isOverSpy).toHaveBeenCalledTimes(1);
				expect(result).toBe(true);
			});

			it('returns false if the value is not over the specified length', () => {
				const value = 10;
				const result = TypeValidator.isOver(value, 100);

				expect(isOverSpy).toBeCalledWith(value, 100);
				expect(isOverSpy).toHaveBeenCalledTimes(1);
				expect(result).toBe(false);
			});

			describe('matchesPattern()', () => {
				const matchesPatternSpy = jest.spyOn(TypeValidator, 'matchesPattern');

				it('returns true if the value matches the specified regex pattern', () => {
					const testEmail = 'testemailstring0722@gmail.com';
					const testPassword = 'testPassword0722!!';
					const emailResult = TypeValidator.matchesPattern(testEmail, emailRegex);
					const passwordResult = TypeValidator.matchesPattern(testPassword, passwordRegex);

					expect(matchesPatternSpy).toHaveBeenNthCalledWith(1, testEmail, emailRegex);
					expect(matchesPatternSpy).toHaveBeenNthCalledWith(2, testPassword, passwordRegex);
					expect(emailResult).toBe(true);
					expect(passwordResult).toBe(true);
				});

				it('returns false if the value does not match the specified regex pattern', () => {
					const testEmail = 'wrongemailpattern_#!@';
					const testPassword = 'wrongpasswordpattern';
					const emailResult = TypeValidator.matchesPattern(testEmail, emailRegex);
					const passwordResult = TypeValidator.matchesPattern(testPassword, passwordRegex);

					expect(matchesPatternSpy).toHaveBeenNthCalledWith(1, testEmail, emailRegex);
					expect(matchesPatternSpy).toHaveBeenNthCalledWith(2, testPassword, passwordRegex);
					expect(emailResult).toBe(false);
					expect(passwordResult).toBe(false);
				});
			});
			describe('has()', () => {
				const hasSpy = jest.spyOn(TypeValidator, 'has');
				const list = ['a', 'b', 'c'];

				it('returns true if the value exists in the specified list', () => {
					const result = TypeValidator.has('a', list);

					expect(hasSpy).toHaveBeenCalledWith('a', list);
					expect(hasSpy).toHaveBeenCalledTimes(1);
					expect(result).toBe(true);
				});

				it('returns false if the value does not exist in the specified list', () => {
					const result = TypeValidator.has('z', list);

					expect(hasSpy).toHaveBeenCalledWith('z', list);
					expect(hasSpy).toHaveBeenCalledTimes(1);
					expect(result).toBe(false);
				});
			});
			describe('validateString()', () => {
				const validateStringSpy = jest.spyOn(TypeValidator, 'validateString');

				describe('when the given value is not a string', () => {
					it('returns a single error string if value is not string', () => {
						const result = TypeValidator.validateString(1);
						const expectedErrorMessage = `- value must be a string`;
						expect(validateStringSpy).toHaveBeenCalledWith(1);
						expect(validateStringSpy).toHaveBeenCalledTimes(1);
						expect(Array.isArray(result)).toBe(true);
						expect(result.length).toBe(1);
						expect(result).toEqual([expectedErrorMessage]);
					});
				});

				describe('when the given value is a string', () => {
					describe('when allowSpaces option is false', () => {
						const options = {
							allowSpaces: false,
						} as StringTypeValidation;
						const expectedErrorMessage = `- value must not contain spaces`;

						it(`pushes an error string into the errors array: ${expectedErrorMessage}`, () => {
							const value = 'v a l u e';
							const errors = TypeValidator.validateString(value, options);

							expect(validateStringSpy).toHaveBeenCalledWith(value, options);
							expect(validateStringSpy).toHaveBeenCalledTimes(1);
							expect(Array.isArray(errors)).toBe(true);
							expect(errors.length).toBe(1);
							expect(errors).toEqual([expectedErrorMessage]);
						});
					});

					describe('when allowSpaces option is true', () => {
						const options = {
							allowSpaces: true,
						} as StringTypeValidation;
						describe('when value only contains spaces', () => {
							const value = '   \n   ';
							const expectedErrorMessage = `- value cannot be all blank spaces`;
							it(`pushes an error string into the errors array: ${expectedErrorMessage}`, () => {
								const errors = TypeValidator.validateString(value, options);

								expect(validateStringSpy).toHaveBeenCalledWith(value, options);
								expect(validateStringSpy).toHaveBeenCalledTimes(1);
								expect(Array.isArray(errors)).toBe(true);
								expect(errors.length).toBe(1);
								expect(errors).toEqual([expectedErrorMessage]);
							});
						});

						describe('when value contains other characters', () => {
							const value = 't e s t';

							assertNoErrorStringAppended({
								functionToRun: TypeValidator.validateString.bind(TypeValidator),
								spyFunction: validateStringSpy,
								value,
								options,
							});
						});
					});

					describe('when maximumLength is given', () => {
						const options = {
							maximumLength: 5,
						} as StringTypeValidation;

						describe('when the value is over the maximum length', () => {
							const value = '123456';
							const expectedErrorMessage = `- value must not have a length longer than ${options.maximumLength}`;

							it(`pushes an error string into the errors array: ${expectedErrorMessage}`, () => {
								const errors = TypeValidator.validateString(value, options);

								expect(validateStringSpy).toHaveBeenCalledWith(value, options);
								expect(validateStringSpy).toHaveBeenCalledTimes(1);
								expect(Array.isArray(errors)).toBe(true);
								expect(errors.length).toBe(1);
								expect(errors).toEqual([expectedErrorMessage]);
							});
						});

						describe('when the value is not over the maximum length', () => {
							const value = '12345';

							assertNoErrorStringAppended({
								functionToRun: TypeValidator.validateString.bind(TypeValidator),
								spyFunction: validateStringSpy,
								value,
								options,
							});
						});
					});

					describe('when minimumLength is given', () => {
						const options = {
							minimumLength: 5,
						} as StringTypeValidation;
						describe('when the value is below the minimum length', () => {
							const value = '1234';
							const expectedErrorMessage = `- value must not have a length shorter than ${options.minimumLength}`;

							it(`pushes an error string into the errors array: ${expectedErrorMessage}`, () => {
								const errors = TypeValidator.validateString(value, options);

								expect(validateStringSpy).toHaveBeenCalledWith(value, options);
								expect(validateStringSpy).toHaveBeenCalledTimes(1);
								expect(Array.isArray(errors)).toBe(true);
								expect(errors.length).toBe(1);
								expect(errors).toEqual([expectedErrorMessage]);
							});
						});

						describe('when the value is not below the minimum length', () => {
							const value = '12345';

							assertNoErrorStringAppended({
								functionToRun: TypeValidator.validateString.bind(TypeValidator),
								spyFunction: validateStringSpy,
								value,
								options,
							});
						});
					});

					describe('when regexPattern is given', () => {
						const options = {
							regexPattern: emailRegex,
						} as StringTypeValidation;

						describe('when the value matches the given regex pattern', () => {
							const value = 'kdw980722@gmail.com';

							assertNoErrorStringAppended({
								functionToRun: TypeValidator.validateString.bind(TypeValidator),
								spyFunction: validateStringSpy,
								value,
								options,
							});
						});

						describe('when the value does not match the given regex pattern', () => {
							const value = 'some_random1string!==email#&*';
							const expectedErrorMessage = `- value must match the required pattern`;

							it(`pushes an error string into the errors array: ${expectedErrorMessage}`, () => {
								const errors = TypeValidator.validateString(value, options);

								expect(validateStringSpy).toHaveBeenCalledWith(value, options);
								expect(validateStringSpy).toHaveBeenCalledTimes(1);
								expect(Array.isArray(errors)).toBe(true);
								expect(errors.length).toBe(1);
								expect(errors).toEqual([expectedErrorMessage]);
							});
						});
					});

					describe('when enumValues are given', () => {
						const options = {
							enumValues: ['a', 'b', 'c'],
						} as StringTypeValidation;
						describe('when the value is within the given enum values list', () => {
							const value = 'a';

							assertNoErrorStringAppended({
								functionToRun: TypeValidator.validateString.bind(TypeValidator),
								spyFunction: validateStringSpy,
								value,
								options,
							});
						});

						describe('when the value is not within the given enum values list', () => {
							const value = 'z';
							const expectedErrorMessage = `- value must be a valid enumerator`;

							it(`pushes an error string into the errors array: ${expectedErrorMessage}`, () => {
								const errors = TypeValidator.validateString(value, options);

								expect(validateStringSpy).toHaveBeenCalledWith(value, options);
								expect(validateStringSpy).toHaveBeenCalledTimes(1);
								expect(Array.isArray(errors)).toBe(true);
								expect(errors.length).toBe(1);
								expect(errors).toEqual([expectedErrorMessage]);
							});
						});
					});
				});
			});

			describe('validateDate()', () => {
				const validateDateSpy = jest.spyOn(TypeValidator, 'validateDate');

				const options = {
					minimumDate: new Date('2000-01-01'),
					maximumDate: new Date('2024-01-01'),
				} as DateTypeValidation;

				describe('when the given value is not a Date object', () => {
					const value = 'not a date object';
					const expectedErrorMessage = `- value must be a Date object`;

					it(`pushes an error string into the errors array: ${expectedErrorMessage}`, () => {
						const errors = TypeValidator.validateDate(value);

						expect(validateDateSpy).toHaveBeenCalledWith(value);
						expect(validateDateSpy).toHaveBeenCalledTimes(1);
						expect(Array.isArray(errors)).toBe(true);
						expect(errors.length).toBe(1);
						expect(errors).toEqual([expectedErrorMessage]);
					});
				});

				describe('when the given value is a Date object', () => {
					describe('when value is not a valid date', () => {
						const value = new Date('not a valid date');
						const expectedErrorMessage = `- value must be a valid date`;
						it(`pushes an error string into the errors array: ${expectedErrorMessage}`, () => {
							const errors = TypeValidator.validateDate(value, options);

							expect(validateDateSpy).toHaveBeenCalledWith(value, options);
							expect(validateDateSpy).toHaveBeenCalledTimes(1);
							expect(Array.isArray(errors)).toBe(true);
							expect(errors.length).toBe(1);
							expect(errors).toEqual([expectedErrorMessage]);
						});
					});

					describe('when minimumDate is given', () => {
						const options = {
							minimumDate: new Date('2000-01-01'),
						} as DateTypeValidation;

						describe('when the given value is at least the specified minimumDate', () => {
							const value = new Date('2000-01-01');

							assertNoErrorStringAppended({
								functionToRun: TypeValidator.validateDate.bind(TypeValidator),
								spyFunction: validateDateSpy,
								value,
								options,
							});
						});

						describe('when the given value is before the specified minimumDate', () => {
							const value = new Date('1999-01-01');
							const expectedErrorMessage = `- value must be at least ${options.minimumDate!.toISOString()}`;

							it(`pushes an error string into the errors array: ${expectedErrorMessage}`, () => {
								const errors = TypeValidator.validateDate(value, options);

								expect(validateDateSpy).toHaveBeenCalledWith(value, options);
								expect(validateDateSpy).toHaveBeenCalledTimes(1);
								expect(Array.isArray(errors)).toBe(true);
								expect(errors.length).toBe(1);
								expect(errors).toEqual([expectedErrorMessage]);
							});
						});
					});

					describe('when maximumDate is given', () => {
						const options = {
							maximumDate: new Date('2100-01-01'),
						} as DateTypeValidation;

						describe('when given does not exceed the specified maximumDate', () => {
							const value = new Date('2100-01-01');

							assertNoErrorStringAppended({
								functionToRun: TypeValidator.validateDate.bind(TypeValidator),
								spyFunction: validateDateSpy,
								value,
								options,
							});
						});

						describe('when the given value is after the specified maximumDate', () => {
							const value = new Date('2200-01-01');
							const expectedErrorMessage = `- value must not exceed ${options.maximumDate!.toISOString()}`;

							it(`pushes an error string into the errors array: ${expectedErrorMessage}`, () => {
								const errors = TypeValidator.validateDate(value, options);

								expect(validateDateSpy).toHaveBeenCalledWith(value, options);
								expect(validateDateSpy).toHaveBeenCalledTimes(1);
								expect(Array.isArray(errors)).toBe(true);
								expect(errors.length).toBe(1);
								expect(errors).toEqual([expectedErrorMessage]);
							});
						});
					});
				});
			});
			describe('validateNumber()', () => {});
		});
		describe('validateNumber', () => {
			const validateNumberSpy = jest.spyOn(TypeValidator, 'validateNumber');
			describe('when the given value is not a number', () => {
				const value = 'not a number';
				const expectedErrorMessage = `- value must be a number`;
				it(`pushes an error string into the errors array: ${expectedErrorMessage}`, () => {
					const errors = TypeValidator.validateNumber(value);

					expect(validateNumberSpy).toHaveBeenCalledWith(value);
					expect(validateNumberSpy).toHaveBeenCalledTimes(1);
					expect(Array.isArray(errors)).toBe(true);
					expect(errors.length).toBe(1);
					expect(errors).toEqual([expectedErrorMessage]);
				});
			});

			describe('when the given value is a number', () => {
				describe(`when maximumValue is given`, () => {
					const options = {
						maximumValue: 10,
					} as NumberTypeValidation;

					describe('when the given value exceeds the maximumValue', () => {
						const value = 100;
						const expectedErrorMessage = `- value must be less than ${options.maximumValue}`;
						it(`pushes an error string into the errors array: ${expectedErrorMessage}`, () => {
							const errors = TypeValidator.validateNumber(value, options);

							expect(validateNumberSpy).toHaveBeenCalledWith(value, options);
							expect(validateNumberSpy).toHaveBeenCalledTimes(1);
							expect(Array.isArray(errors)).toBe(true);
							expect(errors.length).toBe(1);
							expect(errors).toEqual([expectedErrorMessage]);
						});
					});

					describe('when the given value does not exceed the maximumValue', () => {
						const value = 10;

						assertNoErrorStringAppended({
							functionToRun: TypeValidator.validateNumber.bind(TypeValidator),
							spyFunction: validateNumberSpy,
							value,
							options,
						});
					});
				});
				describe(`when minimumValue is given`, () => {
					const options = {
						minimumValue: 10,
					} as NumberTypeValidation;

					describe('when the given value is not less than the minimumValue', () => {
						const value = 10;

						assertNoErrorStringAppended({
							functionToRun: TypeValidator.validateNumber.bind(TypeValidator),
							spyFunction: validateNumberSpy,
							value,
							options,
						});
					});
					describe('when the given value is less than the minimumValue', () => {
						const value = 5;
						const expectedErrorMessage = `- value must be more than ${options.minimumValue}`;
						it(`pushes an error string into the errors array: ${expectedErrorMessage}`, () => {
							const errors = TypeValidator.validateNumber(value, options);

							expect(validateNumberSpy).toHaveBeenCalledWith(value, options);
							expect(validateNumberSpy).toHaveBeenCalledTimes(1);
							expect(Array.isArray(errors)).toBe(true);
							expect(errors.length).toBe(1);
							expect(errors).toEqual([expectedErrorMessage]);
						});
					});
				});
				describe(`when enumValues are given`, () => {
					const options = {
						enumValues: [1, 2, 3],
					} as NumberTypeValidation;

					describe('when the value is within the given enum values list', () => {
						const value = 1;

						assertNoErrorStringAppended({
							functionToRun: TypeValidator.validateNumber.bind(TypeValidator),
							spyFunction: validateNumberSpy,
							value,
							options,
						});
					});
					describe('when the value is not within the given enum values list', () => {
						const value = 1000;
						const expectedErrorMessage = `- value must be a valid enumerator`;

						it(`pushes an error string into the errors array: ${expectedErrorMessage}`, () => {
							const errors = TypeValidator.validateNumber(value, options);

							expect(validateNumberSpy).toHaveBeenCalledWith(value, options);
							expect(validateNumberSpy).toHaveBeenCalledTimes(1);
							expect(Array.isArray(errors)).toBe(true);
							expect(errors.length).toBe(1);
							expect(errors).toEqual([expectedErrorMessage]);
						});
					});
				});
			});
		});
	});
});

import { StringTypeValidation, NumberTypeValidation, DateTypeValidation } from 'types/IDTO';

export class TypeValidator {
	public static containsSpaces(value: string): boolean {
		return /\s/.test(value);
	}

	public static isBelow(value: number, length: number): boolean {
		return value < length;
	}

	public static isOver(value: number, length: number): boolean {
		return value > length;
	}

	public static matchesPattern(value: string, pattern: RegExp): boolean {
		return pattern.test(value);
	}

	public static has<T extends string | number>(value: T, list: T[]): boolean {
		return list.includes(value);
	}

	public static validateString(value: unknown, options: StringTypeValidation = { allowSpaces: true }) {
		const errors = [];

		if (typeof value === 'string') {
			if (options.allowSpaces === false && this.containsSpaces(value)) {
				errors.push(`- value must not contain spaces`);
			}

			if (options.allowSpaces === true && value.trim().length === 0) {
				errors.push(`- value cannot be all blank spaces`);
			}

			if (options.maximumLength !== undefined && this.isOver(value.length, options.maximumLength)) {
				errors.push(`- value must not have a length longer than ${options.maximumLength}`);
			}

			if (options.minimumLength !== undefined && this.isBelow(value.length, options.minimumLength)) {
				errors.push(`- value must not have a length shorter than ${options.minimumLength}`);
			}

			if (options.regexPattern && !this.matchesPattern(value, options.regexPattern)) {
				errors.push(`- value must match the required pattern`);
			}

			if (
				options.enumValues !== undefined &&
				options.enumValues.length > 0 &&
				!this.has(value, options.enumValues)
			) {
				errors.push(`- value must be a valid enumerator`);
			}
		} else {
			errors.push(`- value must be a string`);
		}

		return errors;
	}

	public static validateDate(value: unknown, options: DateTypeValidation = {}) {
		const errors = [];

		if (value instanceof Date) {
			if (isNaN(value.getTime())) {
				errors.push(`- value must be a valid date`);
			}

			if (options.maximumDate && value > options.maximumDate) {
				errors.push(`- value must not exceed ${options.maximumDate.toISOString()}`);
			}

			if (options.minimumDate && value < options.minimumDate) {
				errors.push(`- value must be at least ${options.minimumDate.toISOString()}`);
			}
		} else {
			errors.push(`- value must be a Date object`);
		}

		return errors;
	}

	public static validateNumber(value: unknown, options: NumberTypeValidation = {}) {
		const errors = [];

		if (typeof value === 'number') {
			if (options.maximumValue !== undefined && this.isOver(value, options.maximumValue)) {
				errors.push(`- value must be less than ${options.maximumValue}`);
			}

			if (options.minimumValue !== undefined && this.isBelow(value, options.minimumValue)) {
				errors.push(`- value must be more than ${options.minimumValue}`);
			}

			if (
				options.enumValues !== undefined &&
				options.enumValues.length > 0 &&
				!this.has(value, options.enumValues)
			) {
				errors.push(`- value must be a valid enumerator`);
			}
		} else {
			errors.push(`- value must be a number`);
		}

		return errors;
	}
}

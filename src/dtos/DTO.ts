import { ValidationError } from 'errors/services/ValidationError';
import { DTOFieldSchemas } from 'types/IDTO';
import { isObjectEmpty } from 'utilities/isObjectEmpty';
import { TypeValidator } from 'utilities/TypeValidator';

export class DTO {
	static from<DTOType>(
		data: Record<string | number, any>,
		schema: DTOFieldSchemas<'string' | 'number' | 'date'>
	): DTOType {
		// empty validation schema check
		if (!schema || isObjectEmpty(schema)) {
			throw new ValidationError(`field schema is not provided`);
		}
		// empty data check
		if (!data || isObjectEmpty(data)) {
			throw new ValidationError(`data for validation is not provided`);
		}

		const convertedData = { ...data };
		schema.forEach(({ fieldName, fieldType }) => {
			if (fieldType === 'date' && typeof convertedData[fieldName] === 'string') {
				convertedData[fieldName] = new Date(convertedData[fieldName]);
			}
		});

		this.validateSchema(convertedData, schema);

		return Object.fromEntries(
			Object.entries(convertedData).filter(([fieldName, fieldValue]) => fieldValue !== undefined)
		) as DTOType;
	}

	private static validators = {
		string: (value: unknown, constraints: any) => TypeValidator.validateString(value, constraints),
		number: (value: unknown, constraints: any) => TypeValidator.validateNumber(value, constraints),
		date: (value: unknown, constraints: any) => TypeValidator.validateDate(value, constraints),
	};

	private static validateSchema(
		data: Record<string | number, any>,
		schema: DTOFieldSchemas<'string' | 'number' | 'date'>
	) {
		const validationErrors: string[] = [];
		const schemaFieldNames: string[] = schema.map(({ fieldName }) => fieldName);
		const excessFields: string[] = Object.keys(data).filter((fieldName) => !schemaFieldNames.includes(fieldName));

		// excess properties check
		if (excessFields.length > 0) {
			throw new ValidationError(`excess fields found: ${excessFields.join(', ')}`);
		}

		// validation logic
		schema.forEach(({ fieldName, fieldType, isRequired, allowNull, fieldConstraints }) => {
			const value = data[fieldName];
			const fieldValidationErrors: string[] = [];

			//required field check
			if (isRequired && value === undefined) {
				fieldValidationErrors.push(`- value is required`);
			}

			// null and type checks
			if (value === null) {
				if (!allowNull) fieldValidationErrors.push(`- value cannot be null`);
			} else if (DTO.validators[fieldType]) {
				fieldValidationErrors.push(...DTO.validators[fieldType](value, fieldConstraints));
			}

			if (fieldValidationErrors.length > 0) {
				validationErrors.push(`${fieldName}:\n` + fieldValidationErrors.join('\n'));
			}
		});

		if (validationErrors.length > 0) {
			throw new ValidationError(`validation errors:\n${validationErrors.join('\n')}`);
		}
	}
}

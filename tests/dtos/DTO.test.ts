// @ts-nocheck

import { jest, describe, it, expect, afterAll, afterEach, beforeAll, beforeEach } from '@jest/globals';

import { DTO } from '../../src/dtos/DTO';
import { ValidationError } from '../../src/errors/services';
import { UserType } from '../../src/models/user.model';
import * as utils from '../../src/utilities/';

const testData = {
	id: 1,
	name: 'testName',
	username: 'testUsername',
	email: 'test@gmail.com',
	phone: '010-0000-1111',
	password: 'somethingSecret123!',
	user_type: 'STORE_STAFF',
	company: 2,
	store_branch: 3,
	date: 'November 7, 2024',
};
const testSchema = [
	{
		fieldName: 'id',
		fieldType: 'number',
		isRequired: true,
		allowNull: false,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
	{
		fieldName: 'name',
		fieldType: 'string',
		isRequired: true,
		allowNull: false,
		fieldConstraints: {
			allowSpaces: false,
			maximumLength: 50,
			minimumLength: 2,
		},
	},
	{
		fieldName: 'username',
		fieldType: 'string',
		isRequired: true,
		allowNull: false,
		fieldConstraints: {
			allowSpaces: false,
			maximumLength: 20,
			minimumLength: 8,
		},
	},
	{
		fieldName: 'email',
		fieldType: 'string',
		isRequired: true,
		allowNull: false,
		fieldConstraints: {
			allowSpaces: false,
			maximumLength: 255,
			regexPattern: /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
		},
	},
	{
		fieldName: 'phone',
		fieldType: 'string',
		isRequired: true,
		allowNull: false,
		fieldConstraints: {
			allowSpaces: false,
			maximumLength: 13,
			minimumLength: 12,
			regexPattern: /^01[016789]-\d{3,4}-\d{4}$/,
		},
	},
	{
		fieldName: 'password',
		fieldType: 'string',
		isRequired: true,
		allowNull: false,
		fieldConstraints: {
			allowSpaces: false,
			minimumLength: 10,
			// at least 1 special character, number, smaller case letter, upper case letter
			regexPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]+$/,
		},
	},
	{
		fieldName: 'user_type',
		fieldType: 'string',
		isRequired: true,
		allowNull: false,
		fieldConstraints: {
			allowSpaces: false,
			enumValues: [UserType.ADMIN, UserType.STORE_ADMIN, UserType.STORE_STAFF],
		},
	},
	{
		fieldName: 'company',
		fieldType: 'number',
		isRequired: true,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
	{
		fieldName: 'store_branch',
		fieldType: 'number',
		isRequired: true,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
	{
		fieldName: 'date',
		fieldType: 'date',
		isRequired: true,
		allowNull: false,
	},
];

describe('DTO class', () => {
	let fromSpy: any;
	let isObjectEmptySpy: any;
	beforeEach(() => {
		fromSpy = jest.spyOn(DTO, 'from');
		isObjectEmptySpy = jest.spyOn(utils, 'isObjectEmpty');
	});

	describe('from(data, schema)', () => {
		describe('when data or schema is either empty or falsy', () => {
			const table = [
				{ data: testData, schema: [], expectedError: new ValidationError('field schema is not provided') },
				{
					data: testData,
					schema: undefined,
					expectedError: new ValidationError('field schema is not provided'),
				},
				{
					data: {},
					schema: testSchema,
					expectedError: new ValidationError('data for validation is not provided'),
				},
				{
					data: undefined,
					schema: testSchema,
					expectedError: new ValidationError('data for validation is not provided'),
				},
			];

			it.each(table)('throws a validation error', ({ data, schema, expectedError }) => {
				expect(() => {
					DTO.from(data, schema);
				}).toThrowError(expectedError);
			});
		});
		describe('when data contains excess fields', () => {
			it('throws a validation error', () => {
				const dataWithExcessFields = { ...testData, prop1: 'test', prop2: 'test' };

				expect(() => {
					DTO.from(dataWithExcessFields, testSchema);
				}).toThrowError(new ValidationError('excess fields found: prop1, prop2'));
			});
		});
		describe('when data is missing a property', () => {
			it('throws a validation error', () => {
				const { id, name, ...dataWithMissingFields } = testData;

				expect(() => {
					DTO.from(dataWithMissingFields, testSchema);
				}).toThrowError(
					new ValidationError(
						'validation errors:\nid:\n- value is required\n- value must be a number\nname:\n- value is required\n- value must be a string'
					)
				);
			});
		});
		describe('when a value of a data is null but it should not be', () => {
			it('throws a validation error', () => {
				const dataWithNullName = { ...testData, name: null };
				expect(() => {
					DTO.from(dataWithNullName, testSchema);
				}).toThrowError(new ValidationError('validation errors:\nname:\n- value cannot be null'));
			});
		});
		describe('when data fields are invalid', () => {});
		describe('when data and schema are valid', () => {
			it('returns a validated DTO', () => {
				expect(DTO.from(testData, testSchema)).toEqual({ ...testData, date: new Date('November 7, 2024') });
			});
		});
	});
});

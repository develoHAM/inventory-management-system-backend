import { DTOFieldSchemas } from 'types/IDTO';

export const responseProductCategoryDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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
			allowSpaces: true,
			maximumLength: 50,
		},
	},
	{
		fieldName: 'description',
		fieldType: 'string',
		isRequired: true,
		allowNull: true,
		fieldConstraints: {
			allowSpaces: true,
		},
	},
];

export const idProductCategoryDTOSchema: DTOFieldSchemas<'number'> = [
	{
		fieldName: 'id',
		fieldType: 'number',
		isRequired: true,
		allowNull: false,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
];

export const readProductCategoryDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
	{
		fieldName: 'id',
		fieldType: 'number',
		isRequired: false,
		allowNull: false,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
	{
		fieldName: 'name',
		fieldType: 'string',
		isRequired: false,
		allowNull: false,
		fieldConstraints: {
			allowSpaces: true,
			maximumLength: 50,
		},
	},
	{
		fieldName: 'description',
		fieldType: 'string',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			allowSpaces: true,
		},
	},
];

export const createProductCategoryDTOSchema: DTOFieldSchemas<'string'> = [
	{
		fieldName: 'name',
		fieldType: 'string',
		isRequired: true,
		allowNull: false,
		fieldConstraints: {
			allowSpaces: true,
			maximumLength: 50,
		},
	},
	{
		fieldName: 'description',
		fieldType: 'string',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			allowSpaces: true,
		},
	},
];

export const updateProductCategoryDTOSchema: DTOFieldSchemas<'string'> = [
	{
		fieldName: 'name',
		fieldType: 'string',
		isRequired: false,
		allowNull: false,
		fieldConstraints: {
			allowSpaces: true,
			maximumLength: 50,
		},
	},
	{
		fieldName: 'description',
		fieldType: 'string',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			allowSpaces: true,
		},
	},
];

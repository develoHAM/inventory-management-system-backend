import { DTOFieldSchemas } from 'types/IDTO';

export const responseProductBrandDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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

export const idProductBrandDTOSchema: DTOFieldSchemas<'number'> = [
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

export const readProductBrandDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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

export const createProductBrandDTOSchema: DTOFieldSchemas<'string'> = [
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

export const updateProductBrandDTOSchema: DTOFieldSchemas<'string'> = [
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

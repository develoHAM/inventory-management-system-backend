import { DTOFieldSchemas } from 'types/IDTO';

export const responseWarehouseDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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
		fieldName: 'store_branch',
		fieldType: 'number',
		isRequired: true,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
];

export const idWarehouseDTOSchema: DTOFieldSchemas<'number'> = [
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

export const readWarehouseDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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
		fieldName: 'store_branch',
		fieldType: 'number',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
];

export const createWarehouseDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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
		fieldName: 'store_branch',
		fieldType: 'number',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
];

export const updateWarehouseDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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
		fieldName: 'store_branch',
		fieldType: 'number',
		isRequired: true,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
];

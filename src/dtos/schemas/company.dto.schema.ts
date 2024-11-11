import { DTOFieldSchemas } from 'types/IDTO';

export const responseCompanyDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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

export const idCompanyDTOSchema: DTOFieldSchemas<'number'> = [
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

export const readCompanyDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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

export const createCompanyDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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

export const updateCompanyDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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

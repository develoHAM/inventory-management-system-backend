import { DTOFieldSchemas } from 'types/IDTO';

export const responseStoreManagerDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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
		fieldName: 'company',
		fieldType: 'number',
		isRequired: true,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
];

export const idStoreManagerDTOSchema: DTOFieldSchemas<'number'> = [
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

export const readStoreManagerDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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
			allowSpaces: false,
			maximumLength: 50,
			minimumLength: 2,
		},
	},
	{
		fieldName: 'phone',
		fieldType: 'string',
		isRequired: false,
		allowNull: false,
		fieldConstraints: {
			allowSpaces: false,
			maximumLength: 13,
			minimumLength: 12,
			regexPattern: /^01[016789]-\d{3,4}-\d{4}$/,
		},
	},
	{
		fieldName: 'company',
		fieldType: 'number',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
];

export const createStoreManagerDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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
		fieldName: 'company',
		fieldType: 'number',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
];

export const updateStoreManagerDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
	{
		fieldName: 'name',
		fieldType: 'string',
		isRequired: false,
		allowNull: false,
		fieldConstraints: {
			allowSpaces: false,
			maximumLength: 50,
			minimumLength: 2,
		},
	},
	{
		fieldName: 'phone',
		fieldType: 'string',
		isRequired: false,
		allowNull: false,
		fieldConstraints: {
			allowSpaces: false,
			maximumLength: 13,
			minimumLength: 12,
			regexPattern: /^01[016789]-\d{3,4}-\d{4}$/,
		},
	},
	{
		fieldName: 'company',
		fieldType: 'number',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
];

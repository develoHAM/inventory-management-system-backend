import { DTOFieldSchemas } from 'types/IDTO';

export const responseStoreBranchDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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
		fieldName: 'location',
		fieldType: 'string',
		isRequired: true,
		allowNull: false,
		fieldConstraints: {
			allowSpaces: true,
			maximumLength: 255,
		},
	},
	{
		fieldName: 'store_manager',
		fieldType: 'number',
		isRequired: true,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
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

export const idStoreBranchDTOSchema: DTOFieldSchemas<'number'> = [
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

export const readStoreBranchDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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
		fieldName: 'location',
		fieldType: 'string',
		isRequired: false,
		allowNull: false,
		fieldConstraints: {
			allowSpaces: true,
			maximumLength: 255,
		},
	},
	{
		fieldName: 'store_manager',
		fieldType: 'number',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
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

export const createStoreBranchDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
	{
		fieldName: 'location',
		fieldType: 'string',
		isRequired: true,
		allowNull: false,
		fieldConstraints: {
			allowSpaces: true,
			maximumLength: 255,
		},
	},
	{
		fieldName: 'store_manager',
		fieldType: 'number',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
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

export const updateStoreBranchDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
	{
		fieldName: 'location',
		fieldType: 'string',
		isRequired: false,
		allowNull: false,
		fieldConstraints: {
			allowSpaces: true,
			maximumLength: 255,
		},
	},
	{
		fieldName: 'store_manager',
		fieldType: 'number',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
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

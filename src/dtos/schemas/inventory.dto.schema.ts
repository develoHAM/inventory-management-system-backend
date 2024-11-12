import { DTOFieldSchemas } from 'types/IDTO';

export const responseInventoryDTOSchema: DTOFieldSchemas<'string' | 'number' | 'date'> = [
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
			maximumLength: 255,
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
	{
		fieldName: 'file_url',
		fieldType: 'string',
		isRequired: true,
		allowNull: true,
		fieldConstraints: {
			allowSpaces: false,
		},
	},
	{
		fieldName: 'created_at',
		fieldType: 'date',
		isRequired: true,
		allowNull: false,
		fieldConstraints: {},
	},
	{
		fieldName: 'updated_at',
		fieldType: 'date',
		isRequired: true,
		allowNull: false,
		fieldConstraints: {},
	},
];

export const idInventoryDTOSchema: DTOFieldSchemas<'number'> = [
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

export const readInventoryDTOSchema: DTOFieldSchemas<'string' | 'number' | 'date'> = [
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
			maximumLength: 255,
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
	{
		fieldName: 'file_url',
		fieldType: 'string',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			allowSpaces: false,
		},
	},
	{
		fieldName: 'created_at',
		fieldType: 'date',
		isRequired: false,
		allowNull: false,
		fieldConstraints: {},
	},
	{
		fieldName: 'updated_at',
		fieldType: 'date',
		isRequired: false,
		allowNull: false,
		fieldConstraints: {},
	},
];

export const createInventoryDTOSchema: DTOFieldSchemas<'string' | 'number' | 'date'> = [
	{
		fieldName: 'name',
		fieldType: 'string',
		isRequired: true,
		allowNull: false,
		fieldConstraints: {
			allowSpaces: true,
			maximumLength: 255,
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
	{
		fieldName: 'file_url',
		fieldType: 'string',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			allowSpaces: false,
		},
	},
	{
		fieldName: 'created_at',
		fieldType: 'date',
		isRequired: false,
		allowNull: false,
		fieldConstraints: {},
	},
	{
		fieldName: 'updated_at',
		fieldType: 'date',
		isRequired: false,
		allowNull: false,
		fieldConstraints: {},
	},
];

export const updateInventoryDTOSchema: DTOFieldSchemas<'string' | 'number' | 'date'> = [
	{
		fieldName: 'name',
		fieldType: 'string',
		isRequired: false,
		allowNull: false,
		fieldConstraints: {
			allowSpaces: true,
			maximumLength: 255,
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
	{
		fieldName: 'file_url',
		fieldType: 'string',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			allowSpaces: false,
		},
	},
	{
		fieldName: 'created_at',
		fieldType: 'date',
		isRequired: false,
		allowNull: false,
		fieldConstraints: {},
	},
	{
		fieldName: 'updated_at',
		fieldType: 'date',
		isRequired: false,
		allowNull: false,
		fieldConstraints: {},
	},
];

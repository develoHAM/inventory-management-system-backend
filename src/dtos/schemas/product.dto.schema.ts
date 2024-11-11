import { DTOFieldSchemas } from 'types/IDTO';

export const responseProductDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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
		fieldName: 'color',
		fieldType: 'string',
		isRequired: true,
		allowNull: true,
		fieldConstraints: {
			allowSpaces: true,
			maximumLength: 255,
		},
	},

	{
		fieldName: 'product_brand',
		fieldType: 'number',
		isRequired: true,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
	{
		fieldName: 'product_category',
		fieldType: 'number',
		isRequired: true,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
	{
		fieldName: 'price',
		fieldType: 'number',
		isRequired: true,
		allowNull: false,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
	{
		fieldName: 'image_url',
		fieldType: 'string',
		isRequired: true,
		allowNull: true,
		fieldConstraints: {
			allowSpaces: false,
		},
	},
	{
		fieldName: 'code',
		fieldType: 'string',
		isRequired: true,
		allowNull: false,
		fieldConstraints: {
			maximumLength: 13,
			minimumLength: 13,
			allowSpaces: false,
		},
	},
];

export const idProductDTOSchema: DTOFieldSchemas<'number'> = [
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

export const readProductDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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
		fieldName: 'color',
		fieldType: 'string',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			allowSpaces: true,
			maximumLength: 255,
		},
	},

	{
		fieldName: 'product_brand',
		fieldType: 'number',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
	{
		fieldName: 'product_category',
		fieldType: 'number',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
	{
		fieldName: 'price',
		fieldType: 'number',
		isRequired: false,
		allowNull: false,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
	{
		fieldName: 'image_url',
		fieldType: 'string',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			allowSpaces: false,
		},
	},
	{
		fieldName: 'code',
		fieldType: 'string',
		isRequired: false,
		allowNull: false,
		fieldConstraints: {
			maximumLength: 13,
			minimumLength: 13,
			allowSpaces: false,
		},
	},
];

export const createProductDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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
		fieldName: 'color',
		fieldType: 'string',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			allowSpaces: true,
			maximumLength: 255,
		},
	},

	{
		fieldName: 'product_brand',
		fieldType: 'number',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
	{
		fieldName: 'product_category',
		fieldType: 'number',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
	{
		fieldName: 'price',
		fieldType: 'number',
		isRequired: true,
		allowNull: false,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
	{
		fieldName: 'image_url',
		fieldType: 'string',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			allowSpaces: false,
		},
	},
	{
		fieldName: 'code',
		fieldType: 'string',
		isRequired: true,
		allowNull: false,
		fieldConstraints: {
			maximumLength: 13,
			minimumLength: 13,
			allowSpaces: false,
		},
	},
];

export const updateProductDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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
		fieldName: 'color',
		fieldType: 'string',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			allowSpaces: true,
			maximumLength: 255,
		},
	},

	{
		fieldName: 'product_brand',
		fieldType: 'number',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
	{
		fieldName: 'product_category',
		fieldType: 'number',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
	{
		fieldName: 'price',
		fieldType: 'number',
		isRequired: false,
		allowNull: false,
		fieldConstraints: {
			minimumValue: 1,
		},
	},
	{
		fieldName: 'image_url',
		fieldType: 'string',
		isRequired: false,
		allowNull: true,
		fieldConstraints: {
			allowSpaces: false,
		},
	},
	{
		fieldName: 'code',
		fieldType: 'string',
		isRequired: false,
		allowNull: false,
		fieldConstraints: {
			maximumLength: 13,
			minimumLength: 13,
			allowSpaces: false,
		},
	},
];

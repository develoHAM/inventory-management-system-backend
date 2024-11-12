import { UserType } from 'models/user.model';
import { DTOFieldSchemas } from 'types/IDTO';

export const responseUserDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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
			maximumLength: 60,
			minimumLength: 60,
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
];

export const idUserDTOSchema: DTOFieldSchemas<'number'> = [
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

export const usernameUserDTOSchema: DTOFieldSchemas<'string'> = [
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
];

export const readUserDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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
		fieldName: 'username',
		fieldType: 'string',
		isRequired: false,
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
		isRequired: false,
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
		fieldName: 'user_type',
		fieldType: 'string',
		isRequired: false,
		allowNull: false,
		fieldConstraints: {
			allowSpaces: false,
			enumValues: [UserType.ADMIN, UserType.STORE_ADMIN, UserType.STORE_STAFF],
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

export const createUserDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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
			minimumLength: 8,
			maximumLength: 20,
			// at least 1 special character, number, smaller case letter, upper case letter
			regexPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]+$/,
		},
	},
	{
		fieldName: 'user_type',
		fieldType: 'string',
		isRequired: false,
		allowNull: false,
		fieldConstraints: {
			allowSpaces: false,
			enumValues: [UserType.ADMIN, UserType.STORE_ADMIN, UserType.STORE_STAFF],
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

export const updateUserDTOSchema: DTOFieldSchemas<'string' | 'number'> = [
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
];

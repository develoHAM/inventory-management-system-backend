import { IModel } from './IModel';

export type CreateDTO<ModelType extends IModel> = Omit<ModelType, 'id'>;

export type UpdateDTO<ModelType extends IModel> = Partial<Omit<ModelType, 'id'>>;

export type ReadDTO<ModelType extends IModel> = Partial<ModelType>;

export type ResponseDTO<ModelType extends IModel> = ModelType;

export type IdDTO<ModelType extends IModel> = Pick<ModelType, 'id'>;

export type CommonValidation = {
	isRequired: boolean;
	allowNull: boolean;
};

export type EnumValidation<T> = {
	enumValues?: T[];
};

export type StringTypeValidation = {
	allowSpaces: boolean;
	maximumLength?: number;
	minimumLength?: number;
	regexPattern?: RegExp;
} & EnumValidation<string>;

export type NumberTypeValidation = {
	maximumValue?: number;
	minimumValue?: number;
} & EnumValidation<number>;

export type DateTypeValidation = {
	minimumDate?: Date;
	maximumDate?: Date;
};

export type DTOFieldSchema<T> = T extends 'string'
	? { fieldName: string; fieldType: 'string'; fieldConstraints?: StringTypeValidation } & CommonValidation
	: T extends 'number'
	? { fieldName: string; fieldType: 'number'; fieldConstraints?: NumberTypeValidation } & CommonValidation
	: T extends 'date'
	? { fieldName: string; fieldType: 'date'; fieldConstraints?: DateTypeValidation } & CommonValidation
	: never;

export type DTOFieldSchemas<T> = Array<DTOFieldSchema<T>>;

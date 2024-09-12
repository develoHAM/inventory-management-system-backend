export interface IModel {
	id: number;
}

export type createModel<ModelType extends IModel> = Omit<ModelType, 'id'>;

export type updateModel<ModelType extends IModel> = Partial<Omit<ModelType, 'id'>>;

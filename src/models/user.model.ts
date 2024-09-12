import { IModel } from 'interfaces/IModel';

export enum UserType {
	ADMIN = 'admin',
	USER = 'user',
	STORE_ADMIN = 'store_admin',
}

export interface UserModel extends IModel {
	name: string;
	username: string;
	email: string;
	phone: string;
	password: string;
	user_type: UserType;
	company?: number | null;
	store_branch?: number | null;
}

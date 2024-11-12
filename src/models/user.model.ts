import { IModel } from 'types/IModel';

export enum UserType {
	ADMIN = 'ADMIN',
	STORE_STAFF = 'STORE_STAFF',
	STORE_ADMIN = 'STORE_ADMIN',
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

import { IModel } from 'types/IModel';

export interface ProductModel extends IModel {
	name: string;
	color?: string | null;
	product_brand?: number | null;
	product_category?: number | null;
	price: number;
	image_url?: string | null;
	code: string;
}

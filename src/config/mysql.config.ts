import { ConnectionOptions } from 'mysql2';

type TableOrderType = string[];

export const mysqlConfig: ConnectionOptions = {
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	port: Number(process.env.MYSQL_PORT),
	connectionLimit: 10,
	waitForConnections: true,
};

export const tableInitializationOrder: TableOrderType = [
	'product_brand.sql',
	'product_category.sql',
	'company.sql',
	'inventory.sql',
	'store_manager.sql',
	'warehouse.sql',
	'product.sql',
	'store_branch.sql',
	'user.sql',
	'product_inventory.sql',
];

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
	timezone: '+09:00',
};

export const tableInitializationOrder: TableOrderType = [
	'product_brand.sql',
	'product_category.sql',
	'company.sql',
	'inventory.sql',
	'store_manager.sql',
	'product.sql',
	'store_branch.sql',
	'warehouse.sql',
	'user.sql',
	'product_inventory.sql',
];

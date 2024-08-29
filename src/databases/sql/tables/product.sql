CREATE TABLE IF NOT EXISTS product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(255),
    product_brand INT,
    product_category INT,
    price INT NOT NULL,
    image_url TEXT,
    code CHAR(13) UNIQUE NOT NULL,
    FOREIGN KEY (product_brand) REFERENCES product_brand(id) ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (product_category) REFERENCES product_category(id) ON UPDATE CASCADE ON DELETE SET NULL
);
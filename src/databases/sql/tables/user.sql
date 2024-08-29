CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone CHAR(13) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role ENUM('admin','store_admin', 'user') NOT NULL DEFAULT 'user',
    company INT,
    store_branch INT,
    FOREIGN KEY (company) REFERENCES company(id) ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (store_branch) REFERENCES store_branch(id) ON UPDATE CASCADE ON DELETE SET NULL
);

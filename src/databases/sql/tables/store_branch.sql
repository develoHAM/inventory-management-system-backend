CREATE TABLE IF NOT EXISTS store_branch (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255) NOT NULL UNIQUE,
    store_manager INT,
    FOREIGN KEY (store_manager) REFERENCES store_manager(id) ON UPDATE CASCADE ON DELETE SET NULL 
);
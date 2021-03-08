USE department_db;

DROP TABLE roles;

CREATE TABLE IF NOT EXISTS roles(
	id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(8,2) NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);
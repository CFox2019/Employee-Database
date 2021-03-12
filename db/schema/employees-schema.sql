USE employee_db;

CREATE TABLE IF NOT EXISTS employees(
	id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
	last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCEs employees(id)
);
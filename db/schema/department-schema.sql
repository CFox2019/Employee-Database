-- schema file
DROP DATABASE IF EXISTS	employee_db;

CREATE DATABASE employee_db;

USE employee_db;

DROP TABLE IF EXISTS departments;

CREATE TABLE departments(
	id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30) NOT NULL UNIQUE,
    PRIMARY KEY(id)
);
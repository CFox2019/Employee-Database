-- schema file
DROP DATABASE IF EXISTS	department_db;

CREATE DATABASE department_db;

USE department_db;

DROP TABLE IF EXISTS departments;

CREATE TABLE departments(
	id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);
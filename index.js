const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: 'tL!TYgh4VHMP',
    database: 'department_DB',
});

const start = () => {
    inquirer
        .prompt({
            name:'addViewOrUpdate',
            type: 'list',
            message: 'Would you like to add, view, or update?',
            choices: [
                'Add departments, roles, employees',
                'View departments, roles, employees',
                'Update employee roles',
                'EXIT'
            ],
        })
        .then((answer) => {
            if (answer.addViewOrUpdate === 'Add departments, roles, employees') {
                addInfo();
            } else if (answer.addViewOrUpdate === 'View departments, roles, employees') {
                viewInfo();
            } else if (answer.addViewOrUpdate === 'Update employee roles') {
                updateInfo();
            } else {
                connection.end();
            }
        });
};

// function to handle adding departments, roles, or employees
const addInfo = () => {
    inquirer
        .prompt({
            name:'addDeptRoleEmployee',
            type: 'list',
            message: 'What information would you like to add?',
            choices: [
                'Departments',
                'Roles',
                'Employees',
                'EXIT'
            ],
        })
        .then((answer) => {
            if (answer.addDeptRoleEmployee === 'Departments') {
                addDepts();
            } else if (answer.addDeptRoleEmployee === 'Roles') {
                addRoles();
            } else if (answer.addDeptRoleEmployee === 'Employees') {
                addEmployees();
            } else {
                connection.end();
            }
        });
};

const viewInfo = () => {
    inquirer
        .prompt({
            name:'viewDeptRoleEmployee',
            type: 'list',
            message: 'What information would you like to view?',
            choices: [
                'Departments',
                'Roles',
                'Employees',
                'EXIT'
            ],
        })
        .then((answer) => {
            if (answer.viewDeptRoleEmployee === 'Departments') {
                viewDepts();
            } else if (answer.viewDeptRoleEmployee === 'Roles') {
                viewRoles();
            } else if (answer.viewDeptRoleEmployee === 'Employees') {
                viewEmployees();
            } else {
                connection.end();
            }
        });
};

const updateInfo = () => {
    inquirer
        .prompt({
            name: 'updateEmployee',
            type: 'confirm',
            message: 'Is the employee a manager?'
        })
        .then((answer)=> {
            if (answer.updateEmployee === 'yes') {
                updateManager();
            } else if (answer.updateEmployee === 'no') {
                updateEmployeeRoles();
            }
        });
};

connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});
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

connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});
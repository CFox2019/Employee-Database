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
                addDept();
            } else if (answer.addDeptRoleEmployee === 'Roles') {
                addRole();
            } else if (answer.addDeptRoleEmployee === 'Employees') {
                addEmployee();
            } else {
                connection.end();
            }
        });
};

// function to handle viewing departments, roles, or employees
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
                viewDept();
            } else if (answer.viewDeptRoleEmployee === 'Roles') {
                viewRole();
            } else if (answer.viewDeptRoleEmployee === 'Employees') {
                viewEmployee();
            } else {
                connection.end();
            }
        });
};

// function to handle updating employees
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
                updateEmployeeRole();
            }
        });
};

// **** function for adding departments
const addDept = () => {
    inquirer
        .prompt({
            name: 'addDept',
            type: 'input',
            message: 'What department would you like to add?'
        })
        .then((answer) => {
            // when finished prompting, insert the department name into the db with the text input
            connection.query(
                'INSERT INTO departments SET ?',
                {

                },
                (err) => {
                    if (err) throw err;
                    console.log('Your department was added successfully!')
                    // prompt the user for if they want to add another department or exit
                    .then({
                        name: 'addDeptOrExit',
                        type: 'confirm',
                        message: 'Would you like to add another department?'
                    })
                    .then((answer) => {
                        if (answer.addDeptOrExit === 'yes') {
                            addDept();
                        } else {
                            connection.end();
                        }
                    });
                }
            )
        })
};

// **** function for adding roles
const addRole = () => {
    inquirer
        .prompt({
            name: 'addRole',
            type: 'input',
            message: 'What role would you like to add?'
        })
        .then((answer) => {
            // when finished prompting, insert the role name into the db with the text input
            connection.query(
                'INSERT INTO roles SET ?',
                {

                },
                (err) => {
                    if (err) throw err;
                    console.log('Your role was added successfully!')
                    // prompt the user for if they want to add another department or exit
                    .then({
                        name: 'addRoleOrExit',
                        type: 'confirm',
                        message: 'Would you like to add another role?'
                    })
                    .then((answer) => {
                        if (answer.addRoleOrExit === 'yes') {
                            addRole();
                        } else {
                            connection.end();
                        }
                    });
                }
            )
        })
};

// **** function for adding employees
const addEmployee = () => {
    inquirer
        .prompt(
            {
                name: 'addEmployeesFirstName',
                type: 'input',
                message: 'What is the employees first name?'
            },
            {
                name: 'addEmployeesLastName',
                type: 'input',
                message: 'What is the employees last name?'
            }
        )
        .then((answer) => {
            // when finished prompting, insert the employee name into the db with the text input
            connection.query(
                'INSERT INTO employees SET ?',
                {

                },
                (err) => {
                    if (err) throw err;
                    console.log('Your employee was added successfully!')
                    // prompt the user for if they want to add another department or exit
                    .then({
                        name: 'addEmployeeOrExit',
                        type: 'confirm',
                        message: 'Would you like to add another employee?'
                    })
                    .then((answer) => {
                        if (answer.addEmployeeOrExit === 'yes') {
                            addEmployee();
                        } else {
                            connection.end();
                        }
                    });
                }
            )
        })
};

// *** viewDepts function should display all departments that have been entered
const viewDept = () => {

};

// *** viewRoles function should display all roles
const viewRole = () => {

};

// *** viewEmployees function should display all employees with their info
const viewEmployee = () => {

};

// *** updateManager function allows the employee managers to be updated
const updateManager = () => {

}

// *** updateEmployees function allows the employees role to be entered
const updateEmployeeRole = () => {

}

connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});
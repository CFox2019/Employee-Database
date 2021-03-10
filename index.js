const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const ER_DUP_ENTRY = "ER_DUP_ENTRY"

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'tL!TYgh4VHMP',
    database: 'employee_DB',
});

const start = () => {
    inquirer
        .prompt({
            name: 'addViewOrUpdate',
            type: 'list',
            message: 'Would you like to add, view, or update information?',
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

// Adding Information

// function to handle adding departments, roles, or employees
const addInfo = () => {
    inquirer
        .prompt({
            name: 'addDeptRoleEmployee',
            type: 'list',
            message: 'What information would you like to add?',
            choices: [
                'Department',
                'Role',
                'Employee',
                'EXIT'
            ],
        })
        .then((answer) => {
            if (answer.addDeptRoleEmployee === 'Department') {
                addDept();
            } else if (answer.addDeptRoleEmployee === 'Role') {
                addRole();
            } else if (answer.addDeptRoleEmployee === 'Employee') {
                addEmployee();
            } else {
                connection.end();
            }
        });
};

// **** function for adding departments
const addDept = () => {
    connection.query('SELECT * FROM departments', (err, result) => {
        console.log("Here are the existing departments for reference:")
        console.table(result);
        inquirer
            .prompt({
                name: 'addDept',
                type: 'input',
                message: 'What is the name of the department?'
            })
            .then((answer) => {
                // when finished prompting, insert the department name into the db with the text input
                connection.query(
                    'INSERT INTO departments SET ?',
                    {
                        department_name: answer.addDept,
                    },
                    (err) => insertDeptHandler(err, answer)
                )
            })
    })
};

const insertDeptHandler = (err, answer) => {
    if (err && err.code === ER_DUP_ENTRY) {
        console.log("");
        console.log(`Sorry, ${answer.addDept} already exists!`);
        console.log("");
    }
    connection.query('SELECT * FROM departments', (err, result) => {
        console.table(result);
        start();
    })
}

// **** function for adding roles
const addRole = () => {
    inquirer
        .prompt([
            {
                name: 'addRoleTitle',
                type: 'list',
                message: 'What role would you like to add?',
                choices: [
                    'Sales Lead',
                    'Salesperson',
                    'Lead Engineer',
                    'Software Engineer',
                    'Accountant',
                    'Legal Team Lead',
                    'Lawyer'
                ],
            },
            {
                name: 'addSalary',
                type: 'list',
                message: 'What is the salary of this role?',
                choices: [
                    '80000',
                    '100000',
                    '120000',
                    '150000',
                    '190000',
                    '250000'
                ],
            },
        ])
        .then((answer) => {
            // when finished prompting, insert the role name into the db with the text input
            connection.query(
                'INSERT INTO roles SET ?',
                [
                    {
                        title: answer.addRoleTitle,
                    },
                    {
                        salary: answer.addSalary
                    },
                ],
                (err) => {
                    if (err) throw err;
                    console.log('Your role was added successfully!');
                    connection.end();
                })
        })
};

// **** function for adding employees
const addEmployee = () => {
    inquirer
        .prompt([
            {
                name: 'addFirstName',
                type: 'input',
                message: 'What is the employees first name?'
            },
            {
                name: 'addLastName',
                type: 'input',
                message: 'What is the employees last name?'
            }
        ])
        .then((answer) => {
            // when finished prompting, insert the employee name into the db with the text input
            connection.query(
                'INSERT INTO employees SET ?',
                {
                    first_name: answer.addFirstName,
                    last_name: answer.addLastName,
                },
                (err) => {
                    if (err) throw err;
                    console.log('Your employee was added successfully!');
                    connection.end();
                }
            )
        })
};

// Viewing Information

// function to handle viewing departments, roles, or employees
const viewInfo = () => {
    inquirer
        .prompt({
            name: 'viewDeptRoleEmployee',
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

// *** viewDepts function should display all departments that have been entered
const viewDept = () => {
    connection.query("SELECT * FROM departments", (err, result) => {
        if (err) throw err;
        console.table(result);
        connection.end();
    });
};

// *** viewRoles function should display all roles
const viewRole = () => {
    connection.query("SELECT * FROM roles", (err, result) => {
        if (err) throw err;
        console.table(result);
        connection.end();
    });
};

//  viewEmployees function should display all employees with their info
const viewEmployee = () => {
    connection.query("SELECT * FROM employees", (err, result) => {
        if (err) throw err;
        console.table(result);
        connection.end();
    });
};


    // Updating employee roles

    // function to handle updating employees
    const updateInfo = () => {
        connection.query("SELECT * FROM employees", (err, result) => {
            const employees = result.map((employee) => {
                return `${employee.id}: ${employee.first_name} ${employee.last_name}`
            })
            connection.query("SELECT * FROM roles", (err, result) => {
                const roles = result.map((role) => {
                    return `${role.role_id}: ${role.title}`
                })
            })
            inquirer
                .prompt([
                    {
                        name: 'updateEmployee',
                        type: 'list',
                        message: 'Which employee role do you need to update?',
                        choices: employees,
                    },
                    {
                        name: 'updateEmployeeRole',
                        type: 'list',
                        message: 'What is the employees updated role title?',
                        choices: roles,
                    },
                ])
                .then((answer) => {
                    let updateEmployee;
                    results.forEach((employee) => {
                        if (updateEmployee.employees === answer.role) {
                            connection.query(
                                "UPDATE employee SET ?",
                                {
                                    role: answer.title
                                }
                            );
                        }
                    })
                });
        })
    }

// *** updateManager function allows the employees manager to be updated
const updateEmployeesManager = () => {

};

// *** updateEmployees function allows the employees role to be entered
const updateEmployeeRole = () => {

};

connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});
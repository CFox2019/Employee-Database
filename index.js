const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'tL!TYgh4VHMP',
    database: 'employee_DB',
});

// initial questions
const start = () => {
    inquirer
        .prompt({
            name: 'toDo',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'View All Employees By Department',
                'View All Employees By Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View All Roles',
                'Add Role',
                'Remove Role'
            ],
        })
        .then((answer) => {
            // based on answers, call the function
            if (answer.toDo === 'View All Employees') {
                viewAllEmployees();
            } else if (answer.toDo === 'View All Employees By Department') {
                viewEmployeeDept();
            } else if (answer.toDo === 'View All Employees By Manager') {
                viewEmployeeManager();
            } else if (answer.toDo === 'Add Employee') {
                addEmployee();
            } else if (answer.toDo === 'Remove Employee') {
                removeEmployee();
            } else if (answer.toDo === 'Update Employee Role') {
                updateEmployeeRole();
            } else if (answer.toDo === 'Update Employee Manager') {
                updateEmployeeManager();
            } else if (answer.toDo === 'View All Roles') {
                viewAllRoles();
            } else if (answer.toDo === 'Add Role') {
                addRole();
            } else if (answer.toDo === 'Remove Role') {
                removeRole();
            }
        });
};

// const viewAllEmployees = () => {
//     inquirer
//         .prompt(

//         )
//         .then((answer) => {
//             connection.query(
//                 '',
//                 {

//                 },
//                 (err) => {
//                     if (err) throw err;
//                     console.log('');
//                     start();
//                 }
//             );
//         });
// };

// const viewEmployeeDept = () => {
//     inquirer
//         .prompt(

//         )
//         .then((answer) => {
//             connection.query(
//                 '',
//                 {

//                 },
//                 (err) => {
//                     if (err) throw err;
//                     console.log('');
//                     start();
//                 }
//             );
//         });
// };

// const viewEmployeeManager = () => {
//     inquirer
//         .prompt(

//         )
//         .then((answer) => {
//             connection.query(
//                 '',
//                 {

//                 },
//                 (err) => {
//                     if (err) throw err;
//                     console.log('');
//                     start();
//                 }
//             );
//         });
// };

const addEmployee = () => {
    inquirer
        .prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'What is the employee\'s first name?',
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'What is the employee\'s last name?',
            },
            {
                name: 'employeeRole',
                type: 'list',
                message: 'What is the employee\'s role?',
                // list all role choices that have been added to db
                choices: [

                ],
            },
            {
                name: 'employeeManager',
                type: 'list',
                message: 'Who is the employee\'s manager?',
                // list all employees plus a none option
                choices: [

                ],
            },
        ])
        .then((answer) => {
            connection.query(
                'INSERT INTO employee SET',
                {
                    first_Name: answer.firstName,
                    last_name: answer.lastName,
                    role: answer.employee_role,
                    manager: answer.employeeManager,
                },
                (err) => {
                    if (err) throw err;
                    console.log('The employee was created successfully!');
                    start();
                }
            );
        });
};

const removeEmployee = () => {
    inquirer
        .prompt({
            name: 'removeEmployee',
            type: 'list',
            message: 'Which employee would you like to remove?',
            // list all employees
            choices: [

            ]
        })
        .then((answer) => {
            connection.query(
                'DELETE FROM employee WHERE ?',
                {

                },
                (err) => {
                    if (err) throw err;
                    console.log('');
                    start();
                }
            );
        });
};

const updateEmployeeRole = () => {
    inquirer
        .prompt([
            {
                name: 'currentRole',
                type: 'list',
                message: 'what is the employee\'s current role?',
                // list of all roles in db
                choices: [

                ],
            },
            {
                name: 'updatedRole',
                type: 'list',
                message: 'What would you like the employee\'s role to be updated to?',
                // list of all roles in db
                choices: [

                ],
            },
        ]

        )
        .then((answer) => {
            connection.query(
                'UPDATE role WHERE ?',
                {

                },
                (err) => {
                    if (err) throw err;
                    console.log('');
                    start();
                }
            );
        });
};

const updateEmployeeManager = () => {
    inquirer
        .prompt([
            {
                name: 'selectEmployee',
                type: 'list',
                message: 'Which employee\'s manager do you want to update?',
                // List of current employees
                choices: [

                ],
            },
            {
                name: 'updatedManager',
                type: 'list',
                message: 'Which employee would you like to set as a manager for the selected employee?',
                // list of employees
                choices: [

                ],
            },
        ],

        )
        .then((answer) => {
            connection.query(
                'UPDATE ',
                {

                },
                (err) => {
                    if (err) throw err;
                    console.log('');
                    start();
                }
            );
        });
};

const viewAllRoles = () => {
    inquirer
        .prompt(

        )
        .then((answer) => {
            connection.query(
                'SELECT * FROM role',
                {

                },
                (err) => {
                    if (err) throw err;
                    console.log('');
                    start();
                }
            );
        });
};

const addRole = () => {
    inquirer
        .prompt({
            name: 'addRole',
            type: 'input',
            message: 'What role would you like to add?',
        })
        .then((answer) => {
            connection.query(
                'INSERT INTO role SET ?',
                {
                    role: answer.addRole,
                },
                (err) => {
                    if (err) throw err;
                    console.log('');
                    start();
                }
            );
        });
};

const removeRole = () => {
    inquirer
        .prompt({
            name: 'removeRole',
            type: 'list',
            message: 'Which role would you like to remove?',
            // List all existing roles
            choices: [

            ],
        }

        )
        .then((answer) => {
            connection.query(
                '',
                {

                },
                (err) => {
                    if (err) throw err;
                    console.log('');
                    start();
                }
            );
        });
};

connection.connect((err) => {
        if (err) throw err;
        // run the start function after the connection is made to prompt the user
        start();
    });





// const ER_DUP_ENTRY = "ER_DUP_ENTRY"
// const roles = [
//     {
//         name: 'Sales Lead',
//         salary: '100000'
//     },
//     {
//         name: 'Salesperson',
//         salary: '80000'
//     },
//     {
//         name: 'Lead Engineer',
//         salary: '150000'
//     },
//     {
//         name: 'Software Engineer',
//         salary: '120000'
//     },
//     {
//         name: 'Accountant',
//         salary: '125000'
//     },
//     {
//         name: 'Legal Team Lead',
//         salary: '250000'
//     },
//     {
//         name: 'Lawyer',
//         salary: '190000'
//     },
// ]

// const connection = mysql.createConnection({
//     host: 'localhost',
//     port: 3306,
//     user: 'root',
//     password: 'tL!TYgh4VHMP',
//     database: 'employee_DB',
// });

// const start = () => {
//     inquirer
//         .prompt({
//             name: 'addViewOrUpdate',
//             type: 'list',
//             message: 'Would you like to add, view, or update information?',
//             choices: [
//                 'Add departments, roles, employees',
//                 'View departments, roles, employees',
//                 'Update employee roles',
//                 'EXIT'
//             ],
//         })
//         .then((answer) => {
//             if (answer.addViewOrUpdate === 'Add departments, roles, employees') {
//                 addInfo();
//             } else if (answer.addViewOrUpdate === 'View departments, roles, employees') {
//                 viewInfo();
//             } else if (answer.addViewOrUpdate === 'Update employee roles') {
//                 updateInfo();
//             } else {
//                 connection.end();
//             }
//         });
// };

// // Adding Information

// // function to handle adding departments, roles, or employees
// const addInfo = () => {
//     inquirer
//         .prompt({
//             name: 'addDeptRoleEmployee',
//             type: 'list',
//             message: 'What information would you like to add?',
//             choices: [
//                 'Department',
//                 'Role',
//                 'Employee',
//                 'EXIT'
//             ],
//         })
//         .then((answer) => {
//             if (answer.addDeptRoleEmployee === 'Department') {
//                 addDept();
//             } else if (answer.addDeptRoleEmployee === 'Role') {
//                 addRoleFlow();
//             } else if (answer.addDeptRoleEmployee === 'Employee') {
//                 addEmployee();
//             } else {
//                 connection.end();
//             }
//         });
// };

// // **** function for adding departments
// const addDept = () => {
//     connection.query('SELECT * FROM departments', (err, result) => {
//         console.log("Here are the existing departments for reference:")
//         console.table(result);
//         inquirer
//             .prompt({
//                 name: 'addDept',
//                 type: 'input',
//                 message: 'What is the name of the department?'
//             })
//             .then((answer) => {
//                 // when finished prompting, insert the department name into the db with the text input
//                 // if the department name already exists, the user will be notified that the name already exists
//                 connection.query(
//                     'INSERT INTO departments SET ?',
//                     {
//                         department_name: answer.addDept,
//                     },
//                     (err) => insertDeptHandler(err, answer)
//                 )
//             })
//     })
// };

// const insertDeptHandler = (err, answer) => {
//     if (err && err.code === ER_DUP_ENTRY) {
//         console.log("");
//         console.log(`Sorry, ${answer.addDept} already exists!`);
//         console.log("");
//     }
//     connection.query('SELECT * FROM departments', (err, result) => {
//         console.table(result);
//         start();
//     })
// }

// // **** function for adding roles
// const addRoleFlow = () => {
//     connection.query('SELECT * FROM departments', (err, result) => {
//         inquirer
//             .prompt({
//                 name: 'deptId',
//                 type: 'list',
//                 message: 'What department should the role be associated with?',
//                 choices: result.map((department) => {
//                     return {
//                         name: department.department_name,
//                         value: department.id
//                     }
//                 })
//             })
//             .then((answer) => {
//                 addRole(answer.deptId);
//             });
//     });
// };

// const addRole = (deptId) => {
//     // 1. Ask user what department they want to assign the role to
//     // 2. hold a reference to the deparment ID for the dept the user selects
//     // 3. Use that to assign the department_id field in your role INSERT statement below

//     inquirer
//         .prompt([{
//             name: 'addRoleName',
//             type: 'list',
//             message: 'What role would you like to add?',
//             choices: roles.map((role) => role.name)
//         }])
//         .then((answer) => {
//             const selectedRole = roles.find((role) => role.name === answer.addRoleName)
//             connection.query('INSERT INTO roles SET ?',
//                 {
//                     title: selectedRole.name,
//                     salary: selectedRole.salary,
//                     department_id: deptId
//                 },
//                 (err) => {
//                     if (err) throw err;
//                     console.log('Your role was added successfully!');
//                     connection.end();
//                 })
//         })
// };

// // **** function for adding employees
// const addEmployee = () => {
//     inquirer
//         .prompt([
//             {
//                 name: 'addFirstName',
//                 type: 'input',
//                 message: 'What is the employees first name?'
//             },
//             {
//                 name: 'addLastName',
//                 type: 'input',
//                 message: 'What is the employees last name?'
//             }
//         ])
//         .then((answer) => {
//             // when finished prompting, insert the employee name into the db with the text input
//             connection.query(
//                 'INSERT INTO employees SET ?',
//                 {
//                     first_name: answer.addFirstName,
//                     last_name: answer.addLastName,
//                 },
//                 (err) => {
//                     if (err) throw err;
//                     console.log('Your employee was added successfully!');
//                     connection.end();
//                 }
//             )
//         })
// };

// // Viewing Information

// // function to handle viewing departments, roles, or employees
// const viewInfo = () => {
//     inquirer
//         .prompt({
//             name: 'viewDeptRoleEmployee',
//             type: 'list',
//             message: 'What information would you like to view?',
//             choices: [
//                 'Departments',
//                 'Roles',
//                 'Employees',
//                 'EXIT'
//             ],
//         })
//         .then((answer) => {
//             if (answer.viewDeptRoleEmployee === 'Departments') {
//                 viewDept();
//             } else if (answer.viewDeptRoleEmployee === 'Roles') {
//                 viewRole();
//             } else if (answer.viewDeptRoleEmployee === 'Employees') {
//                 viewEmployee();
//             } else {
//                 connection.end();
//             }
//         });
// };

// // *** viewDepts function should display all departments that have been entered
// const viewDept = () => {
//     connection.query("SELECT * FROM departments", (err, result) => {
//         if (err) throw err;
//         console.table(result);
//         connection.end();
//     });
// };

// // *** viewRoles function should display all roles
// const viewRole = () => {
//     connection.query("SELECT * FROM roles", (err, result) => {
//         if (err) throw err;
//         console.table(result);
//         connection.end();
//     });
// };

// //  viewEmployees function should display all employees with their info
// const viewEmployee = () => {
//     connection.query("SELECT * FROM employees", (err, result) => {
//         if (err) throw err;
//         console.table(result);
//         connection.end();
//     });
// };


//     // Updating employee roles

//     // function to handle updating employees
//     const updateInfo = () => {
//         connection.query("SELECT * FROM employees", (err, result) => {
//             const employees = result.map((employee) => {
//                 return `${employee.id}: ${employee.first_name} ${employee.last_name}`
//             })
//             connection.query("SELECT * FROM roles", (err, result) => {
//                 const roles = result.map((role) => {
//                     return `${role.role_id}: ${role.title}`
//                 })
//             })
//             inquirer
//                 .prompt([
//                     {
//                         name: 'updateEmployee',
//                         type: 'list',
//                         message: 'Which employee role do you need to update?',
//                         choices: employees,
//                     },
//                     {
//                         name: 'updateEmployeeRole',
//                         type: 'list',
//                         message: 'What is the employees updated role title?',
//                         choices: roles,
//                     },
//                 ])
//                 .then((answer) => {
//                     let updateEmployee;
//                     results.forEach((employee) => {
//                         if (updateEmployee.employees === answer.role) {
//                             connection.query(
//                                 "UPDATE employee SET ?",
//                                 {
//                                     role: answer.title
//                                 }
//                             );
//                         }
//                     })
//                 });
//         })
//     }

// // *** updateManager function allows the employees manager to be updated
// const updateEmployeesManager = () => {

// };

// // *** updateEmployees function allows the employees role to be entered
// const updateEmployeeRole = () => {

// };

// connection.connect((err) => {
//     if (err) throw err;
//     // run the start function after the connection is made to prompt the user
//     start();
// });
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

// Database Query Utility for using Promises
const query = (query, params = null) => {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}


// initial questions
const beginQuestions = () => {
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

const viewAllEmployees = () => {
    query(
        'SELECT employees.id, employees.first_name, employees.last_name, manager.id as manager_id, manager.first_name as manager_first_name, manager.last_name as manager_last_name, roles.id as role_id, roles.title as title, departments.id as dept_id, departments.department_name as department ' +
        'FROM employees ' +
        'LEFT JOIN employees as manager ON manager.id = employees.manager_id ' +
        'INNER JOIN roles ON roles.id = employees.role_id ' +
        'INNER JOIN departments ON departments.id = roles.department_id'
    )
    .then((result) => {
        if (result.length === 0) {
            console.log('There are no employees!')
        } else {
            console.table(result);
        }
        beginQuestions();
    })
    .catch((err) => console.log(err));
};

const viewEmployeeDept = () => {
    query('SELECT * FROM departments')
    .then((departments) => {
        return inquirer
            .prompt({
                name: 'deptId',
                type: 'list',
                message: 'What employee department would you like to view?',
                choices: departments.map((dept) => {
                    return {
                        name: dept.department_name,
                        value: dept.id
                    }
                }),
            })
    })
    .then((answer) => {
        return query(
            'SELECT employees.id, employees.first_name, employees.last_name, manager.id as manager_id, manager.first_name as manager_first_name, manager.last_name as manager_last_name, roles.id as role_id, roles.title as title, departments.id as dept_id, departments.department_name as department ' +
            'FROM employees ' +
            'LEFT JOIN employees as manager ON manager.id = employees.manager_id ' +
            'INNER JOIN roles ON roles.id = employees.role_id ' +
            'INNER JOIN departments ON departments.id = roles.department_id ' +
            'WHERE departments.id = ?',
            [answer.deptId]
        )
    })
    .then((result) => {
        console.log('')
        if (result.length === 0) {
            console.log('There are no employees!')
        } else {
            console.table(result);
        }
        console.log('')
        beginQuestions();
    })
    .catch((err) => console.log(err));
};

const viewEmployeeManager = () => {
    query('SELECT * FROM employees')
    .then((employees) => {
        return inquirer
            .prompt({
                name: 'managerId',
                type: 'list',
                message: 'Choose a manager',
                choices: employees.map((employee) => {
                    return {
                        name: `${employee.first_name} ${employee.last_name}`,
                        value: employee.id
                    }
                }),
            })
    })
    .then((answer) => {
        return query(
            'SELECT employees.id, employees.first_name, employees.last_name, manager.id as manager_id, manager.first_name as manager_first_name, manager.last_name as manager_last_name, roles.id as role_id, roles.title as title, departments.id as dept_id, departments.department_name as department ' +
            'FROM employees ' +
            'LEFT JOIN employees as manager ON manager.id = employees.manager_id ' +
            'INNER JOIN roles ON roles.id = employees.role_id ' +
            'INNER JOIN departments ON departments.id = roles.department_id ' +
            'WHERE manager.id = ?',
            [answer.managerId]
        )
    })
    .then((result) => {
        console.log('')
        if (result.length === 0) {
            console.log('There are no employees!')
        } else {
            console.table(result);
        }
        console.log('')
        beginQuestions();
    })
    .catch((err) => console.log(err));
};

const addEmployee = () => {
    Promise.all([
        query('SELECT * FROM employees'),
        query('SELECT * FROM roles')
    ]).then((result) => {
        return inquirer
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
                    choices: result[1].map((role) => {
                        return {
                            name: role.title,
                            value: role.id
                        }
                    }),
                },
                {
                    name: 'employeeManager',
                    type: 'list',
                    message: 'Who is the employee\'s manager?',
                    when: result[0].length > 0,
                    choices: result[0].map((employee) => {
                        return {
                            name: `${employee.first_name} ${employee.last_name}`,
                            value: employee.id
                        }
                    }),
                },
            ])
    })
    .then((answer) => {
        return query(
            'INSERT INTO employees SET ?',
            {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role_id: answer.employeeRole,
                manager_id: answer.employeeManager
            }
        )
    })
    .then(() => beginQuestions())
    .catch((err) => console.log(err));
};

const removeEmployee = () => {
    query('SELECT * FROM employees')
    .then((employees) => {
        return inquirer
            .prompt({
                name: 'employeeId',
                type: 'list',
                message: 'Which employee would you like to remove?',
                choices: employees.map((employee) => {
                    return {
                        name: `${employee.first_name} ${employee.last_name}`,
                        value: employee.id
                    }
                }),
            })
    })
    .then((answer) => query('DELETE FROM employees WHERE employees.id = ?', [answer.employeeId]))
    .then(() => beginQuestions())
    .catch((err) => console.log(err));
};

const updateEmployeeRole = () => {
    Promise.all([
        query('SELECT * FROM employees'),
        query('SELECT * FROM roles')
    ])
    .then((result) => {
        return inquirer
            .prompt([
                {
                    name: 'employeeId',
                    type: 'list',
                    message: 'Which employee would you like to update?',
                    choices: result[0].map((employee) => {
                        return {
                            name: `${employee.first_name} ${employee.last_name}`,
                            value: employee.id
                        }
                    }),
                },
                {
                    name: 'roleId',
                    type: 'list',
                    message: 'What is the employees new role?',
                    choices: result[1].map((role) => {
                        return {
                            name: role.title,
                            value: role.id
                        }
                    }),
                }
            ])
    })
    .then((answer) => query('UPDATE employees SET ? WHERE employees.id = ?', [
        { role_id: answer.roleId },
        answer.employeeId
    ]))
    .then(() => beginQuestions())
    .catch((err) => console.log(err));
};

const updateEmployeeManager = () => {
    query('SELECT * FROM employees')
    .then((employees) => {
        const choices = employees.map((employee) => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }
        })
        return inquirer
            .prompt([
                {
                    name: 'employeeId',
                    type: 'list',
                    message: 'Which employee would you like to update?',
                    choices: choices,
                },
                {
                    name: 'managerId',
                    type: 'list',
                    message: 'Who is the employees new manager?',
                    choices: choices,
                }
            ])
    })
    .then((answer) => query('UPDATE employees SET ? WHERE employees.id = ?', [
        { manager_id: answer.managerId },
        answer.employeeId
    ]))
    .then(() => beginQuestions())
    .catch((err) => console.log(err));
};

const viewAllRoles = () => {
    query(
        'SELECT roles.id as role_id, roles.title as title, departments.id as dept_id, departments.department_name as department ' +
        'FROM roles ' +
        'INNER JOIN departments ON departments.id = roles.department_id'
    )
    .then((result) => {
        if (result.length === 0) {
            console.log('There are no employees!')
        } else {
            console.table(result);
        }
        beginQuestions();
    })
    .catch((err) => console.log(err));
};

const addRole = () => {
    query('SELECT * FROM departments')
    .then((departments) => {
        const choices = departments.map((dept) => {
            return {
                name: dept.department_name,
                value: dept.id
            }
        })
        return inquirer
            .prompt([
                {
                    name: 'roleTitle',
                    type: 'input',
                    message: 'What is the title of the role?'
                },
                {
                    name: 'roleSalary',
                    type: 'input',
                    message: 'What is the salary for this role?'
                },
                {
                    name: 'deptId',
                    type: 'list',
                    message: 'Which department does the role belong to?',
                    choices: choices
                }
            ])
    })
    .then((answer) => query('INSERT INTO roles SET ?', {
        title: answer.roleTitle,
        salary: answer.roleSalary,
        department_id: answer.deptId
    }))
    .then(() => beginQuestions())
    .catch((err) => console.log(err));
};

const removeRole = () => {
    query('SELECT * FROM roles')
    .then((roles) => {
        return inquirer
            .prompt({
                name: 'roleId',
                type: 'list',
                message: 'Which role would you like to remove?',
                choices: roles.map((role) => {
                    return {
                        name: role.title,
                        value: role.id
                    }
                }),
            })
    })
    .then((answer) => query('DELETE FROM roles WHERE roles.id = ?', [answer.roleId]))
    .then(() => beginQuestions())
    .catch((err) => console.log(err));
};

connection.connect((err) => {
    if (err) throw err;
    // run the beginQuestions function after the connection is made to prompt the user
    beginQuestions();
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

// const beginQuestions = () => {
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
//         beginQuestions();
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
//     // run the beginQuestions function after the connection is made to prompt the user
//     beginQuestions();
// });
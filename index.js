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







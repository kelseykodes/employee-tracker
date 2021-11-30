const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const table = require('console.table');
const db = require('./connect/connect');

db.connect(function (error) {
  if (error) throw error;
  console.log(error);
  start();
});

function start() {
  inquirer
  .prompt({
    type: "list",
    name: "choices",
    message: "Welcome! Please select a task from the following:",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "Add A Department",
      "Add A Role",
      "Add An Employee",
      "Update A Role",
      "Quit"
    ],
  }
)
  .then((response) => {
    const {choices} = response;
  if (choices == 'View All Departments') {
    viewDepts();
  }
  if (choices == 'View All Roles') {
    viewRoles();
  }
  if (choices == 'View All Employees') {
    viewEmps();
  }
  if (choices == 'Add A Department') {
    addDept();
  }
  if (choices == 'Add A Role') {
    addRole();
  }
  if (choices == 'Add An Employee') {
    addEmp();
  }
  if (choices == 'Update A Role') {
    updatRole();
  }
  if (choices == 'Quit') {
    db.end();
    console.log('Goodbye!');
  }
});
};


// display team departments
function viewDepts() {
  console.log('Department List:');

  let query =  `SELECT * FROM department;`
  db.query(query, function (error, res) {
    if (error) throw error;
    console.table(res);
    start();
  });
}
//display team roles
function viewRoles() {
  console.log('Role List:');

  let query =  `SELECT * FROM role JOIN department;`
  db.query(query, function (error, res) {
    if (error) throw error;
    console.table(res);
    start();
  });
}
//display team employees
function viewEmps() {
  console.log('Employee List:');

  let query =
  `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;`

  db.query(query, function (error, res) {
    if (error) throw error;
    console.table(res);
    start();
  });
}


//add employee 
function addEmp() {

  let query =
    `SELECT id, title, salary FROM role;`

  db.query(query, function (err, res) {
    if (err) throw err;

    const info = res.map(({ title, salary, id }) => ({
       title: `${title}`, salary: `${salary}, `, value: id
    }));
    inquirer
    .prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'first name of new employee?'
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'last name of new employee?'
      },
      {
        type: "list",
        name: "role_id",
        message: "What is the employee's role?",
        choices: info
      },
    ])
    .then( responses => {
    const empInfo = [responses.first_name, responses.last_name, responses.role_id];
    empInfo.push(responses);
    let query = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`;
    db.query(query,empInfo, (err) => {
      if (err) throw err;

        console.table(res);
        console.log("new employee added.");
        start();
    });
    })
    console.table(res);
  });
}

function addDept() {

  var query =
    `SELECT * FROM department;`

  db.query(query, function (error, res) {
    if (error) throw error;

    const deptInfo = res.map(({ id, name }) => ({
      value: id, department_name: `${name}`
    }));

    console.table(res);
    addNewDept(deptInfo);
  });
}

function addNewDept(deptInfo) {

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'department_name',
        message: "new department name?",
        choices: deptInfo
      },
    ])
    .then(function (response) {
      let query = `INSERT INTO department SET ?`

      db.query(query,
        {
          department_name: response.department_name,
        },
        function (error, res) {
          if (error) throw error;

          console.table(res);
          console.log("new department added.");
          start();
        });
    });
}


//add a role
function addRole() {

  let query =
    `SELECT * FROM department`

  db.query(query, function (error, res) {
    if (error) throw error;

    const choices = res.map(({ department_name, id }) => ({
       name: `${department_name}`, value: id
    }));

    console.table(res);
    addNewRole(choices);
  });
}

function addNewRole(choices) {

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'title?'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'salary'
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Please select a department:',
        choices: choices
      },
    ])
    .then(function (response) {

      let query = `INSERT INTO role SET ?`

      db.query(query, {
        title: response.title,
        salary: response.salary,
        department_id: response.department_id
      },
        function (error, res) {
          if (error) throw error;

          console.table(res);

          start();
        });

    });
}

//questions 
const addingDepartment = [
  {
    type: "input",
    message: "What is the department name?",
    name: "departmentName",
  },
];

const addingRole = [
  {
    type: "input",
    message: "What is the role?",
    name: "roleName",
  },
];

const addingEmployee = [
  {
    type: "input",
    message: "What is the employee's name?",
    name: "employeeName",
  },
];

module.exports = {addingDepartment, addingRole, addingEmployee}

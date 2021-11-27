const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const table = require('console.table');
const db = require('./connect/connect');

db.connect(function (err) {
  if (err) throw err;
  console.log(err);
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
// QUERIES:

//function to display team departments
function viewDepts() {
  console.log('Department List:');

  let query =  `SELECT * FROM department;`
  db.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}
//function to display team roles
function viewRoles() {
  console.log('Role List:');

  let query =  `SELECT * FROM role JOIN department;`
  db.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}
//function to display team employees
function viewEmps() {
  console.log('Employee List:');

  let query =
  `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;`

  db.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}


//function to add employee 
function addEmp() {

  let query =
    `SELECT id, title, salary FROM role;`

  db.query(query, function (err, res) {
    if (err) throw err;

    const info = res.map(({ id, title, salary }) => ({
      value: id `${id}`, title: `${title}`, salary: `${salary}`
    }));

    console.table(res);

    addNewEmp(info);
  });
}

function addNewEmp(info) {

  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?"
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?"
      },
      {
        type: "list",
        name: "role_id",
        message: "What is the employee's role?",
        choices: info
      },
    ])
    .then(function (answers) {

      let query = `INSERT INTO employee SET ?`
      
      db.query(query,
        {
          first_name: answers.first_name,
          last_name: answers.last_name,
          role_id: answers.role_id,
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.insertedRows + "New employee added.");

          start();
        });
      
    });
}


function addDept() {

  var query =
    `SELECT * FROM department;`

  db.query(query, function (err, res) {
    if (err) throw err;

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
      // {
      //   type: "list",
      //   name: "deptid",
      //   message: "What is the id number?",
      //   choices: deptInfo
      // },
      {
        type: "input",
        name: "department_name",
        message: "What is the department name?",
        choices: deptInfo
      },
    ])
    .then(function (answer) {
      let query = `INSERT INTO department SET ?`

      db.query(query,
        {
          department_name: answer.department_name,
          // id: answer.id,
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.insertedRows + "New department added.");

          start();
        });
    });
}


// function to add a role
function addRole() {

  let query =
    `SELECT * FROM department`

  db.query(query, function (err, res) {
    if (err) throw err;

    const choices = res.map(({ id, department_name }) => ({
      value: id, name: `${department_name}`
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
        message: 'Role title?'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Role salary'
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Which Department?',
        choices: choices
      },
    ])
    .then(function (answer) {

      let query = `INSERT INTO role SET ?`

      db.query(query, {
        title: answer.title,
        salary: answer.salary,
        department_id: answer.department_id
      },
        function (err, res) {
          if (err) throw err;

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

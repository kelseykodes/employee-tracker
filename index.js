const inquirer = require('inquirer');
const express = require('express');
const path = require('path');
const fs = require('fs');
const table = require('console.table');
const db = require('./connect/connect');

db.connect(function (err) {
  if (err) throw err;
  start();
});

function start() {
  inquirer
  .prompt({
    type: "list",
    message: "Welcome! Please select a task from the following:",
    name: "options",
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
  })
  .then(function ({ options }) {
    switch (options) {
      case 'View All Departments':
        viewDepts();
        break;
      case 'View All Roles':
        viewRoles();
        break;
      case 'View All Employees':
        viewEmps();
        break;
      case 'Add A Department':
        addDept(addingDepartment);
        break;
      case 'Add A Role':
        addRole(addingRole);
        break;
      case 'Add An Employee':
        addEmp(addingEmployee);
        break;
      case 'Update A Role':
        updatRole();
        break;
     case "End":
        db.end();
        break;
    }
  });
}
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
  `SELECT first_name, last_name, employee.id, title, department_name AS department, salary, CONCAT(manager.first_name, ' ', manager.last_name AS manager
  FROM employee 
  LEFT JOIN role 
  ON role_id = role.id
  LEFT JOIN department 
  ON department.id = role.department_id
  LEFT JOIN employee manager
  ON employee.id = employee.manager_id`

  db.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}


//function to add employee 
function addEmp() {

  let query =
    `SELECT id, title, salary FROM role`

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
    `SELECT * FROM department`

  db.query(query, function (err, res) {
    if (err) throw err;

    const deptInfo = res.map(({ id, department_name }) => ({
      value: id `${id}`, department: `${department_name}`
    }));

    console.table(res);

    addNewDept(deptInfo);
  });
}

function addNewDept(deptInfo) {

  inquirer
    .prompt(
      {
        type: "list",
        name: "",
        message: "What is the department name & id number?",
        choices: deptInfo
      },
    )
    .then(function (answer) {
      let query = `INSERT INTO department SET ?`

      db.query(query,
        {
          department_name: answer.department_name,
          id: answer.id,
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.insertedRows + "New department added.");

          start();
        });
    });
}
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
// beginQs,
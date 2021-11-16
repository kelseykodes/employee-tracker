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
        addDept();
        break;
      case 'Add A Role':
        addRole();
        break;
      case 'Add An Employee':
        addEmp();
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


module.exports = {beginQs, addingDepartment, addingRole, addingEmployee };
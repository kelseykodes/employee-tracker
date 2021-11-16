const inquirer = require('inquirer');
const express = require('express');
const path = require('path');
const fs = require('fs');
const table = require('console.table');
const db = require('./connect/connect');


const beginQs = [
    {
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
      },
];

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
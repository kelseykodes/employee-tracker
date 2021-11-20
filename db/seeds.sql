INSERT INTO department (department_name) VALUES ('IT');
INSERT INTO department (department_name) VALUES ('Sales');
INSERT INTO department (department_name) VALUES ('Human Resources');
INSERT INTO department (department_name) VALUES ('Finance');

INSERT INTO role (title, salary, department_id)
VALUES 
('Technical Manager', 150000, 1),
('Fullstack Developer', 120000, 1),
('Junior Developer', 70000, 1),
('Sales Manager', 110000, 2),
('Customer Service Representive', 90000, 2),
('Sales Associate', 60000, 2),
('HR Manager', 80000, 3),
('Counselor', 65000, 3),
('HR Director', 90000, 3),
('Company Lawyer', 180000, 4),
('Accountant', 75000, 4),
('Financial Analyst', 95000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
-- manager
("Kelsey", "Perkins", 1, 10), 
("Reagin", "Turner", 1, NULL),
("Leci", "Reid", 1, NULL),
-- manager
("Brooke", "Scott", 2, 11),
("Tynae", "Larry", 2, NULL),
("Anne", "James", 2, NULL),
-- manager
("Dax", "Clark", 3, 12),
("Ally", "Lee", 3, NULL),
("Paige", "Smith", 3, NULL),
("Tomas", "Rivera", 4, NULL),
("William", "Bradely", 4, NULL),
-- manager
("Glenn", "Taylor", 4, 13);

create database project;
use project;

CREATE TABLE `department` (
  `dept_id` int auto_increment not null,
  `name` varchar(100),
  `email` varchar(100),
  `contact` varchar(20),
  `description` text,
  PRIMARY KEY (`dept_id`)
);

CREATE TABLE `teams` (
  `team_id` int auto_increment not null,
  `dept_id` int,
  `name` varchar(50),
  `user_id` int,
  `manager_id` int,
  PRIMARY KEY (`team_id`),
  FOREIGN KEY (`dept_id`) REFERENCES `department`(`dept_id`),
  FOREIGN KEY (`manager_id`) REFERENCES `user`(`user_id`)
);

CREATE TABLE `User` (
  `user_id` int auto_increment not null,
  `name` varchar(100),
  `gender` varchar(10),
  `category` varchar(20),
  `username` varchar(60),
  `password` varchar(60),
  `email` varchar(100),
  `dept_id` int,
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (`dept_id`) REFERENCES `department`(`dept_id`)
);



CREATE TABLE `projects` (
  `project_id` int auto_increment not null,
  `project_name` varchar(100),
  `description` text,
  `status` varchar(100),
  `start_date` date,
  `expected_finish` date,
  `team_id` int,
  PRIMARY KEY (`project_id`),
  FOREIGN KEY (`team_id`) REFERENCES `teams`(`team_id`)
);

#INSERTION 
-- Inserting values into the `department` table
INSERT INTO department (name, email, contact)
VALUES
  ('Marketing', 'marketing@example.com', '+92 300 1234567'),
  ('Sales', 'sales@example.com', '+92 301 2345678'),
  ('Human Resources', 'hr@example.com', '+92 302 3456789'),
  ('Finance', 'finance@example.com', '+92 303 4567890'),
  ('Operations', 'operations@example.com', '+92 304 5678901'),
  ('Research and Development', 'r&d@example.com', '+92 305 6789012'),
  ('Customer Service', 'customerservice@example.com', '+92 306 7890123'),
  ('IT', 'it@example.com', '+92 307 8901234'),
  ('Legal', 'legal@example.com', '+92 308 9012345'),
  ('Facilities', 'facilities@example.com', '+92 309 0123456'),
  ('Quality Control', 'qualitycontrol@example.com', '+92 310 1234567'),
  ('Public Relations', 'pr@example.com', '+92 311 2345678'),
  ('Purchasing', 'purchasing@example.com', '+92 312 3456789'),
  ('Shipping and Receiving', 'shipping@example.com', '+92 313 4567890'),
  ('Training and Development', 'training@example.com', '+92 314 5678901');


-- Inserting values into the `User` table
INSERT INTO User (name, gender, category, username, password, email, dept_id)
VALUES
  ('Fatima Shah', 'Female', 'Manager', 'fatimashah', 'password456', 'fatima.shah@example.com', 2),
  ('Asim Ahmed', 'Male', 'Manager', 'asimahmed', 'password789', 'asim.ahmed@example.com', 3),
  ('Sadia Malik', 'Female', 'Worker', 'sadiamalik', 'password101', 'sadia.malik@example.com', 4),
  ('Imran Ali', 'Male', 'Worker', 'imranali', 'password112', 'imran.ali@example.com', 5),
  ('Kamran Akmal', 'Male', 'Customer', 'kamranakmal', 'password141', 'kamran.akmal@example.com', 7);

-- select * from user;
-- Inserting values into the `teams` table
INSERT INTO teams (dept_id, name, user_id, manager_id)
VALUES
  (1, 'Marketing Team', 3, 1),
  (2, 'Sales Team', 3, 1),
  (3, 'HR Team', 4, 2),
  (4, 'Finance Team', 4, 2);

-- select * from teams;
-- Inserting values into the `projects` table
-- Inserting projects for team_id 1
INSERT INTO projects (project_name, description, status, start_date, expected_finish, team_id)
VALUES
  ('E-Commerce Website', 'Develop an online marketplace for Pakistani products.', 'Completed', '2023-01-01', '2023-02-28', 1),
  ('Tourism App', 'Build a mobile app to promote tourism in Pakistan.', 'Completed', '2023-03-01', '2023-04-30', 1),
  ('Pakistani Recipes Portal', 'Create a website with a collection of authentic Pakistani recipes.', 'Completed', '2023-05-01', '2023-06-30', 1),
  ('Social Media Analytics Tool', 'Develop a tool to analyze social media trends in Pakistan.', 'In Progress', '2023-07-01', '2023-08-31', 1),
  ('Online Education Platform', 'Build an e-learning platform focused on Pakistani educational content.', 'In Progress', '2023-09-01', '2023-10-31', 1),


  ('Pakistani Fashion Marketplace', 'Create an online platform to showcase Pakistani fashion brands.', 'Completed', '2023-01-01', '2023-02-28', 2),
  ('Pakistani Music Streaming App', 'Develop a mobile app to stream Pakistani music.', 'Completed', '2023-03-01', '2023-04-30', 2),
  ('Pakistani Art Gallery Website', 'Build a website to promote Pakistani art and artists.', 'Completed', '2023-05-01', '2023-06-30', 2),
  ('Online Grocery Delivery Service', 'Develop a platform for online grocery shopping and delivery in Pakistan.', 'In Progress', '2023-07-01', '2023-08-31', 2),
  ('Pakistani Handicrafts Marketplace', 'Create an e-commerce platform for selling Pakistani handicrafts.', 'In Progress', '2023-09-01', '2023-10-31', 2),

  ('Pakistani Travel Blog', 'Create a blog featuring travel experiences in Pakistan.', 'Completed', '2023-01-01', '2023-02-28', 3),
  ('Pakistani Sports App', 'Develop a mobile app for tracking Pakistani sports events and scores.', 'Completed', '2023-03-01', '2023-04-30', 3),
  ('Pakistani Documentary Series', 'Produce a documentary series showcasing the diverse culture of Pakistan.', 'Completed', '2023-05-01', '2023-06-30', 3),
  ('Food Delivery Aggregator', 'Build a platform to aggregate food delivery services in Pakistan.', 'In Progress', '2023-07-01', '2023-08-31', 3),
  ('Pakistani Language Learning App', 'Develop a mobile app for learning Pakistani languages.', 'In Progress', '2023-09-01', '2023-10-31', 3),


  ('Pakistani Historical Sites Guide', 'Create a mobile app to guide visitors to Pakistani historical sites.', 'Completed', '2023-01-01', '2023-02-28', 4),
  ('Pakistani News Aggregator', 'Develop an app to aggregate news from various Pakistani sources.', 'Completed', '2023-03-01', '2023-04-30', 4),
  ('Pakistani Wildlife Conservation Project', 'Contribute to a project focused on wildlife conservation in Pakistan.', 'Completed', '2023-05-01', '2023-06-30', 4),
  ('Pakistani Fashion Blog', 'Create a blog featuring Pakistani fashion trends and designers.', 'In Progress', '2023-09-01', '2023-10-31', 4),
  ('E-Commerce Delivery Optimization', 'Build an optimization system for e-commerce deliveries in Pakistan.', 'In Progress', '2023-07-01', '2023-08-31', 4);


-- Inserting values into the `Tasks` table
-- INSERT INTO Tasks (description, priority, team_id, project_id)
-- VALUES
--   ('Task 1', 'High', 1, 1),
--   ('Task 2', 'Medium', 1, 1),
--   ('Task 3', 'Low', 2, 2),
--   ('Task 4', 'Medium', 2, 2),
--   ('Task 5', 'High', 3, 3),
--   ('Task 6', 'Low', 3, 3),
--   ('Task 7', 'High', 4, 4),
--   ('Task 8', 'Medium', 4, 4),
--   ('Task 9', 'Low', 5, 5),
--   ('Task 10', 'Medium', 5, 5);

-- select * from projects;
-- Inserting values into the `version` table
INSERT INTO version (description, deployable, completion_date, project_id)
VALUES
  ('Version 1.0', 'Yes', '2023-06-30', 1),
  ('Version 2.0', 'No', '2023-08-31', 2),
  ('Version 3.0', 'Yes', '2023-09-30', 3),
  ('Version 4.0', 'No', '2023-11-30', 4),
  ('Version 5.0', 'No', '2024-01-31', 5),
  ('Version 6.0', 'No', '2024-03-31', 6),
  ('Version 7.0', 'No', '2024-05-31', 7),
  ('Version 8.0', 'No', '2024-07-31', 8),
  ('Version 9.0', 'No', '2024-09-30', 9),
  ('Version 10.0', 'No', '2024-11-30', 10);

-- Inserting values into the `sprints` table
-- INSERT INTO sprints (description, `order`, status, start_date, end_date, project_id)
-- VALUES
--   ('Sprint 1', 1, 'Completed', '2023-05-01', '2023-05-14', 1),
--   ('Sprint 2', 2, 'In Progress', '2023-05-15', '2023-05-28', 1),
--   ('Sprint 1', 1, 'Completed', '2023-06-01', '2023-06-14', 2),
--   ('Sprint 2', 2, 'In Progress', '2023-06-15', '2023-06-28', 2),
--   ('Sprint 1', 1, 'Completed', '2023-07-01', '2023-07-14', 3),
--   ('Sprint 2', 2, 'In Progress', '2023-07-15', '2023-07-28', 3),
--   ('Sprint 1', 1, 'Completed', '2023-08-01', '2023-08-14', 4),
--   ('Sprint 2', 2, 'In Progress', '2023-08-15', '2023-08-28', 4),
--   ('Sprint 1', 1, 'Completed', '2023-09-01', '2023-09-14', 5),
--   ('Sprint 2', 2, 'In Progress', '2023-09-15', '2023-09-28', 5);
-- select * from projects;
-- Inserting values into the `reports` table
INSERT INTO reports (category, state, description, `high_priority`, project_id)
VALUES
  ('Bug', 'Open', 'Bug report 1', 'Yes', 1),
  ('Feature', 'Closed', 'Enhancement request 1', 'No', 2),
  ('Bug', 'Open', 'Bug report 2', 'Yes', 3),
  ('Feature', 'Closed', 'Enhancement request 2', 'No', 4),
  ('Bug', 'Open', 'Bug report 3', 'Yes', 5),
  ('Feature', 'Closed', 'Enhancement request 3', 'No', 6),
  ('Bug', 'Open', 'Bug report 4', 'Yes', 7),
  ('Feature', 'Closed', 'Enhancement request 4', 'No', 8),
  ('Bug', 'Open', 'Bug report 5', 'Yes', 9),
  ('Feature', 'Closed', 'Enhancement request 5', 'No', 10);

INSERT INTO working_in(user_id , team_id)
VALUES
(3,1),
(3,2),
(4,3),
(4,4);

-- select * from working_in;
-- select * from user;
-- select * from teams;

-- SELECT u.username 
-- FROM user u 
-- JOIN working_in w ON u.user_id = w.user_id 
-- JOIN projects p ON w.team_id = p.team_id 
-- WHERE p.project_name ='Pakistani Recipes Portal'  AND p.status = "In Progress";

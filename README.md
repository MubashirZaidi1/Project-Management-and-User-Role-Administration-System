# Portal Description


## Registration Portal


### Purpose:
Users can register and create new accounts in the system through the Register portal. This portal is responsible for overseeing the registration process by verifying user inputs and executing operations on the database.

### Functionality:
Upon submission of the registration form, the system records all input data, which includes the user's complete name, username, email address, password, as well as their category, department, and gender.

#### Verify the availability of the email address:
To verify whether the given email is already linked with an active user account, the system executes an SQL query. In case of an error in query operation, the system logs an error message that corresponds to the issue. If the query yields no results, meaning that the email is not registered, the process proceeds to the next step.

#### Verify if the desired username is available:
Another SQL query is executed to verify if the chosen username is already taken by an existing user. Similar error handling is implemented. If the query result length is zero, indicating that the username is available, the registration process proceeds.

#### Insert User Data:
If both the email and username are available, the system executes an SQL INSERT query to add the user's data into the "user" table. The user's full name, gender, category, username, password, email, and department ID are inserted as values into the respective columns.

#### Render Response:
After successfully inserting the user's data, the system renders the "login" page with a response message indicating the successful registration.

#### Handle Existing Email or Username:
If the email or username is already associated with an existing account, the system renders the "login" page with an appropriate response message to inform the user of the conflict.

#### Error Handling:
Appropriate error handling is implemented throughout the process to catch any exceptions that may occur during SQL query execution or other operations. Error messages are logged to the console, and the user is presented with an error message on the rendered "login" page.

#### Redirect:
The code includes a commented out "res.redirect('/')" statement, indicating the intention to redirect the user back to the login page after completing the registration process.

This report provides a descriptive overview of the "/register" portal in Node.js. It outlines the steps involved in registering a new user, checking email and username availability, inserting user data into the database, and rendering appropriate responses. Further details and error handling can be found in the provided code.


### Login Portal

#### Purpose:
The Login portal is designed to handle user authentication and provide access to different functionalities based on the user's role, namely Worker, Customer, or Manager.

#### Functionality for Worker:
The Worker functionality within the "/login" portal involves retrieving and displaying information related to the worker's projects.

#### Retrieve Worker's Current Projects:
When a worker logs in, the system executes a SQL query to fetch all the projects the worker has worked on or is currently working on. The query selects the project name and status from the projects, teams, working_in, and user tables based on the user ID.

#### Categorize Projects:
The retrieved projects are categorized into two arrays: "cProj" for projects that are in progress and "oProj" for completed projects.

#### Retrieve Additional Information for In-Progress Projects:
For the first two projects in progress, the system executes separate SQL queries to fetch additional information. The queries retrieve the usernames of the users associated with the corresponding projects and in progress status.

#### Render the WorkerProject Page:
Once the necessary data is obtained, the system renders the "WorkerProject" page. The page includes the worker's username, the arrays of projects in progress and completed projects, as well as the results of the additional queries for the first two projects.

#### Functionality for Customer:
The Customer functionality in the "/login" portal focuses on retrieving and displaying project reports.

#### Retrieve Customer's Project Reports:
Upon logging in as a customer, an SQL query is executed to retrieve project reports associated with the specific customer. The query joins the reports and projects tables based on the project ID and filters the results by the user ID.

#### Render the customer_records Page:
The system renders the "customer_records" page, displaying the retrieved project reports to the customer.

#### Functionality for Manager:
The Manager functionality within the "/login" portal revolves around retrieving and managing project and worker information.
Retrieve Manager's Projects and Workers:
After a manager logs in, the system executes two SQL queries. The first query fetches the manager's projects, including their names, descriptions, statuses, start dates, and expected finish dates. The second query retrieves the names of the workers associated with the manager.

#### Categorize Projects:
The retrieved projects are categorized into two arrays: "Cprojects" for completed projects and "inProgressProjects" for projects that are still in progress.

#### Render the managerportal Page:
Using the obtained data, the system renders the "managerportal" page. The page displays the manager's name, the arrays of projects in progress and completed projects, the names of associated workers, and a message indicating the current number of workers or the absence thereof.


### Worker Portal

#### Purpose:
The Worker portal is designed to provide workers with information about their projects, including current and previous projects.

#### Functionality:
When a worker accesses the Worker portal, the system executes a series of database queries to retrieve and organize the necessary project data.

#### Retrieve Worker's Current Projects:
The system executes an SQL query to fetch the projects in which the worker is currently involved. The query selects the project name and status from the projects, teams, working_in, and user tables, filtering the results based on the user ID.

#### Categorize Projects:
The retrieved projects are categorized into two lists: "cProj" for projects that are in progress and "oProj" for completed projects. This categorization is based on the status field of the project.

#### Retrieve Additional Information for In-Progress Projects:
For the first two projects in progress, the system executes separate SQL queries to retrieve additional information. The queries retrieve the usernames of the users associated with the corresponding projects and with an "In Progress" status.

#### Sprint Creation and Deletion:

The worker can further add Sprints and further information to create for example description, start date end date and end date and corresponding project id for that sprint will be assigned to worker. Status will also be shown in the sprints and also while deletion worker can delete sprint when they are completed or even incomplete.

#### Render the WorkerProject Page:
Once the necessary data is obtained, the system renders the "WorkerProject" page. The page includes the worker's username, the lists of current and previous projects, as well as the results of the additional queries for the first two projects. The data is passed as variables to the rendering template.



#### Error Handling:
Appropriate error handling is implemented throughout the process. If an error occurs during any of the SQL queries, the error is logged to the console, and an error response with the corresponding error message is sent to the worker. This ensures that the worker receives feedback if any issues arise during data retrieval.

#### Console Logging:
The code includes console.log statements to log the results of the additional SQL queries. This helps with debugging and understanding the data being retrieved.

### Customer Portal

The Customer Portal is designed to retrieve and display customer records. When a customer accesses this endpoint, the system executes an SQL query to fetch relevant information from the reports and projects tables. The query retrieves the project name, category, ticket ID, and state for reports associated with the customer's user ID. The retrieved data is then passed to the "customer_records" rendering template, where it is displayed to the customer.

The Customer Portal also allows customers to submit a new ticket or report. When a customer submits the ticket form, the system retrieves the category, priority, project name, and description provided by the customer. The system then executes an SQL query to retrieve the project ID based on the project name provided. Once the project ID is obtained, the system inserts a new entry into the reports table with the provided information, including the customer's user ID. If the insertion is successful, the system queries the projects table to fetch the project names with a status of "In Progress." The retrieved project names are passed to the "customer_ticket" rendering template along with a success response message.

#### Error Handling:
Appropriate error handling is implemented throughout the code. If an error occurs during any of the SQL queries, the error is logged to the console. This ensures that any issues with data retrieval or insertion are captured and can be addressed accordingly.

#### Rendering Templates:
The code utilizes rendering templates to generate dynamic HTML pages. The "customer_records" template is used to display the customer records, while the "customer_ticket" template is used to render the ticket submission form and display a success message upon successful submission.

### Manager Portal

The Manager Portal is responsible for rendering the manager portal page. When a manager accesses this endpoint, the system executes two SQL queries. The first query retrieves project information for projects associated with the manager's name. The retrieved data includes the project name, description, status, start date, and expected finish date. The second query retrieves the names of the workers associated with the manager's name. The retrieved data is then used to filter and separate completed projects from projects in progress. The filtered project data and worker names are passed to the "manager portal" rendering template, where they are displayed. If no workers are associated with the manager, a custom message is also included in the rendering.

The Create Team Button is used to handle the creation of a new team. When a manager submits the team creation form, the system retrieves the team ID, department ID, team name, and leader ID provided by the manager. The system then performs several checks to validate the data. These checks include verifying if the team ID already exists, if the department ID exists, and if the leader ID corresponds to a worker. If any of these checks fail, an appropriate error message is rendered to the "create-team" template along with the available departments. If all checks pass, the system proceeds to insert the new team into the teams table and add the leader and two random workers to the working_in table. Once the team creation process is complete, the "team-confirmation" rendering template is rendered, displaying the team details.

The Delete Project Button is responsible for rendering the delete project page. When a manager accesses this endpoint, the system executes an SQL query to retrieve projects in progress associated with the manager's name. The retrieved data includes the project ID, project name, description, status, start date, and expected finish date. The project data is passed to the "delete-project" rendering template, where it is displayed to the manager for selection.

The Create Project Button is used to render the create project page. When a manager accesses this endpoint, the system executes SQL queries to retrieve the manager's user ID and the teams associated with the manager's ID. The retrieved data includes the team ID and name. The team data is passed to the "create-project" rendering template, where it is displayed to the manager for selection.


The Current Project Name Button is responsible for retrieving project information based on the project name provided in the URL parameter. The system executes an SQL query to fetch details such as project name, description, status, start date, and expected finish date from the projects table. Additionally, it retrieves the names of workers associated with the project by joining the working_in, user, teams, and projects tables. The retrieved data is then rendered using the "project" template, where the project details and associated workers are displayed.

The Previous Project Button is similar to the Current Project Button endpoint but is specifically used for incomplete projects. It follows the same process of retrieving project details and associated workers based on the project name provided. The retrieved data is then rendered using the "project" template, displaying the project details and associated workers.

The List of Team Members Button  is responsible for fetching information about a specific worker based on the worker's name provided in the URL parameter. The system executes an SQL query to retrieve all the details of the worker from the user table, where the worker's name matches and the category is "Worker". The retrieved worker data is rendered using the "worker" template, where the worker's details are displayed.

#### Error Handling:
Appropriate error handling is implemented throughout the code. If an error occurs during any of the SQL queries, the error is logged to the console, and an error message is rendered to the corresponding rendering template. This ensures that any issues with data retrieval or insertion are captured and can be addressed accordingly.

#### Rendering Templates:
Rendering templates are used to generate dynamic HTML pages. The "manager portal" template is used to display the manager portal page with project and worker information. The "create-team" template is used to render the team creation form, displaying error messages and available departments. The "team-confirmation" template is used to confirm the successful creation of a new team. The "delete-project" template is used to display projects in progress for deletion. The "create-project" template is used to render the create project form with team options.

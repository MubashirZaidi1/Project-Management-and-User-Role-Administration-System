var http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const bodyParser = require('body-parser');          //using body-parser package we can read the inputs we get from the html page (use npm install body-parser)
var path = require('path');
const mysql = require('mysql2');

var pool = mysql.createPool({
    host: "localhost",
    database: "project",
    user: "root",
    password: "Stronge123.",
  });
  


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');


var curr = ""
var cat = ""
var id = 0
let managerName; // Define managerName in a higher scope

app.get("/new_sprint", function(req, res) {         //when we turn on localhost:3000, it accesses the route page which has nothing
  let query = 'SELECT p.project_name , p.project_id FROM user u \
  JOIN working_in w ON u.user_id = w.user_id \
  JOIN projects p ON w.team_id = p.team_id \
  WHERE u.user_id = ? and p.status="In Progress"';          //query to get all the  projects the user has had or is working on

  pool.query(query,[id] ,(error, results, fields) => {
    if (error) {                  //exception handling
      console.error(error);
      res.status(500).send('Internal Server Error');
      return;
    }
    // console.log(results);
    if (results.length == 0){
      res.render("new_sprint", {pNames: undefined,leader:'no'})
    }
    res.render("new_sprint", {pNames: results,leader:undefined})
    
  });
});

app.post('/new_sprint', function(req, res) {
  const projectName = req.body.projectName;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const description = req.body.description;

  let query = 'select s.`order` \
  from sprints s \
  join projects p on s.project_id = p.project_id \
  where p.project_name = ? \
  order by `order` DESC;'      //insert proj name here

  pool.query(query, [projectName], (error, results, fields) => {
    if (error) {                  //exception handling
      console.error(error);
      res.status(500).send('Internal Server Error');
      return;
    }
    let newOrder = 1;             //if we get an empty list in the results variable it means that there was no sprint in the project
    if (results.length > 0) {     //else we increment the order by 1 for a new sprint       
      newOrder = results[0].order + 1;    
    }

    let query = 'select project_id from projects where project_name = ?;'
    pool.query(query, [projectName], (error, results, fields) => {
      if (error) {                  //exception handling
        console.error(error);
        res.status(500).send('Internal Server Error');
        return;
      }
      const projectID = results[0].project_id;   //get the project id from the database

      //if the order is remains 1 then it means sprint is In Progress
      //if the order is 2 then it means sprint is Pending  
      if (newOrder > 1){
        let query = 'insert into sprints (description,`order`,status,start_date,end_date,project_id) \
        values (?,?,?,?,?,?);'      //insert proj name here

        pool.query(query, [description, newOrder, 'Pending', startDate, endDate, projectID], (error, results, fields) => {
          if (error) {                  //exception handling
            console.error(error);
            res.status(500).send('Internal Server Error');
            return;
          }

          let query = 'SELECT p.project_name , p.project_id FROM user u \
          JOIN working_in w ON u.user_id = w.user_id \
          JOIN projects p ON w.team_id = p.team_id \
          WHERE u.user_id = ? and p.status="In Progress"';          //query to get all the  projects the user has had or is working on

          pool.query(query,[id] ,(error, results, fields) => {
            if (error) {                  //exception handling
              console.error(error);
              res.status(500).send('Internal Server Error');
              return;
            }
            // console.log(results);
            res.render("new_sprint", {pNames: results,leader:undefined})
            
          });
        });


      }
      else if (newOrder == 1) {
        let query = 'insert into sprints (description,`order`,status,start_date,end_date,project_id) \
        values (?,?,?,?,?,?);'      //insert proj name here

        pool.query(query, [description, newOrder, 'In Progress', startDate, endDate, projectID], (error, results, fields) => {
          if (error) {                  //exception handling
            console.error(error);
            res.status(500).send('Internal Server Error');
            return;
          }
          let query = 'SELECT p.project_name , p.project_id FROM user u \
          JOIN working_in w ON u.user_id = w.user_id \
          JOIN projects p ON w.team_id = p.team_id \
          WHERE u.user_id = ? and p.status="In Progress"';          //query to get all the  projects the user has had or is working on

          pool.query(query,[id] ,(error, results, fields) => {
            if (error) {                  //exception handling
              console.error(error);
              res.status(500).send('Internal Server Error');
              return;
            }
            // console.log(results);
            res.render("new_sprint", {pNames: results,leader:undefined})
            
          });
        });
      }
      
    });

  });
});

app.get('/register', function (request, response) { // Routing to registration page
    response.render('register', { foo: undefined });
  });
  
app.get('/logout', function (request, response) { // Routing to registration page
    curr = "";
    cat = "";
    id = 0;
    managerName = "";
    console.log(curr, cat, id);
    response.render('login');
  });
  
app.get('/home', function (request, response) { // Routing to registration page
    response.render('home', { name: curr, type: cat, id: id });
  });

app.get('/customer_records', function (request, response) {
  console.log(id)
    const sql = 'SELECT projects.project_name, reports.category,reports.ticket_id,reports.state FROM reports \
                 INNER JOIN projects ON projects.project_id = reports.project_id \
                 WHERE reports.user_id = ?;';
    const values = [id];
  
    pool.query(sql, values, function (err, result) {
      if (err) {
        console.error(err);
        return;
      }
      response.render("customer_records", { data: result });
    });
  });
  
app.get("/", function (req, res) {
    res.render("login");
  });

app.get("/login", function (req, res) {
    console.log(id)
    if (cat === "Worker") {
      let cQuery =
        'SELECT p.project_name, p.status \
      FROM projects AS p \
      JOIN teams AS t ON p.team_id = t.team_id \
      JOIN working_in AS w ON t.team_id = w.team_id \
      JOIN user AS u ON w.user_id = u.user_id \
      WHERE u.user_id = ?;'; // query to get all the projects the user has had or is working on
  
      pool.query(cQuery, [id], function (error, results, fields) {
        if (error) {
          console.error(error);
          res.status(500).send('COULD NOT GET Worker CURRENT PROJECTS');
          return;
        }
  
        const cProj = [];
        const oProj = [];
  
        for (let i = 0; i < results.length; i++) {
          if (results[i].status === 'In Progress') {
            cProj.push(results[i]);
          } else if (results[i].status === 'Completed') {
            oProj.push(results[i]);
          }
        }
  
        let fQuery1 =
          'SELECT u.username \
          FROM user u \
          JOIN working_in w ON u.user_id = w.user_id \
          JOIN projects p ON w.team_id = p.team_id \
          WHERE p.project_name = ? AND p.status = "In Progress";';
  
        pool.query(fQuery1, [cProj[0].project_name], function (error, resultsP1, fields) {
          if (error) {
            console.error(error);
            res.status(500).send('COULD NOT GET cProj1');
            return;
          }
  
          let fQuery2 =
            'SELECT u.username \
              FROM user u \
              JOIN working_in w ON u.user_id = w.user_id \
              JOIN projects p ON w.team_id = p.team_id \
              WHERE p.project_name = ? AND p.status = "In Progress";';
  
          pool.query(fQuery2, [cProj[1].project_name], function (error, resultsP2, fields) {
            if (error) {
              console.error(error);
              res.status(500).send('COULD NOT GET cProj2');
              return;
            }
  
            console.log('\n\n\n');
            console.log(resultsP1);
            console.log(resultsP2);
  
            res.render('pages/Worker_pages/WorkerProject', {
              uName: curr,
              cProj: cProj,
              oProj: oProj,
              tp1: resultsP1,
              tp2: resultsP2,
            });
          });
        });
      });
    } else if (cat === "Customer") {
      let sql =
        'SELECT projects.project_name, reports.category,reports.ticket_id,reports.state FROM reports \
       inner join projects on projects.project_id = reports.project_id \
       where reports.user_id = ?;';
      const values = [id];
  
      pool.query(sql, values, function (err, result) {
        if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
          return;
        }
        console.id(id)
        res.render('customer_records', { data: result });
      });
    } else if (cat === "Manager") {
       managerName = curr;
      // Assign manager's name to managerName
  
      const projectsQuery = '\
      SELECT DISTINCT p.project_name, p.`description`, p.`status`, p.start_date, p.expected_finish\
      FROM projects p\
      INNER JOIN teams t ON p.team_id = t.team_id\
      WHERE t.manager_id = ?;\
      ';
      const workersQuery = `
        SELECT u.name AS worker
        FROM user u
        JOIN working_in w ON u.user_id = w.user_id
        JOIN teams t ON w.team_id = t.team_id
        JOIN user manager ON t.manager_id = manager.user_id
        WHERE manager.name = ?
      `;
  
      pool.getConnection(function (err, connection) {
        if (err) {
          console.error('Error getting database connection:', error);
          res.status(500).send('Internal Server Error');
          return;
        }
  
        connection.query(projectsQuery, [id], function (error, projectRows) {
          if (error) {
            connection.release();
            console.error('Error fetching manager projects:', error);
            res.status(500).send('Internal Server Error');
            return;
          }
  
          connection.query(workersQuery, [managerName], function (error, workerRows) {
            connection.release();
  
            if (error) {
              console.error('Error fetching workers:', error);
              res.status(500).send('Internal Server Error');
              return;
            }
  
            const Cprojects = projectRows.filter(project => project.status === 'Completed');
            const inProgressProjects = projectRows.filter(project => project.status === 'In Progress');
            const workers = workerRows.map(row => row.worker);
  
            let message = '';
            if (workers.length === 0) {
              message = 'No workers at the moment';
            }
            console.log(inProgressProjects,'\n',Cprojects)
            res.render('managerportal', { managerName, projects: inProgressProjects, Cprojects, workers, message });
          });
        });
      });
    }
    });

app.get("/customer_ticket", function(req, res) {
    let query = 'SELECT project_name FROM projects WHERE status = "In Progress";'
    pool.query(query, (error, results, fields) => {
      if (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.render("customer_ticket", { names: results, response: undefined });
    });
  });


app.get("/Worker_pages/WorkerProject", function(req, res) {
    let cQuery = 'SELECT p.project_name, p.status \
                FROM projects AS p \
                JOIN teams AS t ON p.team_id = t.team_id \
                JOIN working_in AS w ON t.team_id = w.team_id \
                JOIN user AS u ON w.user_id = u.user_id \
                WHERE u.user_id = ?;';
  
    pool.query(cQuery, [id], (error, results, fields) => {
      if (error) {
        console.error(error);
        res.status(500).send('COULD NOT GET Worker CURRENT PROJECTS');
        return;
      }
  
      const cProj = [];   //list to store the current projects
      const oProj = [];   //list to store the previous projects
  
      for (let i = 0; i < results.length; i++) {
        if (results[i].status === 'In Progress') {
          cProj.push(results[i]);
        } else if (results[i].status === 'Completed') {
          oProj.push(results[i]);
        }
      }
      
      let fQuery1 = 'select u.username \
      from user u \
      join working_in w on u.user_id = w.user_id \
      join projects p on w.team_id = p.team_id \
      where p.project_name = ? and p.status = "In Progress";'
  
      pool.query(fQuery1, [cProj[0].project_name], (error, resultsP1, fields) => {
        if (error) {
          console.error(error);
          res.status(500).send('COULD NOT GET cProj1');
          return;
        }
  
        let fQuery2 = 'select u.username \
        from user u \
        join working_in w on u.user_id = w.user_id \
        join projects p on w.team_id = p.team_id \
        where p.project_name = ? and p.status = "In Progress";'
  
        pool.query(fQuery2, [cProj[1].project_name], (error, resultsP2, fields) => {
          if (error) {
            console.error(error);
            res.status(500).send('COULD NOT GET cProj2');
            return;
          }
  
          console.log('\n\n\n');
          console.log(resultsP1);
          console.log(resultsP2);
  
          res.render("pages/Worker_pages/WorkerProject", { uName: curr, cProj: cProj, oProj: oProj, tp1: resultsP1, tp2: resultsP2 });
        });
      });
    });
  });

app.get("/project/:projectName", function(req, res) {
    const projectName = req.params.projectName;
    const query = 'SELECT p.project_name, p.description, p.status, p.start_date, p.expected_finish, u.name AS worker \
    FROM projects p \
    INNER JOIN teams t ON p.team_id = t.team_id \
    INNER JOIN user u ON t.user_id = u.user_id \
    WHERE p.project_name = ?;'
  
    pool.query(query, [projectName], (error, results, fields) => {
      if (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
        return;
      }
      const project = results[0];
        
      let newQuery = 'SELECT u.name AS worker \
      FROM working_in w \
      INNER JOIN user u ON w.user_id = u.user_id \
      INNER JOIN teams t ON w.team_id = t.team_id \
      INNER JOIN projects p ON t.team_id = p.team_id \
      WHERE p.project_name = ?;'
      
      pool.query(newQuery, [projectName], (error, results, fields) => {  
        if (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
          return;
        }
        const workers = results;
        project.workers = workers;    //adding the workers to the project object
        console.log(project);
        res.render('pages/Worker_pages/project', { project: project });
      });
    });
  });

app.post('/customer_ticket', function(req, res) {
    const category = req.body.category;
    const priority = req.body.priority;
    const project = req.body.project;
    var text = req.body.text;
  
    let sql = 'SELECT project_id from projects where project_name = ?;'
    let values = [project]
    console.log(req.body.project)
    pool.query(sql, values, function(err, result) {
      if (err) {    //exception handling
        console.error('Error fetching data from MySQL table: ', err);
        return;
      }
      p_id = result[0].project_id
      let sql = 'INSERT INTO reports (category, state, description, `high_priority`, project_id, user_id) VALUES (?,?,?,?,?,?)'
      let values = [category, 'In Queue', text, priority, p_id, id]
      pool.query(sql, values, function(err, result) {
        if (err) {    //exception handling
          console.error('Error inserting data into MySQL table: ', err);
          return;
        }
        let query = 'SELECT project_name FROM projects WHERE status = "In Progress";'
        pool.query(query, (error, results, fields) => {
          if (error) {                  //exception handling
            console.error(error);
            res.status(500).send('Internal Server Error');
            return;
          }
          res.render("customer_ticket", { names: results, response: 'Thank You for your response.' })
        });
      });
    });
  });
  
app.post('/register', function(req, res) {
    const fname = req.body.fname;
    const username = req.body.username;
    const email = req.body.email;
    const pass = req.body.password;
    const category = req.body.category;
    const dept = req.body.department;
    const gender = req.body.gender;
  
    let sql = 'select email from user where email = ?'
    let values = [email]
    pool.query(sql, values, function(err, result) {
      if (err) {    //exception handling
        console.error('Error inserting data into MySQL table: ', err);
        return;
      }
      if (result.length === 0) {
        let sql = 'select username from user where username = ?';
        let values = [username];
        pool.query(sql, values, function(err, result) {
          if (err) {    //exception handling
            console.error('Error inserting data into MySQL table: ', err);
            return;
          }
          if (result.length === 0) {
            console.log("YES");
            let sql = 'INSERT INTO user (name, gender, category, username, password, email, dept_id) VALUES (?,?,?,?,?,?,?)';
            let values = [fname, gender, category, username, pass, email, dept];
            pool.query(sql, values, function(err, result) {});
            res.render('login', { foo: 'Registered Successfully' });
          } else {
            res.render('login', { foo: 'Username already exists' });
          }
        });
      } else {
        res.render('login', { foo: 'Email is already associated with an account' });
      }
      //REDIRECT USER BACK TO LOGIN PAGE
      // res.redirect('/');
    });
  });

  app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
  
    let query = 'SELECT username FROM user WHERE username = ?'; // query to find if Account exists in the database
    pool.getConnection(function (err, connection) {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      connection.query(query, [username], function (error, results, fields) {
        if (error) {
          connection.release(); // release the connection back to the pool
          console.error(error);
          res.status(500).send('Internal Server Error');
          return;
        }
  
        if (results.length == 0) {
          connection.release(); // release the connection back to the pool
          const message = 'PROFILE DOES NOT EXIST';
          res.render('login', { message: message });
          return;
        } else {
          let query = 'SELECT password, name, category, user_id FROM user WHERE username = ?'; // query to get user password
  
          connection.query(query, [username], function (error, results, fields) {
            connection.release(); // release the connection back to the pool
  
            if (error) {
              console.error(error);
              res.status(500).send('Internal Server Error');
              return;
            }
  
            const dbPassword = results[0].password; // get the password from the database
  
            if (password !== dbPassword) {
              const message = 'PASSWORD IS INCORRECT';
              res.render('login', { message: message });
              return;
            } else {
              curr = results[0].name;
              cat = results[0].category;
              id = results[0].user_id;
  
              if (cat === "Worker") {
                let cQuery =
                  'SELECT p.project_name, p.status \
                FROM projects AS p \
                JOIN teams AS t ON p.team_id = t.team_id \
                JOIN working_in AS w ON t.team_id = w.team_id \
                JOIN user AS u ON w.user_id = u.user_id \
                WHERE u.user_id = ?;'; // query to get all the projects the user has had or is working on
  
                pool.query(cQuery, [id], function (error, results, fields) {
                  if (error) {
                    console.error(error);
                    res.status(500).send('COULD NOT GET Worker CURRENT PROJECTS');
                    return;
                  }
  
                  const cProj = [];
                  const oProj = [];
  
                  for (let i = 0; i < results.length; i++) {
                    if (results[i].status === 'In Progress') {
                      cProj.push(results[i]);
                    } else if (results[i].status === 'Completed') {
                      oProj.push(results[i]);
                    }
                  }
  
                  let fQuery1 =
                    'SELECT u.username \
                    FROM user u \
                    JOIN working_in w ON u.user_id = w.user_id \
                    JOIN projects p ON w.team_id = p.team_id \
                    WHERE p.project_name = ? AND p.status = "In Progress";';
                    pool.query(fQuery1, [cProj[0].project_name], function (error, resultsP1, fields) {
                      if (error) {
                        console.error(error);
                        res.status(500).send('COULD NOT GET cProj1');
                        return;
                      } 

                    let fQuery2 =
                      'SELECT u.username \
                        FROM user u \
                        JOIN working_in w ON u.user_id = w.user_id \
                        JOIN projects p ON w.team_id = p.team_id \
                        WHERE p.project_name = ? AND p.status = "In Progress";';
  
                    pool.query(fQuery2, [cProj[1].project_name], function (error, resultsP2, fields) {
                      if (error) {
                        console.error(error);
                        res.status(500).send('COULD NOT GET cProj2');
                        return;
                      }
  
                      console.log('\n\n\n');
                      console.log(resultsP1);
                      console.log(resultsP2);
  
                      res.render('pages/Worker_pages/WorkerProject', {
                        uName: curr,
                        cProj: cProj,
                        oProj: oProj,
                        tp1: resultsP1,
                        tp2: resultsP2,
                      });
                    });
                  });
                });
              } else if (cat === "Customer") {
                let sql =
                  'SELECT projects.project_name, reports.category,reports.ticket_id,reports.state FROM reports \
                 inner join projects on projects.project_id = reports.project_id \
                 where reports.user_id = ?;';
                const values = [id];
  
                pool.query(sql, values, function (err, result) {
                  if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                    return;
                  }
                  console.log(id,'\n',result)
                  res.render('customer_records', { data: result });
                });
              } else if (cat === "Manager") {
                 managerName = curr;
                // Assign manager's name to managerName
  
                const projectsQuery = `
                  SELECT DISTINCT p.project_name, p.description, p.status, p.start_date, p.expected_finish
                  FROM projects p
                  INNER JOIN teams t ON p.team_id = t.team_id
                  INNER JOIN user u ON t.user_id = u.user_id
                  WHERE u.name = ?
                `;
                const workersQuery = `
                  SELECT u.name AS worker
                  FROM user u
                  JOIN working_in w ON u.user_id = w.user_id
                  JOIN teams t ON w.team_id = t.team_id
                  JOIN user manager ON t.manager_id = manager.user_id
                  WHERE manager.name = ?
                `;
  
                pool.getConnection(function (err, connection) {
                  if (err) {
                    console.error('Error getting database connection:', error);
                    res.status(500).send('Internal Server Error');
                    return;
                  }
  
                  connection.query(projectsQuery, [managerName], function (error, projectRows) {
                    if (error) {
                      connection.release();
                      console.error('Error fetching manager projects:', error);
                      res.status(500).send('Internal Server Error');
                      return;
                    }
  
                    connection.query(workersQuery, [managerName], function (error, workerRows) {
                      connection.release();
  
                      if (error) {
                        console.error('Error fetching workers:', error);
                        res.status(500).send('Internal Server Error');
                        return;
                      }
  
                      const Cprojects = projectRows.filter(project => project.status === 'Completed');
                      const inProgressProjects = projectRows.filter(project => project.status === 'In Progress');
                      const workers = workerRows.map(row => row.worker);
  
                      let message = '';
                      if (workers.length === 0) {
                        message = 'No workers at the moment';
                      }
  
                      res.render('managerportal', { managerName, projects: inProgressProjects, Cprojects, workers, message });
                    });
                  });
                });
              }
            }
          });
        }
      });
    });
  });

  app.get('/incompproject/:projectName', (req, res) => {
    const projectName = req.params.projectName;
    const query = 'SELECT p.project_name, p.description, p.status, p.start_date, p.expected_finish, u.name AS worker \
    FROM projects p \
    INNER JOIN teams t ON p.team_id = t.team_id \
    INNER JOIN user u ON t.user_id = u.user_id \
    WHERE p.project_name = ?;'
  
    pool.query(query, [projectName], (error, results, fields) => {
      if (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
        return;
      }
      const project = results[0];
        
      let newQuery = 'SELECT u.name AS worker \
      FROM working_in w \
      INNER JOIN user u ON w.user_id = u.user_id \
      INNER JOIN teams t ON w.team_id = t.team_id \
      INNER JOIN projects p ON t.team_id = p.team_id \
      WHERE p.project_name = ?;'
      
      pool.query(newQuery, [projectName], (error, results, fields) => {  
        if (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
          return;
        }
        const workers = results;
        project.workers = workers;    //adding the workers to the project object
        console.log(project);
        res.render('pages/Worker_pages/project', { project: project });
      });
    });
  });

  app.get('/worker/:workerName', (req, res) => {
    const workerName = req.params.workerName;
    const workerQuery = 'SELECT * FROM user WHERE name = ? AND category = "Worker"';
  
    pool.query(workerQuery, [workerName], (error, results, fields) => {
      if (error) {
        console.error('Error fetching worker information:', error);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      const worker = results[0];
      res.render('worker', { worker });
    });
  });


  // Route for creating a project (GET request)
  app.get('/create-project', (req, res) => {
    pool.promise().getConnection()
      .then(async (connection) => {
        try {
          const managerNameQuery = 'SELECT user_id FROM user WHERE name = ?';
          const [managerNameRows] = await connection.execute(managerNameQuery,[managerName]);
          const managerId = managerNameRows[0].user_id;
  
          const teamsQuery = 'SELECT team_id, name FROM teams WHERE manager_id = ?';
          const [teamsRows] = await connection.execute(teamsQuery, [managerId]);
          const teams = teamsRows;
  
          res.render('create-project', { teams });
        } catch (error) {
          console.error('Error retrieving teams:', error);
          res.status(500).send('Internal Server Error');
        } finally {
          connection.release();
        }
      })
      .catch((error) => {
        console.error('Error getting database connection:', error);
        res.status(500).send('Internal Server Error');
      });
  });
  app.get('/worker_projects', (req, res) => {
    console.log(id)
    const sql = 'select projects.project_id,projects.project_name,projects.`status`,\
    DATE_FORMAT(projects.start_date,\'%a, %Y %M %e\')as start_date,\
    DATE_FORMAT(projects.expected_finish,\'%a, %Y %M %e\')as expected_finish\
    from working_in\
    inner join teams on teams.team_id = working_in.team_id\
    inner join projects on projects.project_id = teams.team_id\
    where working_in.user_id = ?;';
    const values = [id];
  
    pool.query(sql, values, function (err, result) {
      if (err) {
        console.error(err);
        return;
      }
      res.render("worker_projects", { data: result });
    });
  });

  app.get('/manager_projects', (req, res) => {
    console.log(id)
    const sql = 'select projects.project_id,projects.project_name,projects.`status`,\
    DATE_FORMAT(projects.start_date,\'%a, %Y %M %e\')as start_date,DATE_FORMAT(projects.expected_finish,\'%a, %Y %M %e\')as expected_finish\
    from teams\
    inner join projects on projects.team_id = teams.team_id \
    where teams.manager_id = ?;';
    const values = [id];
  
    pool.query(sql, values, function (err, result) {
      if (err) {
        console.error(err);
        return;
      }
      res.render("manager_projects", { data: result });
    });
  });

// Route for submitting the project form (POST request)
// Route for submitting the project form (POST request)
app.post('/create-project', (req, res) => {
  const { projectName, description, startDate, expectedFinish, teamId } = req.body;

  // Check if all required fields have valid values
  if (!projectName || !description || !startDate || !expectedFinish || !teamId) {
    return res.status(400).send('All fields are required');
  }

  const status = "In Progress"; // Set default status

  // Insert the project data into the projects table
  const insertQuery = `
    INSERT INTO projects (project_name, description, status, start_date, expected_finish, team_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  pool.promise().getConnection()
    .then(async (connection) => {
      try {
        await connection.execute(insertQuery, [projectName, description, status, startDate, expectedFinish, teamId]);
        res.redirect('/project-confirmation'); // Redirect to confirmation page or appropriate page
      } catch (error) {
        console.error('Error inserting project data:', error);
        res.status(500).send('Internal Server Error');
      } finally {
        connection.release();
      }
    })
    .catch((error) => {
      console.error('Error getting database connection:', error);
      res.status(500).send('Internal Server Error');
    });
});
app.get('/project-confirmation', (req, res) => {
  res.render('project-confirmation');
});

app.get('/delete-project', (req, res) => {
  pool.promise().getConnection()
    .then(async (connection) => {
      try {
        const projectsQuery ='SELECT DISTINCT p.project_id, p.project_name, p.`description`, p.`status`, p.start_date, p.expected_finish\
        FROM projects p\
        INNER JOIN teams t ON p.team_id = t.team_id\
        INNER JOIN user u ON t.user_id = u.user_id\
        WHERE t.manager_id = ?';

        const [projectRows] = await connection.execute(projectsQuery, [id]);
        const projects = projectRows;

        res.render('delete-project', { projects });
      } catch (error) {
        console.error('Error retrieving projects:', error);
        res.status(500).send('Internal Server Error');
      } finally {
        connection.release();
      }
    })
    .catch((error) => {
      console.error('Error getting database connection:', error);
      res.status(500).send('Internal Server Error');
    });
  const projectsQuery = `
          SELECT DISTINCT p.project_id, p.project_name, p.description, p.status, p.start_date, p.expected_finish
          FROM projects p
          INNER JOIN teams t ON p.team_id = t.team_id
          INNER JOIN user u ON t.user_id = u.user_id
          WHERE u.name = ?;`;
});

app.post('/delete-project', (req, res) => {
  const projectId = req.body.projectId;

  pool.promise().getConnection()
    .then(async (connection) => {
      try {
        const deleteQuery = 'DELETE FROM projects WHERE project_id = ?';
        await connection.execute(deleteQuery, [projectId]);

        res.render('delete-confirmation');
      } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).send('Internal Server Error');
      } finally {
        connection.release();
      }
    })
    .catch((error) => {
      console.error('Error getting database connection:', error);
      res.status(500).send('Internal Server Error');
    });
});


app.get('/managerportal', (req, res) => {
  const projectsQuery = `
  SELECT DISTINCT p.project_name, p.description, p.status, p.start_date, p.expected_finish
  FROM projects p
  INNER JOIN teams t ON p.team_id = t.team_id
  INNER JOIN user u ON t.user_id = u.user_id
  WHERE u.name = ?
`;
const workersQuery = `
  SELECT u.name AS worker
  FROM user u
  JOIN working_in w ON u.user_id = w.user_id
  JOIN teams t ON w.team_id = t.team_id
  JOIN user manager ON t.manager_id = manager.user_id
  WHERE manager.name = ?
`;

pool.getConnection(function (err, connection) {
  if (err) {
    console.error('Error getting database connection:', error);
    res.status(500).send('Internal Server Error');
    return;
  }

  connection.query(projectsQuery, [managerName], function (error, projectRows) {
    if (error) {
      connection.release();
      console.error('Error fetching manager projects:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    connection.query(workersQuery, [managerName], function (error, workerRows) {
      connection.release();

      if (error) {
        console.error('Error fetching workers:', error);
        res.status(500).send('Internal Server Error');
        return;
      }

      const Cprojects = projectRows.filter(project => project.status === 'Completed');
      const inProgressProjects = projectRows.filter(project => project.status === 'In Progress');
      const workers = workerRows.map(row => row.worker);

      let message = '';
      if (workers.length === 0) {
        message = 'No workers at the moment';
      }

      res.render('managerportal', { managerName, projects: inProgressProjects, Cprojects, workers, message });
  
    });
  });
});
});


app.get('/create-team', async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();

    // Retrieve the departments from the database
    const departmentsQuery = 'SELECT dept_id, name FROM department';
    const [departmentsRows] = await connection.execute(departmentsQuery);

    connection.release();

    res.render('create-team', { error: null, departments: departmentsRows });
  } catch (error) {
    console.error('Error retrieving departments:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.post('/create-team', async (req, res) => {
  const {teamId,deptId, teamName, leaderId } = req.body;

  // Check if any required field is empty
  if (!teamId || !deptId || !teamName || !leaderId) {
    return res.status(400).send('All fields are required');
  }

  try {
    // Get a connection from the pool
    const connection = await pool.promise().getConnection();

    // Check if the team_id already exists
    const teamQuery = 'SELECT team_id FROM teams WHERE team_id = ?';
    const [teamRows] = await connection.execute(teamQuery, [teamId]);

    // If team_id already exists, release the connection and return an error
    if (teamRows.length > 0) {
      connection.release();

      // Retrieve the departments from the database
      const departmentsQuery = 'SELECT dept_id, name FROM department';
      const [departmentsRows] = await pool.execute(departmentsQuery);

      return res.render('create-team', { error: 'Team ID already exists. Please choose a different one.', departments: departmentsRows });
    }

    // Check if the dept_id exists in the department table
    const deptQuery = 'SELECT dept_id FROM department WHERE dept_id = ?';
    const [deptRows] = await connection.execute(deptQuery, [deptId]);

    // If dept_id doesn't exist, release the connection and throw an error
    if (deptRows.length === 0) {
      connection.release();

      // Retrieve the departments from the database
      const departmentsQuery = 'SELECT dept_id, name FROM department';
      const [departmentsRows] = await pool.execute(departmentsQuery);

      return res.render('create-team', { error: 'Department ID does not exist.', departments: departmentsRows });
    }

    // Check if the leaderId exists in the user table with category "Worker"
    const workerQuery = 'SELECT user_id FROM user WHERE user_id = ? AND category = "Worker"';
    const [workerRows] = await connection.execute(workerQuery, [leaderId]);

    // If leaderId doesn't exist or is not a worker, release the connection and return an error
    if (workerRows.length === 0) {
      connection.release();

      // Retrieve the departments from the database
      const departmentsQuery = 'SELECT dept_id, name FROM department';
      const [departmentsRows] = await pool.execute(departmentsQuery);

      return res.render('create-team', { error: 'No worker exists with the provided user ID.', departments: departmentsRows });
    }

    const managerId = leaderId;

    // Insert the new team into the teams table
    const createTeamQuery = 'INSERT INTO teams (team_id, dept_id, name, user_id, manager_id) VALUES (?, ?, ?, ?, ?)';
    await connection.execute(createTeamQuery, [teamId, deptId, teamName, leaderId, managerId]);

    // Update the working_in table
    const addLeaderQuery = 'INSERT INTO working_in (team_id, user_id) VALUES (?, ?)';
    await connection.execute(addLeaderQuery, [teamId, leaderId]);

    // Add two random workers to the working_in table
    const randomWorkersQuery = 'SELECT user_id FROM user WHERE category = "Worker" ORDER BY RAND() LIMIT 2';
    const [randomWorkersRows] = await connection.execute(randomWorkersQuery);

    const addRandomWorkersQuery = 'INSERT INTO working_in (team_id, user_id) VALUES (?, ?)';
    await Promise.all(randomWorkersRows.map((row) => connection.execute(addRandomWorkersQuery, [teamId, row.user_id])));

    // Release the connection
    connection.release();

    res.render('team-confirmation', { teamId, deptId, teamName, leaderId });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).send('Internal Server Error');
  }
});  

app.get("/assign-task", function (req, res) {
  let query = 'SELECT p.project_name \
  FROM projects p \
  JOIN teams t ON p.team_id = t.team_id \
  JOIN user u ON t.manager_id = u.user_id \
  WHERE u.category = "Manager" AND u.user_id = ? AND p.status ="In Progress";'
  pool.query(query, [id], function (error, results, fields) {
    if (error) {
      console.error(error);
      res.status(500).send('COULD NOT GET MANAGER PROJECTS');
      return;
    }

    console.log(results);

    res.render('assign-task', {pNames: results});
  });
});

app.post("/assign-task", function (req, res) {
  const taskName = req.body.task;
  const taskDesc = req.body.description;
  const taskPriority = req.body.priority;
  let query = 'select p.project_id from projects p where project_name = ?;'

  pool.query(query,[taskName] ,function (error, results, fields) {
    if (error) {
      console.error(error);
      res.status(500).send('COULD NOT GET PROJECT ID');
      return;
    }

    const projID = results[0].project_id;
    console.log(projID);

    let query2 = 'select t.team_id from teams t where manager_id = ?;'
    pool.query(query2,[id] ,function (error, results, fields) {

      if (error) {
        console.error(error);
        res.status(500).send('COULD NOT GET TEAM ID');
        return;
      }

      const teamID = results[0].team_id;
      console.log(teamID);

      let query3 = 'insert into tasks (description,priority,team_id,project_id) values (?,?,?,?);'
      pool.query(query3,[taskDesc,taskPriority,teamID,projID] ,function (error, results, fields) {
        
        if (error) {
          console.error(error);
          res.status(500).send('COULD NOT INSERT TASK');
          return;
        }

        res.redirect('assign-task');
      });
    });
  });

});

app.get("/delete-task", function (req, res) {
  let query = 'SELECT p.project_id \
  FROM projects p \
  JOIN teams t ON p.team_id = t.team_id \
  JOIN user u ON t.manager_id = u.user_id \
  WHERE u.category = "Manager" AND u.user_id = ? AND p.status ="In Progress";'
  pool.query(query, [id], function (error, results1, fields) {

    if (error) {
      console.error(error);
      res.status(500).send('COULD NOT GET MANAGER PROJECTS');
      return;
    }

    console.log(results1);

    const projectIds = results1.map((result) => result.project_id);
    console.log(projectIds);

    let query2 = 'select tn.ticket_no,p.project_name \
    from tasks tn \
    join projects p on tn.project_id = p.project_id \
    where tn.project_id in (?) \
    order by tn.ticket_no ASC;'             //returns the ticket number and project names
      
    pool.query(query2, [projectIds], function (error, results2, fields) {
      
      if (error) {
        console.error(error);
        res.status(500).send('COULD NOT GET TASKS');
        return;
      }

      console.log(results2);
      
      res.render('delete-task', {tickets: results2});
    });
  });
});


app.post("/delete-task", function (req, res) {
  const ticketNo = req.body.userTicketNo;
  let query = 'delete from tasks where ticket_no = ?;'
  pool.query(query,[ticketNo] ,function (error, dresults, fields) {
    
    if (error) {
      console.error(error);
      res.status(500).send('COULD NOT DELETE TASK');
      return;
    }
console.log(ticketNo);
    // res.redirect('delete-task', {tickets: undefined});
    let query = 'SELECT p.project_id \
    FROM projects p \
    JOIN teams t ON p.team_id = t.team_id \
    JOIN user u ON t.manager_id = u.user_id \
    WHERE u.category = "Manager" AND u.user_id = ? AND p.status ="In Progress";'
    pool.query(query, [id], function (error, results1, fields) {
  
      if (error) {
        console.error(error);
        res.status(500).send('COULD NOT GET MANAGER PROJECTS');
        return;
      }
      console.log('GONNA USE THIS NOW');
      console.log(results1);
  
      const projectIds = results1.map((result) => result.project_id);
      console.log(projectIds);
  
      let query2 = 'select tn.ticket_no,p.project_name \
      from tasks tn \
      join projects p on tn.project_id = p.project_id \
      where tn.project_id in (?) \
      order by tn.ticket_no ASC;'             //returns the ticket number and project names
        
      pool.query(query2, [projectIds], function (error, results2, fields) {
        
        if (error) {
          console.error(error);
          res.status(500).send('COULD NOT GET TASKS');
          return;
        }
  
        console.log(results2);
        
        res.render('delete-task', {tickets: results2});
      });
    });
  
  });
});

app.listen(3000,function(){
  console.log('HEARD ON 3000');
});
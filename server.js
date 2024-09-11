const express = require("express");
const cors = require('cors')
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const axios = require('axios')
const app = express();
app.use(cors())
app.use(bodyParser.json());
var Girls_DB_Data = []

//connect to mysql 
// Import the mysql2 package

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'mysql-leftorright-left-or-right.g.aivencloud.com', // Replace with your MySQL server host
  port: '28463',
  user: 'avnadmin', // Replace with your MySQL username
  password: 'AVNS_-4XSQSiO_sbjuBu2p50', // Replace with your MySQL password
  database: 'peoplelist' // Replace with your database name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    return console.error('error connecting: ' + err.stack);
  }
  console.log('connected as id ' + connection.threadId);
});







//FOR THE GAME ITSELF




// Query the table     
const query = 'SELECT * FROM peoplelist.girl_list'; // Replace with your table name

connection.query(query, (error, results, fields) => {
  if (error) {
    console.error('An error occurred while executing the query:', error);
    return;
  }
  //console.log('Query results:', results);
  
  // Do something with the results here
  results.forEach((row) => {
    Girls_DB_Data.push(row); // Print each row
  });

  //get the database now
  //console.log(Girls_DB_Data[0].full_name)
});


//send data to front end
 
//api  to communicate
app.get("/api1", (req, res)=>
    {
      //recieve from front end
      
        //consoe.log(Girls_DB_Data)
        //send data to front end
        console.log( Girls_DB_Data)
       return res.json({message: Girls_DB_Data})

       
    }
)

//get data from front end
app.post('/api/data', (req, res) => {
  const { data } = req.body;
  console.log('Received data:', data);
  //console.log(Object.values(data)[0])
  //console.log(Object.values(data).length)
 let length = Object.values(data).length
 let i = 0;
 while( i < length){
  //get each updated girls names
  //console.log(Object.values(data)[i])
  let GirlName = Object.values(data)[i]
  let GirlScore = Object.values(data)[i+1]
  console.log(GirlName + ":" + GirlScore)
     
    let query = `UPDATE girl_list SET cur_score = cur_score + ${GirlScore} WHERE full_name = "${GirlName}"`;
    connection.query(query, (err, results) => { 
      if (err) {
        console.error('Error updating data in MySQL:', err);
        
        return;
      }
      
    
    });

    

    

  i = i+2
 }





 //update api for leaderboard
 //query data from database (due to new ones)
   const query = 'SELECT * FROM peoplelist.girl_list'; // Replace with your table name

 connection.query(query, (error, results, fields) => {
  if (error) {
    console.error('An error occurred while executing the query:', error);
    return;
  }
  //console.log('Query results:', results);
  Girls_DB_Data = []
  // Do something with the results here
  results.forEach((row) => {
    Girls_DB_Data.push(row); // Print each row
  });

  //get the database now
  //console.log(Girls_DB_Data[0].full_name)
});



//recieve update leaderboard api with newly submitted results
 app.patch("/api2", (req, res)=>
  {
    //recieve update leaderboard api with new data queried from database
    
     return res.json({message: Girls_DB_Data})

     
  }
)
 
  
});




// FOR THE LEADERBOARD


app.get("/api2", (req, res)=>
  {
    //recieve from front end
    
      //consoe.log(Girls_DB_Data)
      //send data to front end
     return res.json({message: Girls_DB_Data})

     
  }
)















app.listen(8081, ()=> 
    {
        console.log('listening')
        
    }
)
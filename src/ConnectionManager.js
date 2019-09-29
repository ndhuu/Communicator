const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
 

let database = null;

async function startDatabase() {
    const conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'communicatordb'
    });
    conn.connect((err) =>{
        if(err) throw err;
        console.log('Mysql Connected...');
        database = conn.connect;
      });
    console.log('Mysql Connected...');
}

async function getDatabase() {
  if (!database) await startDatabase();
  console.log('Mysql returned...');
  return database;
}

module.exports = {
  getDatabase,
  startDatabase,
};

console.log(startDatabase);

// // parse application/json
// app.use(bodyParser.json());
 
// //create database connection
// const conn = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'communicatordb'
// });
 
// //connect to database
// conn.connect((err) =>{
//   if(err) throw err;
//   console.log('Mysql Connected...');
// });
 
// //show all users
// app.post('/events/eventsUpdates',(req, res) => {
//     const eventId = req.query.eventId;
//     const userId = req.query.userId;
//     let sql = `SELECT * FROM user WHERE userId = ${userId}`;
//     let query = conn.query(sql, (err, results) => {
//     if(err) throw err;
//     res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
//   });
// });
 
// //show single product
// app.get('/api/products/:id',(req, res) => {
//   let sql = "SELECT * FROM product WHERE product_id="+req.params.id;
//   let query = conn.query(sql, (err, results) => {
//     if(err) throw err;
//     res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
//   });
// });
 
// //add new product
// app.post('/api/products',(req, res) => {
//   let data = {product_name: req.body.product_name, product_price: req.body.product_price};
//   let sql = "INSERT INTO product SET ?";
//   let query = conn.query(sql, data,(err, results) => {
//     if(err) throw err;
//     res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
//   });
// });
 
// //update product
// app.put('/api/products/:id',(req, res) => {
//   let sql = "UPDATE product SET product_name='"+req.body.product_name+"', product_price='"+req.body.product_price+"' WHERE product_id="+req.params.id;
//   let query = conn.query(sql, (err, results) => {
//     if(err) throw err;
//     res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
//   });
// });
 
// //Delete product
// app.delete('/api/products/:id',(req, res) => {
//   let sql = "DELETE FROM product WHERE product_id="+req.params.id+"";
//   let query = conn.query(sql, (err, results) => {
//     if(err) throw err;
//       res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
//   });
// });
 
// //Server listening
// app.listen(3000,() =>{
//   console.log('Server started on port 3000...');
// });
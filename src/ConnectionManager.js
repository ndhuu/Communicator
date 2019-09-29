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

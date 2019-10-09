const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2/promise');
 

let database = null;

async function startDatabase() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'communicatordb'
    });
      database = conn;
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

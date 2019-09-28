var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "communicatorDB"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "CREATE TABLE user (userID INT AUTO_INCREMENT PRIMARY KEY, firstName VARCHAR(255), lastName VARCHAR(255), subscription CHAR(1), emailAddress VARCHAR(255), accountType VARCHAR(255))";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("User Table created");
    });
});  

var sql = "CREATE TABLE event (eventID INT AUTO_INCREMENT PRIMARY KEY, eventName VARCHAR(255), startDateTime DATE, organizerName VARCHAR(255), currentParticipants INT, eventStatus VARCHAR(255))";
con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Event Table created");
});

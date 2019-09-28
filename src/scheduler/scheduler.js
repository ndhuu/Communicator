const cron = require("node-cron");
const express = require("express");

const { getDatabase, startDatabase, } = require('../database/database');

app = express();

Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
    ].join('');
};


// schedule tasks to be run on the server
cron.schedule("00 10 1 * * 0-6", function () {
    console.log("Daily Email Notification Sending");
    var day = Date(Date.now());
    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    var nextday_str = nextDay.yyyymmdd();
    db = getDatabase();
    var select = "SELECT s FROM Subcription NATURAL JOIN Users NATURAL JOIN Events ";
    var common_condition = "WHERE s.subcription = \"y\" ";

    //send email to admin
    var admin_condition = "AND s.accountType = \"admin\" AND SUBSTRING(s.startDateTime) = " + nextday_str;
    var query = select + common_condition + admin_condition    
    var admin_result = null;
    let query = db.query(query, (err, results) => {
        if (err) throw err;
        admin_result = results
    });
    //send email to admin function

    //send to users
    var admin_condition = "AND s.accountType = \"user\" AND SUBSTRING(s.startDateTime) = " + nextday_str;
    var query = select + common_condition + admin_condition    
    var admin_result = null;
    let query = db.query(query, (err, results) => {
        if (err) throw err;
        admin_result = results
    });
    //send email to user function

});

app.listen("3128");
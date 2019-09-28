const cron = require("node-cron");
const express = require("express");

const { getDatabase, startDatabase, } = require('../ConnectionManager');
const sendEmail = require("../somthing")

app = express();

Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
    '-'+ (mm > 9 ? '' : '0') + mm,
    '-'+ (dd > 9 ? '' : '0') + dd
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
    var common_condition = "WHERE s.upcomingEventSubcription = 'Y' ";

    //send email to admin
    var admin_condition = "AND s.accountType = \"admin\" AND SUBSTRING(s.startDateTime, 1, 10) = " + nextday_str + ";";
    var query = select + common_condition + admin_condition;
    let query = db.query(query, (err, results) => {
        if (err) throw err;
        var admin_results = results;
        if (admin_results.length != 0) {
            var hashTable = [];
            for (let admin_res of admin_results) {
                if (hashTable.find(element => element.key === admin_res.eventID)) {
                    hashTable.push({ key: res.eventID, value: [res] })
                }
                else {
                    var i = hashTable.indexOf(hashTable.find(element => element.key === admin_res.eventID))
                    hashTable[i].value.push(res);
                }
            }
            for (let ht of hashTable) {
                var mailing_list = [];
                for (let t of ht.value) {
                    mailing_list.push(t.emailAddress);
                }
                sendEmail("admin", {
                    'date': ht.value[0].startDateTime, 'name': ht.value[0].eventName,
                    'description': ht.value[0].description, 'mailing_list': mailing_list
                });
            }
        }
    });
    //send email to admin

    //send email to users
    var user_result = null;
    var user_condition = "AND s.accountType = 'user' AND SUBSTRING(s.startDateTime, 1, 10) = " + nextday_str + ";";
    query = select + common_condition + user_condition
    let query = db.query(query, (err, results) => {
        if (err) throw err;
        var user_results = results;
        if (user_results.length != 0) {
            var hashTable = [];
            for (let admin_res of user_results) {
                if (hashTable.find(element => element.key === admin_res.eventID)) {
                    hashTable.push({ key: res.eventID, value: [res] })
                }
                else {
                    var i = hashTable.indexOf(hashTable.find(element => element.key === admin_res.eventID))
                    hashTable[i].value.push(res);
                }
            }
            for (let ht of hashTable) {
                var mailing_list = [];
                for (let t of ht.value) {
                    mailing_list.push(t.emailAddress);
                }
                sendEmail("admin", {
                    'date': ht.value[0].startDateTime, 'name': ht.value[0].eventName,
                    'description': ht.value[0].description, 'mailing_list': mailing_list
                });
            }
        }
    });
    //send email to users
});

app.listen("3128");
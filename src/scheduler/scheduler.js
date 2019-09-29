const cron = require("node-cron");
const express = require("express");

const { getDatabase, startDatabase, } = require('../ConnectionManager');
const { sendEmail, email_type } = require("../SendMail")
const const_params = require("../Params/params")

//app = express();

Date.prototype.yyyymmdd = function () {
    let mm = this.getMonth() + 1; // getMonth() is zero-based
    let dd = this.getDate();

    return [this.getFullYear(),
    '-' + (mm > 9 ? '' : '0') + mm,
    '-' + (dd > 9 ? '' : '0') + dd
    ].join('');
};

function task() {
    let day = new Date(Date.now());
    let nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    let nextday_str = nextDay.yyyymmdd();
    db = getDatabase();

    let select = "SELECT * FROM " + const_params.SUBSCRIPTION_DATABASE + " NATURAL JOIN " + const_params.USERS_DATABASE + " NATURAL JOIN " + const_params.EVENTS_DATABASE + " ";
    let common_condition = "WHERE upcomingSubscription = 'Y' AND eventStatus IN ('Open', 'Closed')";

    //send email to admin
    let admin_condition = "AND SUBSTRING(startDateTime, 1, 10) = " + nextday_str + ";";
    let sql_query = select + common_condition + admin_condition;
    let query = db.query(sql_query, (err, results) => {
        if (err) throw err;
        let admin_results = results;
        if (admin_results.length != 0) {
            let hashTable = [];
            for (let admin_res of admin_results) {
                if (hashTable.find(element => element.key === admin_res.eventId)) {
                    hashTable.push({ key: res.eventId, value: [res] })
                }
                else {
                    let i = hashTable.indexOf(hashTable.find(element => element.key === admin_res.eventId))
                    hashTable[i].value.push(res);
                }
            }
            for (let ht of hashTable) {
                let mailing_list = [];
                let volunteer_list = [];
                for (let t of ht.value) {
                    if (t.accountType == "admin") {
                        mailing_list.push(t.emailAddress);
                    }
                    else {
                        volunteer_list.push(str(t.firstName + ' ' + t.lastName));
                    }
                    mailing_list.push(t.emailAddress);
                }
                sendEmail("admin", {
                    'date': ht.value[0].startDateTime, 'name': ht.value[0].eventName,
                    'description': ht.value[0].description, 'mailing_list': mailing_list, 'volunteer_list': volunteer_list
                }, email_type[5]);
            }
        }
    });
    //send email to admin

    //send email to users
    let user_result = null;
    let user_condition = "AND accountType = 'volunteer' AND SUBSTRING(startDateTime, 1, 10) = " + nextday_str + ";";
    sql_query = select + common_condition + user_condition
    let query = db.query(sql_query, (err, results) => {
        if (err) throw err;
        let user_results = results;
        if (user_results.length != 0) {
            let hashTable = [];
            for (let user_res of user_results) {
                if (hashTable.find(element => element.key === user_res.eventId)) {
                    hashTable.push({ key: res.eventId, value: [res] })
                }
                else {
                    let i = hashTable.indexOf(hashTable.find(element => element.key === user_res.eventId))
                    hashTable[i].value.push(res);
                }
            }
            for (let ht of hashTable) {
                let mailing_list = [];
                for (let t of ht.value) {
                    mailing_list.push(t.emailAddress);
                }
                sendEmail("user", {
                    'date': ht.value[0].startDateTime, 'name': ht.value[0].eventName,
                    'description': ht.value[0].description, 'mailing_list': mailing_list
                }, email_type[2]);
            }
        }
    });
}

module.exports = { task }
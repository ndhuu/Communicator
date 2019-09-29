const { sendEmail, email_type } = require("../SendMail")

function callEventUpdateNoti(eventId) {
    let sql_query = `SELECT s FROM ${const_params.SUBSCRIPTION_DATABASE} NATURAL JOIN ${const_params.USERS_DATABASE} NATURAL JOIN ${const_params.EVENTS_DATABASE} `
    sql_query = sql_query + `WHERE s.eventId = ${eventId} ;`
    let query = db.query(sql_query, (err, results) => {
        if (err) throw err;
        var end_results = results;
        if (end_results.length != 0) {
            var hashTable = [];
            for (let end_res of end_results) {
                if (hashTable.find(element => element.key === end_res.eventId)) {
                    hashTable.push({ key: res.eventId, value: [res] })
                }
                else {
                    var i = hashTable.indexOf(hashTable.find(element => element.key === end_res.eventId))
                    hashTable[i].value.push(res);
                }
            }
            for (let ht of hashTable) {
                var mailing_list = [];
                for (let t of ht.value) {
                    mailing_list.push(t.emailAddress);
                }
                sendEmail("default", {
                    'date': ht.value[0].startDateTime, 'name': ht.value[0].eventName,
                    'description': ht.value[0].description, 'mailing_list': mailing_list
                }, email_type[2]);
            }
        }
    });
};

function callEventCancelNoti(eventId) {
    let sql_query = `SELECT s FROM ${const_params.SUBSCRIPTION_DATABASE} NATURAL JOIN ${const_params.USERS_DATABASE} NATURAL JOIN ${const_params.EVENTS_DATABASE} `
    sql_query = sql_query + `WHERE s.eventId = ${eventId} AND s.accountType = 'admin' ;`
    let query = db.query(sql_query, (err, results) => {
        if (err) throw err;
        var end_results = results;
        if (end_results.length != 0) {
            var hashTable = [];
            for (let end_res of end_results) {
                if (hashTable.find(element => element.key === end_res.eventId)) {
                    hashTable.push({ key: res.eventId, value: [res] })
                }
                else {
                    var i = hashTable.indexOf(hashTable.find(element => element.key === end_res.eventId))
                    hashTable[i].value.push(res);
                }
            }
            for (let ht of hashTable) {
                var mailing_list = [];
                for (let t of ht.value) {
                    mailing_list.push(t.emailAddress);
                }
                sendEmail("default", {
                    'date': ht.value[0].startDateTime, 'name': ht.value[0].eventName,
                    'description': ht.value[0].description, 'mailing_list': mailing_list
                }, email_type[2]);
            }
        }
        const deleteEventAction = async () => {
            const response = await fetch('http://localhost:3001/events?' + eventId);
            // do something with myJson
        }
    });
}

function callFullSubsNoti(eventId) {
    let sql_query = `SELECT s FROM ${const_params.SUBSCRIPTION_DATABASE} NATURAL JOIN ${const_params.USERS_DATABASE} NATURAL JOIN ${const_params.EVENTS_DATABASE} `
    sql_query = sql_query + `WHERE s.eventId = ${eventId} AND s.accountType = 'admin';`
    let query = db.query(sql_query, (err, results) => {
        if (err) throw err;
        var end_results = results;
        if (end_results.length != 0) {
            var hashTable = [];
            for (let end_res of end_results) {
                if (hashTable.find(element => element.key === end_res.eventId)) {
                    hashTable.push({ key: res.eventId, value: [res] })
                }
                else {
                    var i = hashTable.indexOf(hashTable.find(element => element.key === end_res.eventId))
                    hashTable[i].value.push(res);
                }
            }
            for (let ht of hashTable) {
                var mailing_list = [];
                for (let t of ht.value) {
                    mailing_list.push(t.emailAddress);
                }
                sendEmail("default", {
                    'date': ht.value[0].startDateTime, 'name': ht.value[0].eventName,
                    'description': ht.value[0].description, 'mailing_list': mailing_list
                }, email_type[0]);
            }
        }
    });
};

function sendConfirmationNoti(userId, eventId) {
    let sql_query = `SELECT s FROM ${const_params.SUBSCRIPTION_DATABASE} NATURAL JOIN ${const_params.USERS_DATABASE} NATURAL JOIN ${const_params.EVENTS_DATABASE} `
    sql_query = sql_query + `WHERE s.eventId = ${eventId} AND s.userId = ${userId} AND s.eventId = ${eventId};`
    let query = db.query(sql_query, (err, results) => {
        if (err) throw err;
        var end_results = results;
        if (end_results.length != 1) {
            console.log("confirmation Noti not equal 1")
            return
        };
        let end_res = end_results[0];
        sendEmail(end_res.username, {
            'date': end_res.startDateTime, 'name': end_res.eventName,
            'description': end_res.description, 'mailing_list': [end_res.emailAddress]
        }, email_type[3]);
    })
};


module.exports = {
    callEventUpdateNoti,
    callEventCancelNoti,
    callFullSubsNoti,
    sendConfirmationNoti
}
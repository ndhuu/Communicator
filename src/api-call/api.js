function callEventUpdateNoti(eventId) {
    let sql_query = `SELECT s FROM ${const_params.SUBSCRIPTION_DATABASE} NATURAL JOIN ${const_params.USERS_DATABASE} NATURAL JOIN ${const_params.EVENTS_DATABASE} `
    sql_query = sql_query + `WHERE s.eventId = ${eventID} ;`
    let query = db.query(sql_query, (err, results) => {
        if (err) throw err;
        var end_results = results;
        if (end_results.length != 0) {
            var hashTable = [];
            for (let end_res of end_results) {
                if (hashTable.find(element => element.key === end_res.eventID)) {
                    hashTable.push({ key: res.eventID, value: [res] })
                }
                else {
                    var i = hashTable.indexOf(hashTable.find(element => element.key === end_res.eventID))
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
                });
            }
        }
    });
};

function callEventCancelNoti(eventId) {
    let sql_query = `SELECT s FROM ${const_params.SUBSCRIPTION_DATABASE} NATURAL JOIN ${const_params.USERS_DATABASE} NATURAL JOIN ${const_params.EVENTS_DATABASE} `
    sql_query = sql_query + `WHERE s.eventId = ${eventID} AND s.accountType = 'admin' ;`
    let query = db.query(sql_query, (err, results) => {
        if (err) throw err;
        var end_results = results;
        if (end_results.length != 0) {
            var hashTable = [];
            for (let end_res of end_results) {
                if (hashTable.find(element => element.key === end_res.eventID)) {
                    hashTable.push({ key: res.eventID, value: [res] })
                }
                else {
                    var i = hashTable.indexOf(hashTable.find(element => element.key === end_res.eventID))
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
                });
            }
        }
        const deleteEventAction = async () => {
            const response = await fetch('http://localhost:3001/events?' + eventID);
            // do something with myJson
        }
    });
}

function callFullSubsNoti(eventId) {
    let sql_query = `SELECT s FROM ${const_params.SUBSCRIPTION_DATABASE} NATURAL JOIN ${const_params.USERS_DATABASE} NATURAL JOIN ${const_params.EVENTS_DATABASE} `
    sql_query = sql_query + `WHERE s.eventId = ${eventID} AND s.accountType = 'admin';`
    let query = db.query(sql_query, (err, results) => {
        if (err) throw err;
        var end_results = results;
        if (end_results.length != 0) {
            var hashTable = [];
            for (let end_res of end_results) {
                if (hashTable.find(element => element.key === end_res.eventID)) {
                    hashTable.push({ key: res.eventID, value: [res] })
                }
                else {
                    var i = hashTable.indexOf(hashTable.find(element => element.key === end_res.eventID))
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
                });
            }
        }
    });
};

module.exports = {
    callEventUpdateNoti,
    callEventCancelNoti,
    callFullSubsNoti
}
let data = require('./ConnectionManager');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const body_parser = require('body-parser');

const const_params = require('./Params/params')

// parse JSON (application/json content-type)
//server.use(body_parser.json());
const conn = data.startDatabase();

//show all users
app.post('/events/eventsUpdates', (req, res) => {
  const eventId = req.query.eventId;
  const userId = req.query.userId;
  let sql = `SELECT * FROM user WHERE userId = ${userId}`;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });
});

//show single product
app.get('/api/products/:id', (req, res) => {
  let sql = "SELECT * FROM product WHERE product_id=" + req.params.id;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });
});

//add new product
app.post('/api/products', (req, res) => {
  let data = { product_name: req.body.product_name, product_price: req.body.product_price };
  let sql = "INSERT INTO product SET ?";
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });
});

//update product
app.put('/api/products/:id', (req, res) => {
  let sql = "UPDATE product SET product_name='" + req.body.product_name + "', product_price='" + req.body.product_price + "' WHERE product_id=" + req.params.id;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });
});

//Delete product
app.delete('/api/products/:id', (req, res) => {
  let sql = "DELETE FROM product WHERE product_id=" + req.params.id + "";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });
});

//Server listening
app.listen(3000, () => {
  console.log('Server started on port 3000...');
});

app.post('/events/eventsUpdates', (req, res) => {
  const eventId = req.query.eventId;
  const userId = req.query.userId;
  let sql_query = `SELECT u FROM ${const_params.USERS_DATABASE} WHERE u.userId = ${userId} AND u.accountType = 'admin' ;`
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    if (results.length == 0) {
      res.send(JSON.stringify({ "result": " no such admin id" }))
    }
    else {
      res.send(JSON.stringify({ "result": " Emails will be sent to all volunteers for this event" }))
      callEventUpdateNoti((eventId));
    }
  });
},

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
  });


app.post('/events/fullSubcriptionNoti', (req, res) => {
  const eventId = req.query.eventId;
  const userId = req.query.userId;
  let sql_query = `SELECT * FROM ${const_params.USERS_DATABASE} WHERE userId = ${userId}`
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    if ((results.length == 0)) {
      res.send(JSON.stringify({ "result": " no such admin id" }))
    }
    else {
      res.send(JSON.stringify({ "result": " Emails will be sent to all admins for this event" }))
      callEventUpdateNoti((eventId));
    }
  });
},

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
  });



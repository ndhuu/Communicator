let data = require('./ConnectionManager');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const body_parser = require('body-parser');

const const_params = require('./Params/params')

const {callEventUpdateNoti,
  callEventCancelNoti,
  callFullSubsNoti} = require('./api-call/api');

// parse JSON (application/json content-type)
//server.use(body_parser.json());
const conn = data.startDatabase();

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
});

app.post('/events/cancelNoti', (req, res) => {
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
      callEventCancelNoti((eventId));
    }
  });
});


app.post('/events/fullSubcriptionNoti', (req, res) => {
  const eventId = req.query.eventId;
  callFullSubsNoti((eventId));
  res.send(JSON.stringify({ "result": " Emails will be sent to all admins for this event" }))
});


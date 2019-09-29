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
//const conn = data.startDatabase();

//update full subscription in db
app.get('/events/fullSubscription', async (req, res) => {
  try {
    const conn = await data.getDatabase();
    const eventId = req.query.eventId;
    const userId = req.query.userId;
    const subscribed = 'Y';
    let sql = `UPDATE subscription SET fullSubscription = "${subscribed}" WHERE userId = ${userId}`;
    const [rows, fields] = await conn.execute(sql);
    res.send(JSON.stringify({"result": "User has successfully subscribe for the event"}));
  }
  catch(err) {
    res.status(500).send(`Fail to update full subscription in database`);
  }
    
});

//Delete full subscription in db
app.delete('/events/fullSubscription', async(req, res) => {
  try {
    const conn = await data.getDatabase();
    const eventId = req.query.eventId;
    const userId = req.query.userId;
    const subscribed = 'N';
    let sql = `UPDATE subscription SET fullSubscription = "${subscribed}" WHERE userId = ${userId}`;
    const [rows, fields] = await conn.execute(sql);
    res.send(JSON.stringify({"result": "User has successfully un-subscribe for the event"}));
  }
  catch(err) {
    res.status(500).send(`Fail to delete full subscription in database`);
  }


app.post('/events/eventsUpdates', (req, res) => {
  const conn = await data.getDatabase();
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
  const conn = await data.getDatabase();
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
  const conn = await data.getDatabase();
  const eventId = req.query.eventId;
  callFullSubsNoti((eventId));
  res.send(JSON.stringify({ "result": " Emails will be sent to all admins for this event" }))
});


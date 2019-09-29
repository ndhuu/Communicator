let data = require('./ConnectionManager');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const body_parser = require('body-parser');
const const_params = require('./Params/params')
const { sendEmail, email_type } = require("./SendMail")

const { task } = require("./scheduler/scheduler")
// schedule tasks to be run on the server
cron.schedule("00 10 1 * * 0-6", function () {
  console.log("Daily Email Notification Sending");
  task()
});

const cron = require("node-cron");

const { callEventUpdateNoti,
  callEventCancelNoti,
  callFullSubsNoti,
  sendConfirmationNoti } = require('./api-call/api');

//server.use(body_parser.json());
//const conn = data.startDatabase();

app.post('/events/eventsUpdates', (req, res) => {
  try {
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
        callEventUpdateNoti(eventId);
      }
    });
  } catch (err) {
    res.status(500).send(`Fail to process events updates notification request`);
  }
});

app.post('/events/cancelNoti', (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).send(`Fail to process cancel event notification request`);
  }
});

//update full subscription in db
app.get('/events/fullSubscription', async (req, res) => {
  try {
    const conn = await data.getDatabase();
    const eventId = req.query.eventId;
    const userId = req.query.userId;
    const subscribed = 'Y';
    let sql = `UPDATE subscription SET fullSubscription = "${subscribed}" WHERE userId = ${userId} AND ${eventId} ;` 
    const [rows, fields] = await conn.execute(sql);
    res.send(JSON.stringify({"result": "User has successfully subscribe for the event"}));
  }
  catch(err) {
    res.status(500).send(`Fail to process update full subscription request in database`);
  }
    
});

//Delete full subscription in db
app.delete('/events/fullSubscription', async(req, res) => {
  try {
    const conn = await data.getDatabase();
    const eventId = req.query.eventId;
    const userId = req.query.userId;
    const subscribed = 'N';
    let sql = `UPDATE subscription SET fullSubscription = "${subscribed}" WHERE userId = ${userId} AND ${eventId} ;` 
    const [rows, fields] = await conn.execute(sql);
    res.send(JSON.stringify({"result": "User has successfully un-subscribe for the event"}));
  }
  catch(err) {
    res.status(500).send(`Fail to process delete full subscription request in database`);
  }
});

app.post('/events/fullSubcriptionNoti', (req, res) => {
  try {
    const conn = await data.getDatabase();
    const eventId = req.query.eventId;
    callFullSubsNoti(eventId);
    res.send(JSON.stringify({ "result": " Emails will be sent to all admins for this event" }))
  } catch (err) {
    res.status(500).send(`Fail to process full subscription admins requestest`);
  }
});

app.post('/events/sendConfirmationNoti', (req, res) => {
  try {
    const conn = await data.getDatabase();
    const eventId = req.query.eventId;
    const userId = req.query.userId;
    sendConfirmationNoti(userId, eventId)
    res.send(JSON.stringify({ "result": " Emails will be sent to this user for this event" }))
  } catch (err) {
    res.status(500).send(`Fail to process semd confirm emails to users`);
  }
});

app.get('/events/upcomingEventSubscription', async (req, res) => {
  try {
    const conn = await data.getDatabase();
    const eventId = req.query.eventId;
    const userId = req.query.userId;
    const subscribed = 'Y';
    let sql = `UPDATE ${const_params.SUBSCRIPTION_DATABASE} SET upcomingSubscription = "${subscribed}" WHERE userId = ${userId} AND eventId = ${eventId};`;
    const [rows, fields] = await conn.execute(sql);
    res.send(JSON.stringify({ "result": "User has successfully subscribe for the event" }));
  }
  catch (err) {
    res.status(500).send(`something went wrong`);
  }

});


app.delete('/events/upcomingEventSubscription', async (req, res) => {
  try {
    const conn = await data.getDatabase();
    const eventId = req.query.eventId;
    const userId = req.query.userId;
    const subscribed = 'N';
    let sql = `UPDATE ${const_params.SUBSCRIPTION_DATABASE} SET upcomingSubscription = "${subscribed}" WHERE userId = ${userId} AND eventId = ${eventId};`;
    const [rows, fields] = await conn.execute(sql);
    res.send(JSON.stringify({ "result": "User has successfully un-subscribe for the event" }));
  }
  catch (err) {
    res.status(500).send(`something went wrong`);
  }
});

app.listen(3001, () => {

  console.log('listening on port 3001');
});
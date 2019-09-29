let data = require('./ConnectionManager');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const body_parser = require('body-parser');

//need to handle err and check if null
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


//Delete product
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
});
 
//Server listening
app.listen(3000,() =>{
  console.log('Server started on port 3000...');
});
// "use strict"

//= ===LIST DEPENDENCIES===//
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');
const cors = require('cors');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const http = require('http');
const engines = require('consolidate');

const url = 'mongodb+srv://tese:Ojk025df.@cluster0-0h4ey.mongodb.net/test?retryWrites=true&w=majority';
const API_PORT = process.env.API_PORT || 3000;

//= ===MONGOOSE CONNECT===//
/* MongoDB Atlas credentials
Name:tese
Pass:Ojk025df.
mongodb+srv://tese:Ojk025df.@cluster0-0h4ey.mongodb.net/test?retryWrites=true&w=majority
*/

mongoose.connect(url, { useCreateIndex: true, useFindAndModify: false, useNewUrlParser: true }, function(err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
  }
});
//= ==================================//

//= === CONFIGURATION ===//
const app = express();
app.engine('html', engines.mustache, { useUnifiedTopology: true });
app.set('view engine', 'html');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const server = http.Server(app);
const websocketIo = socketio(server);
//= ==================================//

//= === IMPORTING SHEMAS ===//
const User = require('./src/models/User.js');
const Labs = require('./src/models/Labs.js');
const UserSession = require('./src/models/UserSession.js');
const Access = require('./src/models/Access.js');

//= ==================================//

//= === MQTT COnfiguration Mqtt ===//
const client = mqtt.connect('mqtt://farmer.cloudmqtt.com', {
  username: 'aivvlaza',
  password: 'qHyhTip002KD',
  port: 16820,
});

//= === MQTT connect to all topics ===//
client.on('connect', function() {
  // Automaticamente todos os topicos!
  Labs.find({}, (err, Labs) => {
    if (err) return handleError(err);

    for (const lab of Labs) {
      // console.log(lab, '========================');
      // console.log(lab.Topic, '========================');
      client.subscribe(lab.ID);
      if (!err) {
        // client.publish(lab.ID, 'Hello mqtt');
      }
    }
  });
});

//= === MQTT FOLDER  ===//
require('./src/mqtt/OpenDoor.js')(app, Labs, Access, client);
// TEST Sending --> client.publish('mqtt/demo', 'hello world!');

//= === Routes FOLDER ===//
fs.readdirSync(`${__dirname}/src/routes`)
  .filter(file => file.indexOf('.') !== 0 && file.slice(-3) === '.js')
  .forEach(file => {
    require(`${__dirname}/src/routes/${file}`)(app, User, Labs, UserSession, Access);
  });
//= ==================================//

// listen (start app with node server.js) ======================================
server.listen(API_PORT, () => {
  console.log(`Listening on port ${API_PORT}`);
});

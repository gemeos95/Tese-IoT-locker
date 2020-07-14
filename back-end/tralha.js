/*
saving data with call back
Users_notifications_data = require("./src/notifications/registerForPushNotificationsAsync.js")(
  app,User,
  (name, token_notificationID) => {
    var booleanTrue = false;
    clients.forEach(element => {
      if (element.name === name) {
        booleanTrue = true;
        element.token_notificationID = token_notificationID;
        console.log(element, "element foi updated mas não atualizado");

        User.findOneAndUpdate(
          { username: name },
          { $set: { token_notificationID: token_notificationID } }
        );
      }
    });

    if (!booleanTrue) {
      var newClient = new Client(name, token_notificationID);
      console.log(newClient, "foi criado este objecto agora");
      clients.push(newClient);

      User.findOneAndUpdate(
        { username: name },
        { $set: { token_notificationID: token_notificationID } }
      );
    }
    console.log(clients, "situação Atual");
  }
); */

/*
To use the web socket, just send the data/message over a named channel.
socket.emit('channel-name', 'Hello world!');

This is identical for both server and client. The other end just has to listen to that named channel.
socket.on('channel-name', (message) => ... some logic );
 */

/* const app = express();
var server = http.Server(app);
var websocket_io = socketio(server);
const Click = "data from socket"; //variavel global
const Toma = true;
//==== SOCKECKETS CONNECTION!!! ==============//
websocket_io.on("connection", socket => {
  console.log("A client just joined on", socket.id);

  socket.emit("teste", { Click: Click, Toma: Toma });

}); */

//= === STARTING ROUTES OF WEBSOCKETS!!!!!! ===//
module.exports = (websocket_io, User) => {
  setInterval(function() {
    User.find(
      {
        username: 'teste2',
      },
      (err, users) => {
        // if there is no match it returns an empty array!
        console.log(users[0].Toma);
        const { Toma } = users[0];
        socket.emit('teste', { Toma });
      }
    );
  }, 3000);
};

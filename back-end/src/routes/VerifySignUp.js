module.exports = (app, User, Labs, UserSession) => {
  app.get('/account/verify', (req, res, next) => {
    // here comes a triky part! the token is something that the client asks in order to give them temporary acess to the website without email/password
    /* instead of having to authenticate with username and password the user 
    obtains a time-limited token, and uses that token for further authentication during the session. */
    // Steps
    // 1º get the token
    const { query } = req; // the query now will be the request
    const { token } = query; // token is the query!
    // console.log(req.query.token, 'token')// the token is obtained by this path

    console.log(token);

    // 2º verify the token is one of a kind and it get deleted
    UserSession.find(
      {
        _id: `${token}`, // taking the token from usersession
        isDeleted: false,
      },
      (err, sessions) => {
        console.log(sessions.userId);
        // if there is no match it returns an empty array!
        console.log(sessions, 'sessions');
        if (err) {
          return res.send({
            success: false,
            message: 'Error:Server error',
          });
        }
        if (sessions.length !== 1) {
          console.log(sessions.length);
          return res.send({
            success: false,
            message: 'Error:Invalid',
          });
        }

        return res.send({
          success: true,
          UserId: sessions[0].userId,
          userName: sessions[0].userName,
          userEmail: sessions[0].userEmail,
          userNumMec: sessions[0].userNumMec,
          message: 'good',
        });
      }
    );
  });
};

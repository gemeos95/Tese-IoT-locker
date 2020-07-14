module.exports = (app, User, Labs, UserSession, Access) => {
  app.get('/account/ShowInitialAccesses', (req, res, next) => {
    // here comes a triky part! the token is something that the client asks in order to give them temporary acess to the website without email/password
    /* instead of having to authenticate with username and password the user 
      obtains a time-limited token, and uses that token for further authentication during the session. */
    // Steps
    // 1º get the token
    const { query } = req; // the query now will be the request
    const { UserId } = query; // token is the query!
    // console.log(req.query.token, 'token')// the token is obtained by this path

    console.log(UserId, 'UserId  ShowInitialAccesses');

    // 2º verify the token is on1e of a kind and it get deleted
    Access.find(
      {
        UserId: `${UserId}`, // taking the token from usersession
        isValidated: true,
      },
      (err, sessions) => {
        console.log(sessions, 'ShowInitialAccesses');
        // if there is no match it returns an empty array!

        if (sessions.length === 0) {
          return res.send({
            success: false,
            message: 'No accesses Validated',
          });
        }

        return res.send({
          success: true,
          message: sessions,
        });
      }
    );
  });
};

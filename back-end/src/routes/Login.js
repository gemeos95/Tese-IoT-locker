// Meter no inicio
/* module.exports = (app, User, Labs) => {};
 */

module.exports = (app, User, Labs, UserSession) => {
  app.post('/account/signin', (req, res, next) => {
    // passing a post request into this route
    // sing-in--> Log in!.
    /* it´s a post request because we will just acept the date from the client
    (passwornd && email) see if it already exists in the Users.shema, and
    then log in. The client is not asking for any information! */

    const { body } = req;
    const { password } = body;
    let { email } = body;

    if (!email) {
      return res.send({
        success: false,
        message: 'Error : Email cannot be balnk.',
      });
    }

    if (!password) {
      return res.send({
        success: false,
        message: 'Error : Password cannot be balnk.',
      });
    }
    email = email.toLowerCase();
    // cheking if it is a valid user and check password
    User.find(
      {
        email, // the response will be only the equal emails!
      },
      (err, users) => {
        // if there is no match it returns an empty array!
        if (users.length === 0) {
          return res.send({
            success: false,
            message: 'Invalid Sing In!',
          });
        }
        if (err) {
          console.log(err, 'erro err');
          return res.send({
            success: false,
            message: `Error: server error${err}`,
          });
        }

        const user = users[0]; // contablizing the first user of the array
        if (!user.validPassword(password)) {
          // if the user inserts the wrong password
          return res.send({
            success: false,
            message: 'Error: Invalid Password', // giving the output of error
          });
        }
        // There is no errors, there is a email and password match betwen client and database
        // correct user!
        const userSession = new UserSession(); // the 2º will update the database
        userSession.userId = user._id; // the user id inserted = to the document id of him
        userSession.userName = user.name; // the user id inserted = to the document id of him
        userSession.userEmail = user.email;
        userSession.userNumMec = user.NumMec;

        userSession.save((err, doc) => {
          if (err) {
            return res.send({
              success: false,
              message: 'Error: server error',
            });
          }
          return res.send({
            success: true,
            message: 'Valid sign in',
            userId: doc.userId,
            userName: doc.userName,
            userEmail: doc.userEmail,
            userNumMec: doc.userNumMec,
            token: doc._id, // sending the id as token to the front-end
          });
        });
      }
    );
  });
};

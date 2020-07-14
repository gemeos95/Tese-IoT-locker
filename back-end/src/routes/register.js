// Meter no inicio
/* module.exports = (app, User, Labs) => {};
 */

/*  =============================================================length===========================================
 */ const validator = require('validator');

module.exports = (app, User, Labs, UserSession) => {
  app.post('/account/signup', (req /* request */, res /* result */, next) => {
    // we are going to posting the signup data onto database!
    // It means that we have to accept in this server the data coming from the front end relative to the body
    // The request is the body, simply because is the only data from the front end that it needs to perform

    // taking the data
    const { body } = req;
    const { NumMec, name, password } = body;
    let { email } = body;
    console.log(NumMec, name, password, email, 'aqui');

    // Making sure that there is no interference with N_mec numbers.

    // cheking the data
    if (!NumMec) {
      console.log('1');
      return res.send({
        success: false,
        message: 'Error: Numero Mecanografico cannot be blank.',
      });
    }

    if (!name) {
      console.log('2');

      return res.send({
        success: false,
        message: 'Error: Name cannot be blank.',
      });
    }

    if (!email) {
      console.log('3');

      return res.send({
        success: false,
        message: 'Error : Email cannot be balnk.',
      });
    }

    if (!password) {
      console.log('4');

      return res.send({
        success: false,
        message: 'Error : Password cannot be balnk.',
      });
    }

    email = email.toLowerCase(); // put the email to lowercase

    // steps:

    // 1- veryfify if it is a valid email
    if (!validator.isEmail(email)) {
      console.log('5');
      return res.send({
        success: false,
        message: 'Insert a Valid email',
      });
    }

    // 2- Verify the email doesn´t exists in the database
    User.find(
      {
        email,
        /* it the User.shema data with the email returned by the state of the front end! */
        /* if there is any equal it returns it as an array in the respose,
   if there is no match it returns an empty array! Is how the .find function works */
      },
      (err, previousUsers /* result */) => {
        if (err) {
          return res.send({
            // res.send() -->Send a response of various types
            success: false,
            message: 'Error: Server error!',
          });
        }

        // COMO ADICIONAR FILTRO DO N_MEC SEM MANDAR 2 VEZES?========================================================================
        /* for (let i = 0; i < previousUsers.length; i++) {
          if (previousUsers[i].NumMec === NumMec) {
            return res.send({
              success: false,
              message: 'Numero Mec already in use',
            });
          }
        } */

        if (previousUsers.length > 0) {
          return res.send({
            success: false,
            message: 'Error: account already exist',
          });
        }

        // if there is no errors and is new user -->create the new user
        const newUser = new User();
        /* newUser = new User represents the database shema created
            the rest are all states from the front end! The body requested parameters */
        newUser.email = email;
        newUser.NumMec = NumMec;
        newUser.password = newUser.generateHash(password);
        newUser.name = name;

        newUser.save((err, user) => {
          // save the new user
          // again another built in function takes the response will be equal to the array newUser
          if (err) {
            console.log(err);
            return res.send({
              success: false,
              message: `Error: SErver error:${err}`,
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
        });
      }
    );
  });
};

/* return res.send({
            success: true,
            message: 'Valid sign in',
            userId: doc.userId,
            token: doc._id, // sending the id as token to the front-end
          }); */

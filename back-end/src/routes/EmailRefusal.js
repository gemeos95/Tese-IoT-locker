const path = require('path');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');

const readHTMLFile = function(path, callback) {
  fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
    if (err) {
      throw err;
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'teseteste123456@gmail.com',
    pass: 'e491GwwG3W9s',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = (app, User, Labs, UserSession, Access) => {
  app.get('/EmailRefusal', (req, res, next) => {
    // here comes a triky part! the token is something that the client asks in order to give them temporary acess to the website without email/password
    /* instead of having to authenticate with username and password the user 
    obtains a time-limited token, and uses that token for further authentication during the session. */
    // Steps
    // 1º get the token
    const { query } = req; // the query now will be the request
    const { AcessId } = query; // AcessId is the query!
    // console.log(req.query.token, 'token')// the token is obtained by this path

    // 2º verify the token is one of a kind and it get deleted
    Access.findOneAndUpdate({ _id: `${AcessId}` }, { $set: { isValidated: false } }, (err, sessions) => {
      console.log(sessions);
      if (err) {
        return res.send({
          success: false,
          message: 'A Server error ocurred',
        });
      }
      if (sessions.length === 0 || !sessions) {
        return res.send({
          success: false,
          message: 'Sorry this request no longer exists',
        });
      }

      readHTMLFile(`${__dirname}src/email/emailstudentRefusal.html`, function(err, html) {
        const template = handlebars.compile(html);

        const replacements = {
          StudentName: sessions.Username,
          LabName: sessions.LabTitle,
          ProfessorName: sessions.Professor,
          ProfessorEmail: sessions.ProfessorEmail,
          DateString: sessions.DataPedida,
          // linkOpenDoor: `http://localhost:3000/EmailRefusal?XXX=${}&XXX=${}&XXX=${}`, // plus token of access
        };
        const htmlToSend = template(replacements);
        const mailOptions = {
          from: 'teseteste12345@gmail.com',
          to: sessions.userEmail,
          // cc: sessions.ProfessorEmail,
          subject: `Request to ${sessions.LabTitle}`,
          html: htmlToSend,
        };
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log(`Email sent: ${info.response}`);
          }
        });
      });

      res.sendFile(path.join(`${__dirname}/emailresponse/Refusal.html`));
    });
  });
};

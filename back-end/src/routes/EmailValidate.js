const path = require('path');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');

// Add time lapse 2h
// Net Casa-Aveiro:192.168.1.127
// Net phone:192.168.43.163
// PCI:192.168.128.1
// PCI_Coworking:192.168.183.25
// Net Casa:192.168.1.83
// Acredita Portugal III: 192.168.1.40
// Casa Cata: 192.168.0.80
const ServerIP = 'http://192.168.43.163';

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
  app.get('/EmailValidate', (req, res, next) => {
    // here comes a triky part! the token is something that the client asks in order to give them temporary acess to the website without email/password
    /* instead of having to authenticate with username and password the user 
    obtains a time-limited token, and uses that token for further authentication during the session. */
    // Steps
    // 1º get the token
    const { query } = req; // the query now will be the request
    const { AcessId } = query; // AcessId is the query!
    // console.log(req.query.token, 'token')// the token is obtained by this path
    // ProfessorEmail, StudentName,   LabName, isValidated, ProfessorName, DateString
    console.log(AcessId, 'access ID');

    // 2º verify the token is one of a kind and it get deleted
    Access.findOneAndUpdate({ _id: `${AcessId}` }, { $set: { isValidated: true } }, (err, sessions) => {
      console.log(sessions, 'sessions');
      if (err) {
        return res.send({
          success: false,
          message: 'A Server error ocurred',
        });
      }

      if (!sessions) {
        return res.send({
          success: false,
          message: 'Sorry this request no longer exists',
        });
      }

      readHTMLFile(`${__dirname}src/email/emailstudentAproval.html`, function(err, html) {
        const template = handlebars.compile(html);

        const replacements = {
          StudentName: sessions.Username,
          LabName: sessions.LabTitle,
          ProfessorName: sessions.Professor,
          DateString: sessions.DataPedida,
          AcessId,
          linkOpeDoor: `${ServerIP}:3000/OpenDoor?AcessId=${AcessId}`, // linkOpenDoor: `http://localhost:3000/EmailRefusal?XXX=${}&XXX=${}&XXX=${}` // plus token of access
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

      res.sendFile(path.join(`${__dirname}/emailresponse/Aproval.html`));
    });
  });
};

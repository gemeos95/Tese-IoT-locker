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

function diff_minutes(DataLastRequest) {
  // GET ACTUAL DATE!!
  const d = new Date();
  const milli = d.getTime(); // miliseconds from base
  const ActualDate = new Date(milli + 3600000); // more 1h (our date UTC+1)

  // GET CHOSEN DATE!!
  const DataLastRequestAtualizado = new Date(DataLastRequest.getTime() + 3600000);

  // /Calculate THE DIFERENCE!
  const diff = ActualDate - DataLastRequestAtualizado; // Vai ser sempre positivo
  const minutes = diff / 1000 / 60;
  const horas = diff / 1000 / 60 / 60;
  // console.log(`${minutes} MINUTES\n ${horas} HOURS`);
  return minutes;
}

module.exports = (app, User, Labs, UserSession, Access) => {
  // read the HTML file using fs module in node and
  // then replace the elements that you want changed in the html string using handlebars

  app.post('/GetAccess', function(req, res) {
    const { body } = req;
    const {
      DataActual,
      DataPedida,
      LabTitle,
      LabID,
      // Username,
      UserId,
      Professor,
      // userNumMec,
      // userEmail,
      ProfessorEmail,
    } = body;

    if (!DataPedida) {
      return res.send({
        success: false,
        message: 'Please select a date.',
      });
    }

    if (!UserId) {
      return res.send({
        success: false,
        message: 'Please LogIn',
      });
    }

    // If user has already asked for that lab without permission

    User.find({ _id: `${UserId}` }, function(err, UserCorrect) {
      console.log(UserCorrect, 'sadas');

      Access.find({ UserId, LabID, isValidated: false }, function(err, PrevRequest) {
        console.log(PrevRequest, 'data do user em relação ao pedido que está a fazer');
        if (PrevRequest.length !== 0) {
          console.log(diff_minutes(PrevRequest[PrevRequest.length - 1].DataActual), 'minutos');
          if (diff_minutes(PrevRequest[PrevRequest.length - 1].DataActual) < 30) {
            const minutes = `${diff_minutes(PrevRequest[PrevRequest.length - 1].DataActual)}`;
            return res.send({
              success: false,
              message: `You have already asked access at ${minutes.substring(
                0,
                4
              )} minutes \n You can only send one request for each 30 minutes`,
            });
          }
        }

        Access.create({
          DataActual,
          DataPedida,
          LabTitle,
          LabID,
          Username: UserCorrect[0].name,
          UserId,
          Professor,
          userNumMec: UserCorrect[0].NumMec,
          userEmail: UserCorrect[0].email,
          ProfessorEmail,
        })
          .then(AccessCreated => {
            // Send Email!! <<=====================================================>>
            console.log(AccessCreated, 'access created NOW');
            readHTMLFile(`${__dirname}src/email/email.html`, function(err, html) {
              const template = handlebars.compile(html);

              const replacements = {
                ProfessorName: Professor,
                StudentName: AccessCreated.Username,
                LabName: LabTitle,
                DateString: DataPedida,
                userNumMec: AccessCreated.userNumMec,
                userEmail: AccessCreated.userEmail,
                ProfessorEmail, // ProfessorEmail, StudentName,   LabName, isValidated, ProfessorName, DateString
                // http://localhost:3000/EmailValidate?AcessId=5d7cd67108fb922eb870df57&userEmail=studenttese12345@gmail.com&ProfessorEmail=profesortese123456@gmail.com&StudentName=Student
                linkValidate: `http://localhost:3000/EmailValidate?AcessId=${
                  AccessCreated._id
                }&UserId=${UserId}&LabID=${LabID}`, // &StateProf=oioi
                linkRefusal: `http://localhost:3000/EmailRefusal?AcessId=${AccessCreated._id}&userEmail=${
                  UserCorrect.email
                }&UserId=${UserId}`, // plus token of access
              };
              const htmlToSend = template(replacements);
              const mailOptions = {
                from: 'teseteste12345@gmail.com',
                to: ProfessorEmail,
                // cc: userEmail,
                subject: `Request to ${LabTitle}`,
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

            return res.send({
              success: true,
              message: `Success. An email was sent to ${Professor}.\n Wait for his confimation`,
              AccessCreated,
            });
          })
          .catch(err => {
            console.log(err);
          });
      });
    });
  });
};

/*   const handlebarOptions = {
    viewEngine: {
      partialsDir: './views',
      defaultLayout: false, // <-----   added this
    },
    viewPath: './views',
  };

  transporter.use('compile', hbs(handlebarOptions));

  const mailOptions = {
    from: 'teseteste12345@gmail.com',
    to: 'joao.martinho.marques95@gmail.com', // prof
    cc: 'joao.martinho.marques95@gmail.com', // estudante
    subject: 'Sending Email using Node.js HTML',
    html: { path: 'src/email/email.html' },
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  }); */

/* readHTMLFile(`${__dirname}src/email/email.html`, function(err, html) {
    const template = handlebars.compile(html);
    const replacements = {
      ProfessorName: 'Profesor 1',
      StudentName: 'Student 1',
      LabName: 'Labe 1',
      DateString: '12/09/2020 hh:mm:ss',
      linkValidate: `https://www.google.pt` // http://localhost:3000/EmailValidate ,
      linkRefusal: `https://www.google.pt`, // http://localhost:3000/EmailRefusal plus token of access
    };
    const htmlToSend = template(replacements);
    const mailOptions = {
      from: 'teseteste12345@gmail.com',
      to: 'joao.martinho.marques95@gmail.com',
      cc: 'joao.martinho.marques95@gmail.com',
      subject: 'Sending Email using Node.js HTML',
      html: htmlToSend,
    };
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  }); */

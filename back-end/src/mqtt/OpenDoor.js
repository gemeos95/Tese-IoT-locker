const path = require('path');

// CALCULATE TIME DIFERENCE <===========================>

function diff_minutes(HoraAcesso) {
  // GET ACTUAL DATE!!
  const d = new Date();
  const milli = d.getTime(); // miliseconds from base
  const ActualDate = new Date(milli + 3600000); // more 1h (our date UTC+1)

  // GET CHOSEN DATE!!

  const HoraAcessoStringDesatualizado = `${HoraAcesso}`;
  const HoraAcessoDesatualizado = new Date(HoraAcessoStringDesatualizado);
  const HoraAcessoAtualizado = new Date(HoraAcessoDesatualizado.getTime() + 3600000);

  // /Calculate THE DIFERENCE!
  const diff = ActualDate - HoraAcessoAtualizado; // Se possitivo é atraso
  const minutes = diff / 1000 / 60;
  const horas = diff / 1000 / 60 / 60;
  // console.log(`${minutes} MINUTES\n ${horas} HOURS\n  User ${name} delay to his chosen hour --> ${hora_pref}`);
  return [minutes, horas];
}

module.exports = (app, Labs, Access, client) => {
  app.get('/OpenDoor', (req, res, next) => {
    const { query } = req; // the query now will be the request
    const { AcessId } = query; // AcessId is the query!
    console.log(AcessId, 'AcessId');
    // FIND  ACCESS!!!!!!!!!
    Access.findOneAndUpdate({ _id: `${AcessId}` }, { $set: { Used: true } }, (err, sessions) => {
      console.log(sessions);
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

      if (sessions.isValidated) {
        console.log('you are letgit to enter!');

        //= ==========================  Add entrance to LAB  ===========================
        Labs.findOneAndUpdate(
          { _id: `${sessions.LabID}` }, // query
          {
            $push: { Used: [{ student: sessions.Username, time: sessions.DataPedida }] },
          }, // Update
          function(err, Lab) {
            console.log(sessions.LabID, 'sessions.LabID');
            console.log(Lab.ID, 'Labid');
            if (err) return handleError(err);
            console.log(
              ` Atualização com successo \n Username: ${sessions.Username} \n Data pedida:${sessions.DataPedida}`
            );

            // Check if time is right!!
            // SENDING!
            const [minutes, horas] = diff_minutes(sessions.DataPedida);

            // Meia hora antes!
            console.log(`ola ${minutes}, não se esqueça da sua toma em 30 minutos`);

            if (minutes >= 0 && minutes <= 120) {
              console.log(`${minutes} depois do pedido`);
              const correct = `${minutes}`.substring(0, 4);

              client.publish(Lab.ID, 'Open Door');
              res.render(path.join(`${__dirname}/emailresponse/Response.html`), {
                enter: 'Porta a abrir!',
                info: `Pedido feito ${correct} depois de hora aceite: ${sessions.DataPedida}`,
              });
            }

            // N faz publish. Antes
            if (minutes < 0) {
              const correct1 = minutes * -1;
              const correct = `${correct1}`.substring(0, 4);

              res.render(path.join(`${__dirname}/emailresponse/Response.html`), {
                enter: 'Acesso recusado!',
                info: ` Ainda faltam ${correct} minutos até á data aceite: ${sessions.DataPedida}. Espere um pouco.`,
              });
            }

            // N faz publish. Depois
            if (minutes > 120) {
              const correct1 = minutes - 120;
              const correct = `${correct1}`.substring(0, 4);

              res.render(path.join(`${__dirname}/emailresponse/Response.html`), {
                enter: 'Acesso recusado!',
                info: ` Já passam ${correct} minutos da data aceite: ${
                  sessions.DataPedida
                }, envie de novo outro pedido`,
              });
            }
          }
        );

        //= ==========================  Sending info via mqtt  ===========================
      } else {
        console.log('you cant enter, the access was not validated yet');
        return res.send({
          success: false,
          message: 'Sorry the access was not validated yet',
        });
      }
    });
  });
};

const LabFiltered = [];

module.exports = (app, User, Labs) => {
  app.get('/updatelabs', (req, res, next) => {
    const { query } = req; // the query now will be the request
    const { StateDep, StateProf } = query; // Username is the query
    // console.log(username); */
    console.log(StateDep, StateProf);

    const DataLabs = [];
    const MissingData = [];
    Labs.find({}, (err, labs) => {
      // if there is no match it returns an empty array!
      if (err) {
        return res.send({
          success: false,
          message: 'Error:Server error',
        });
      }
      if (labs.length === 0) {
        return res.send({
          success: false,
          message: 'No labs',
        });
      }
      /* //Eng.Mechanics
Eng.Physics
Eng.Civil
Professor1 --> mecanica
                
Professor2
                
Professor3
               
// */
      for (let index = 0; index < labs.length; index++) {
        if (
          labs[index].ID &&
          labs[index].Title &&
          labs[index].Description &&
          labs[index].Images.length !== 0 &&
          labs[index].Professor &&
          labs[index].Department
        ) {
          // IF 2 INPUTS
          console.log(labs[index].Department, labs[index].Professor, 'database');
          console.log(StateDep, StateDep, 'f-end');

          if (StateDep && StateProf) {
            console.log('os dois');
            if (StateDep === labs[index].Department && StateProf === labs[index].Professor) {
              DataLabs.push(labs[index]);
              continue;
            }
          }

          // IF 1 INPUTS
          if ((!StateDep && StateProf) || (StateDep && !StateProf)) {
            console.log('só 1');
            if (StateDep === labs[index].Department) {
              DataLabs.push(labs[index]);
              continue;
            }
            if (StateProf === labs[index].Professor) {
              DataLabs.push(labs[index]);
              continue;
            }
          }

          // IF 1 Nothing
          if (!StateDep && !StateProf) {
            DataLabs.push(labs[index]);
          }
        } else {
          MissingData.push(labs[index].ID + 1);
        }
      }

      return res.send({
        success: true,
        message: DataLabs,
        miss: MissingData,
      });
    });
  });
};

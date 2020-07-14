module.exports = (app, User, Labs) => {
  app.get('/getlabs', (req, res, next) => {
    /*  const { query } = req; // the query now will be the request
    const { username } = query; // Username is the query
    // console.log(username); */
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

      for (let index = 0; index < labs.length; index++) {
        console.log(labs[index], index);

        if (
          labs[index].ID &&
          labs[index].Professor &&
          labs[index].Department &&
          labs[index].Title &&
          labs[index].Description &&
          labs[index].Images.length !== 0
        ) {
          DataLabs.push(labs[index]);
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

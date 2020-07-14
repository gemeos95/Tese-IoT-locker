module.exports = (app, User, Labs) => {
  // JUst general route
  app.get('/createlab', function(req, res) {
    const { body } = req;
    const { ID, Professor, Department, Images, Title, Description } = body;

    Labs.create({
      ID,
      Professor,
      Department,
      Images,
      Title,
      Description,
    })
      .then(lab => {
        console.log(lab);
        console.log('Criou lab');
        return res.send({
          success: true,
          message: lab,
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};

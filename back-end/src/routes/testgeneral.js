module.exports = app => {
  // JUst general route
  app.get('/', (req, res, next) => {
    console.log('entrou');
    /*     res.send({ message: 'Hello' });
     */
  });
  app.post('/', (req, res, next) => {
    res.send({ message: 'message from back end' });
  });
};

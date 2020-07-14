module.exports = (app, User, Labs, UserSession) => {
  app.get('/account/logout', (req, res, next) => {
    // Steps
    // 1º get the token
    const { query } = req;
    const { token } = query;
    // token
    // 2º verify the token is one of a kind and it get deleted

    UserSession.findOneAndUpdate(
      { _id: `${token}`, isDeleted: false },
      { $set: { isDeleted: true } },
      (err, sessions) => {
        console.log(sessions);
        if (err) {
          return res.send({
            success: false,
            message: 'Error:Server error',
          });
        }
        return res.send({
          success: true,
          message: 'good',
        });
      }
    );
  });
};

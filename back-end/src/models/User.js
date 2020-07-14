// who loged in who loged out , if they loged in in multiple computers
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// mongoose.Shema is a document data structure that is enforced via application layer!
const UserSchema = new mongoose.Schema({
  NumMec: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    default: '',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// storing in generateHash the return data from bcrypt library (this is to generate the hash)
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null); // returning
};

// storing in validPassword the return data from bcrypt library (this is to validade the password)
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);

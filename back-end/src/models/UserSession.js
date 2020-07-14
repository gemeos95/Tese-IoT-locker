const mongoose = require('mongoose');
// mongoose.Shema is a document data structure that is enforced via application layer!
const UserSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: '',
  },
  userName: {
    type: String,
    default: '',
  },
  userEmail: {
    type: String,
    default: '',
  },
  userNumMec: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('UserSession', UserSessionSchema);

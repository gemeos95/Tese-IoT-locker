const mongoose = require('mongoose');

// mongoose.Shema is a document data structure that is enforced via application layer!
const AccessShema = new mongoose.Schema({
  DataPedida: {
    type: String,
    required: true,
  },
  DataActual: {
    type: Date,
    required: true,
  },
  LabTitle: {
    type: String,
    required: true,
    default: '',
  },
  LabID: {
    type: String,
    required: true,
    default: '',
  },
  Username: {
    type: String,
    default: '',
  },
  UserId: {
    type: String,
    required: true,
    default: '',
  },
  userNumMec: {
    type: String,
    default: '',
  },
  userEmail: {
    type: String,
    default: '',
  },
  Professor: {
    type: String,
    required: true,
    default: '',
  },
  ProfessorEmail: {
    type: String,
    required: true,
    default: '',
  },
  isValidated: {
    type: Boolean,
    default: false,
  },
  Used: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Access', AccessShema);

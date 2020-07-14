const mongoose = require('mongoose');

// mongoose.Shema is a document data structure that is enforced via application layer!
const LabSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
  },
  Professor: {
    type: String,
    required: true,
  },
  ProfessorEmail: {
    type: String,
    required: true,
    default: '',
  },
  Department: {
    type: String,
    required: true,
  }, // Meter Topico como required.
  Topic: {
    type: String,
    default: 'Topic',
  },
  Images: {
    type: Array,
    default: [],
  },
  Used: {
    type: Array,
    default: [],
  },
  Title: {
    type: String,
    default: '',
  },
  Description: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('Labs', LabSchema);

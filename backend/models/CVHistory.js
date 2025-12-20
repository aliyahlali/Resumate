const mongoose = require('mongoose');

const cvHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  originalCVText: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  optimizedCVText: {
    type: String,
    required: true,
  },
  cvHTML: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CVHistory', cvHistorySchema);


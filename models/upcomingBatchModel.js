const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  batchName: {
    type: String,
    required: true,
  },
  batchNo: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timing: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  mentor: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  categorie: {
    type: String,
    enum: ['Regular', 'Weekend'],
    required: true,
  }
});

const upcomingBatchSchema = new mongoose.Schema({
  allbatches: [batchSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model("UpcomingBatch", upcomingBatchSchema);

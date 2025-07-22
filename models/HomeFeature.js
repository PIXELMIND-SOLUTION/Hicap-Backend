const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

const homeFeatureSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  features: [featureSchema]
}, { timestamps: true });

module.exports = mongoose.model("HomeFeature", homeFeatureSchema);

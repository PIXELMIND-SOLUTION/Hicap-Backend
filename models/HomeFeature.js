const mongoose = require('mongoose');

// ✅ Feature Schema
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

// ✅ Home Feature Schema
const homeFeatureSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  features: [featureSchema]
}, { timestamps: true });

// ✅ Quality Schema
const qualitySchema = new mongoose.Schema({
  image: { type: String }, // Single image string, or rename if using multiple
  icon: [{                 // Array of icon objects
    iconLogo: { type: String },
    name: { type: String }
  }]
}, { timestamps: true });

// ✅ Create Models
const Quality = mongoose.model('Quality', qualitySchema);
const HomeFeature = mongoose.model('HomeFeature', homeFeatureSchema);

// ✅ Export both
module.exports = { Quality, HomeFeature };
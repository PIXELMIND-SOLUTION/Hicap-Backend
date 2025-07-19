const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  section: [
    {
      name: { type: String, required: true }
    }
  ],
  city: { type: String, required: true },
  timings: [
    {
      preferred: { type: String, required: true }
    }
  ],
  message: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Enquiry", enquirySchema);

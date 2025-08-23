const mongoose = require("mongoose");

// Batch Schema
const batchSchema = new mongoose.Schema({
  batchName: { type: String, required: true },
  batchNo: { type: String, required: true },
  date: { type: Date, required: true },
  timing: { type: String, required: true },
  duration: { type: String, required: true },
  mentor: { type: String, required: true },
  type: { type: String, required: true },
  categorie: { type: String, enum: ['Regular', 'Weekend'], required: true }
});

// Upcoming Batch Schema
const upcomingBatchSchema = new mongoose.Schema({
  allbatches: [batchSchema]
}, { timestamps: true });

// Upcoming Items Schema
const UpcomingItemSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true }
});

// Upcoming Schema
const UpcomingSchema = new mongoose.Schema({
  upcoming: { type: [UpcomingItemSchema], default: [] }
}, { timestamps: true });

// WhyChoose Items Schema
const WhyChooseItemSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true }
});

// WhyChoose Schema (camelCase field)
const WhyChooseSchema = new mongoose.Schema({
  whyChoose: { type: [WhyChooseItemSchema], default: [] }
}, { timestamps: true });


const detailSchema = new mongoose.Schema({
  image: { type: String, required: true },
  content: { type: String, required: true },
});

const abrodStudentSchema = new mongoose.Schema({
  mainImage: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  details: { type: [detailSchema], default: [] },
}, { timestamps: true });



// Models
const WhyChoose = mongoose.model("WhyChoose", WhyChooseSchema);
const UpcomingBatch = mongoose.model("UpcomingBatch", upcomingBatchSchema);
const Upcoming = mongoose.model("Upcoming", UpcomingSchema);
const AbrodStudent = mongoose.model("AbrodStudent", abrodStudentSchema);

module.exports = { UpcomingBatch, Upcoming, WhyChoose,AbrodStudent };

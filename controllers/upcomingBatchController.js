const {UpcomingBatch,Upcoming,WhyChoose} = require("../models/upcomingBatchModel");
const { uploadImage,uploadToCloudinary,uploadImages,uploadToCloudinarys  } = require('../config/cloudinary1');



// ➕ Create
exports.createUpcomingBatch = async (req, res) => {
  try {
    const { allbatches } = req.body;
    if (!allbatches || !Array.isArray(allbatches) || allbatches.length === 0) {
      return res.status(400).json({ success: false, message: "allbatches is required and must be an array." });
    }

    const batch = await UpcomingBatch.create({ allbatches });
    res.status(201).json({ success: true, data: batch });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// 📥 Read all
exports.getAllUpcomingBatches = async (req, res) => {
  try {
    const batches = await UpcomingBatch.find();
    res.status(200).json({ success: true, data: batches });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



// 📥 Read one
exports.getUpcomingBatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await UpcomingBatch.findById(id);
    if (!batch) return res.status(404).json({ success: false, message: "Batch not found" });
    res.status(200).json({ success: true, data: batch });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



// 🔍 Get batches by categorie (Regular or Weekend)
exports.getBatchesByCategorie = async (req, res) => {
  try {
    const { categorie } = req.params;

    if (!["Regular", "Weekend"].includes(categorie)) {
      return res.status(400).json({ success: false, message: "Invalid categorie value. Use 'Regular' or 'Weekend'." });
    }

    // Find all upcomingBatch documents, but filter only matching batches inside
    const batches = await UpcomingBatch.find({
      "allbatches.categorie": categorie
    });

    // Extract only batches where categorie matches
    const filtered = batches.flatMap(batchDoc =>
      batchDoc.allbatches.filter(batch => batch.categorie === categorie)
    );

    res.status(200).json({ success: true, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// 🔍 Get a single batch by only its own batchId (from any UpcomingBatch document)
exports.getSingleBatchByIdOnly = async (req, res) => {
  try {
    const { batchId } = req.params;

    // Find the document where allbatches._id matches
    const batchDoc = await UpcomingBatch.findOne({ "allbatches._id": batchId });

    if (!batchDoc) {
      return res.status(404).json({ success: false, message: "Batch not found." });
    }

    // Extract the matching batch from allbatches
    const batch = batchDoc.allbatches.id(batchId);

    res.status(200).json({ success: true, data: batch });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};




// ✏️ Update
exports.updateUpcomingBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await UpcomingBatch.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Batch not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ❌ Delete
exports.deleteUpcomingBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UpcomingBatch.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Batch not found" });
    res.status(200).json({ success: true, message: "Batch deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// CREATE upcoming array
exports.createUpcoming = async (req, res) => {
   try {
    const { upcoming } = req.body;

    if (!upcoming) {
      return res.status(400).json({ success: false, message: "Upcoming array is required." });
    }

    let upcomingArray;
    try {
      upcomingArray = JSON.parse(upcoming); // parse stringified JSON
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid upcoming format" });
    }

    if (!Array.isArray(upcomingArray) || upcomingArray.length === 0) {
      return res.status(400).json({ success: false, message: "Upcoming must be a non-empty array." });
    }

    // Upload images
    if (!req.files || req.files.length !== upcomingArray.length) {
      return res.status(400).json({ success: false, message: "Number of images must match upcoming items." });
    }

    for (let i = 0; i < upcomingArray.length; i++) {
      const imageUrl = await uploadImage(req.files[i].buffer, "upcoming");
      upcomingArray[i].image = imageUrl;
    }

    const newUpcoming = await Upcoming.create({ upcoming: upcomingArray });

    res.status(201).json({ success: true, data: newUpcoming });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET all
exports.getAllUpcoming = async (req, res) => {
  try {
    const data = await Upcoming.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET by ID
exports.getUpcomingById = async (req, res) => {
  try {
    const data = await Upcoming.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Upcoming not found" });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE
exports.updateUpcoming = async (req, res) => {
  try {
    let { upcoming } = req.body;

    if (typeof upcoming === "string") upcoming = JSON.parse(upcoming);

    const existing = await Upcoming.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Upcoming not found" });

    const updatedUpcoming = [];

    for (let i = 0; i < upcoming.length; i++) {
      let imageUrl = existing.upcoming[i]?.image || "";

      if (req.files[i]) {
        imageUrl = await uploadImages(req.files[i].buffer);
      }

      updatedUpcoming.push({
        title: upcoming[i].title,
        content: upcoming[i].content,
        image: imageUrl
      });
    }

    existing.upcoming = updatedUpcoming;
    await existing.save();

    res.status(200).json({ success: true, data: existing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE
exports.deleteUpcoming = async (req, res) => {
  try {
    const deleted = await Upcoming.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Upcoming not found" });

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// CREATE WhyChoose array
exports.createWhyChoose = async (req, res) => {
  try {
    let { whyChoose } = req.body;

    if (!whyChoose) {
      return res.status(400).json({ success: false, message: "whyChoose array is required." });
    }

    // Accept JSON string or raw array
    if (typeof whyChoose === "string") {
      try {
        whyChoose = JSON.parse(whyChoose);
      } catch (err) {
        return res.status(400).json({ success: false, message: "Invalid format for whyChoose" });
      }
    }

    if (!Array.isArray(whyChoose) || whyChoose.length === 0) {
      return res.status(400).json({ success: false, message: "whyChoose must be a non-empty array." });
    }

    // Upload images
    if (!req.files || req.files.length !== whyChoose.length) {
      return res.status(400).json({ success: false, message: "Number of images must match whyChoose items." });
    }

    for (let i = 0; i < whyChoose.length; i++) {
      const imageUrl = await uploadImage(req.files[i].buffer, "whyChoose");
      whyChoose[i].image = imageUrl;
    }

    // Save to database
    const newWhyChoose = await WhyChoose.create({ whyChoose });

    res.status(201).json({ success: true, data: newWhyChoose });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET all
exports.getAllWhyChoose = async (req, res) => {
  try {
    const data = await WhyChoose.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET by ID
exports.getWhyChooseById = async (req, res) => {
  try {
    const data = await WhyChoose.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "WhyChoose not found" });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE
exports.updateWhyChoose = async (req, res) => {
  try {
    let { Whychoose } = req.body;

    if (typeof Whychoose === "string") Whychoose = JSON.parse(Whychoose);

    const existing = await WhyChoose.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "WhyChoose not found" });

    const updatedArray = [];

    for (let i = 0; i < Whychoose.length; i++) {
      let imageUrl = existing.Whychoose[i]?.image || "";

      if (req.files[i]) {
        imageUrl = await uploadImage(req.files[i].buffer, "whychoose");
      }

      updatedArray.push({
        title: Whychoose[i].title,
        content: Whychoose[i].content,
        image: imageUrl
      });
    }

    existing.Whychoose = updatedArray;
    await existing.save();

    res.status(200).json({ success: true, data: existing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE
exports.deleteWhyChoose = async (req, res) => {
  try {
    const deleted = await WhyChoose.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "WhyChoose not found" });

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
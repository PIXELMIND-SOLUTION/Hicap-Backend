const UpcomingBatch = require("../models/upcomingBatchModel");

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

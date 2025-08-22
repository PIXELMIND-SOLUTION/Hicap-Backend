const { HomeScreen, HomeFeature,Client,Review,Counter} = require("../models/HomeScreen");
const { uploadImage,uploadToCloudinary,uploadImages,uploadToCloudinarys  } = require('../config/cloudinary1');

// Create or update home screen banners
exports.createOrUpdateHomeScreen = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "At least one banner image is required" });
    }

    const { titles, contents } = req.body;

    // Ensure arrays are aligned
    if (!Array.isArray(titles) || !Array.isArray(contents) || titles.length !== req.files.length || contents.length !== req.files.length) {
      return res.status(400).json({ success: false, message: "titles, contents, and images must have the same length" });
    }

    // Upload images to Cloudinary
    const uploadedUrls = [];
    for (let i = 0; i < req.files.length; i++) {
      const url = await uploadToCloudinary(req.files[i].buffer);
      uploadedUrls.push(url);
    }

    const banners = uploadedUrls.map((url, i) => ({
      image: url,
      title: titles[i],
      content: contents[i]
    }));

    let homeScreen = await HomeScreen.findOne();
    if (!homeScreen) {
      homeScreen = new HomeScreen({ heroBanner: banners });
    } else {
      homeScreen.heroBanner.push(...banners);
    }

    await homeScreen.save();
    res.status(201).json({ success: true, message: "Hero banners added successfully", data: homeScreen });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Get all banners
exports.getAllBanners = async (req, res) => {
  try {
    const homeScreen = await HomeScreen.findOne();
    if (!homeScreen || homeScreen.heroBanner.length === 0) {
      return res.status(404).json({ success: false, message: "No hero banners found" });
    }
    res.status(200).json({ success: true, data: homeScreen.heroBanner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Get banner by ID
exports.getBannerById = async (req, res) => {
  try {
    const { bannerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bannerId)) {
      return res.status(400).json({ success: false, message: "Invalid banner ID" });
    }

    const homeScreen = await HomeScreen.findOne({ "heroBanner._id": bannerId }, { "heroBanner.$": 1 });
    if (!homeScreen) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    res.status(200).json({ success: true, data: homeScreen.heroBanner[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Update banner by ID (supports multiple images)
exports.updateBannerById = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const { titles, contents } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bannerId)) {
      return res.status(400).json({ success: false, message: "Invalid banner ID" });
    }

    // Upload new images (if any)
    let uploadedUrls = [];
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const url = await uploadToCloudinary(req.files[i].buffer, "hero-banners");
        uploadedUrls.push(url);
      }
    }

    // Fetch document and update specific banner inside array
    const homeScreen = await HomeScreen.findOne({ "heroBanner._id": bannerId });
    if (!homeScreen) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    const banner = homeScreen.heroBanner.id(bannerId);
    if (titles && titles.length > 0) banner.title = titles[0];   // single title per banner
    if (contents && contents.length > 0) banner.content = contents[0];
    if (uploadedUrls.length > 0) banner.image = uploadedUrls[0]; // update with new image

    await homeScreen.save();
    res.status(200).json({ success: true, message: "Banner updated successfully", data: banner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Delete banner by ID
exports.deleteBannerById = async (req, res) => {
  try {
    const { bannerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bannerId)) {
      return res.status(400).json({ success: false, message: "Invalid banner ID" });
    }

    const homeScreen = await HomeScreen.findOneAndUpdate(
      { "heroBanner._id": bannerId },
      { $pull: { heroBanner: { _id: bannerId } } },
      { new: true }
    );

    if (!homeScreen) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    res.status(200).json({ success: true, message: "Banner deleted successfully", data: homeScreen.heroBanner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

exports.createHomeFeature = async (req, res) => {
  try {
    const { description } = req.body;
    const features = JSON.parse(req.body.features); // features as array of objects

    const uploadedFeatures = [];

    for (let i = 0; i < features.length; i++) {
      const file = req.files[i];
      if (!file) return res.status(400).json({ message: `Image missing for feature ${i + 1}` });

      const imageUrl = await uploadImages(file.buffer);

      uploadedFeatures.push({
        title: features[i].title,
        content: features[i].content,
        image: imageUrl,
      });
    }

    const homeFeature = await HomeFeature.create({ description, features: uploadedFeatures });

    res.status(201).json({ message: "Home feature created", data: homeFeature });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports. getAllHomeFeatures = async (req, res) => {
  try {
    const data = await HomeFeature.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Fetched successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateHomeFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const features = JSON.parse(req.body.features); // updated features

    const existing = await HomeFeature.findById(id);
    if (!existing) return res.status(404).json({ message: "Feature not found" });

    const updatedFeatures = [];

    for (let i = 0; i < features.length; i++) {
      let imageUrl = existing.features[i]?.image || "";

      // Replace image if new one is uploaded
      if (req.files[i]) {
        imageUrl = await uploadImages(req.files[i].buffer);
      }

      updatedFeatures.push({
        title: features[i].title,
        content: features[i].content,
        image: imageUrl,
      });
    }

    existing.description = description;
    existing.features = updatedFeatures;
    await existing.save();

    res.status(200).json({ message: "Updated successfully", data: existing });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getHomeFeatureById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await HomeFeature.findById(id);
    if (!data) return res.status(404).json({ message: "Feature not found" });

    res.status(200).json({ message: "Fetched successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports. deleteHomeFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await HomeFeature.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Feature not found" });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// CREATE
exports.createReview = async (req, res) => {
  try {
    const { name, rating, content } = req.body;
    let imageUrl = "";

    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer);
    }

    const newReview = await Review.create({
      image: imageUrl,
      name,
      rating,
      content,
    });

    res.status(201).json({ message: "Review created", data: newReview });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// GET ALL
exports.getAllReviews = async (req, res) => {
  try {
    const Reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "All Reviews", data: Reviews });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// GET BY ID
exports.getReviewById = async (req, res) => {
  try {
    const Reviews = await Review.findById(req.params.id);
    if (!Reviews) return res.status(404).json({ message: "Review not found" });
    res.status(200).json({ message: "Review found", data: Review });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// UPDATE
exports.updateReview = async (req, res) => {
  try {
    const { name, rating, content } = req.body;
    const ratingData = await Review.findById(req.params.id);
    if (!ratingData) return res.status(404).json({ message: "Review not found" });

    let imageUrl = ratingData.image;
    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer);
    }

    const updated = await Review.findByIdAndUpdate(
      req.params.id,
      {
        image: imageUrl,
        name,
        rating,
        content,
      },
      { new: true }
    );

    res.status(200).json({ message: "Review updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// DELETE
exports.deleteReview = async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Review not found" });

    res.status(200).json({ message: "Review deleted", data: deleted });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};


exports.createClient = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const imageUrls = [];

    for (const file of req.files) {
      const imageUrl = await uploadImage(file.buffer);
      imageUrls.push(imageUrl);
    }

    const newClient = await Client.create({
      content: content,
      image: imageUrls,
    });

    res.status(201).json({ message: "Client created", data: newClient });
  } catch (err) {
    res.status(500).json({ message: "Creation failed", error: err.message });
  }
};

// Get All
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get by ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.status(200).json(client);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update
exports.updateClient = async (req, res) => {
  try {
    const { content } = req.body;
    const existing = await Client.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Client not found" });

    let imageUrls = existing.image;

    if (req.files && req.files.length > 0) {
      imageUrls = [];

      for (const file of req.files) {
        const imageUrl = await uploadImage(file.buffer);
        imageUrls.push(imageUrl);
      }
    }

    existing.content = content || existing.content;
    existing.image = imageUrls;

    await existing.save();
    res.status(200).json({ message: "Client updated", data: existing });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete
exports.deleteClient = async (req, res) => {
  try {
    const deleted = await Client.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Client not found" });
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Create Counter
exports.createCounter = async (req, res) => {
  try {
    const { counters } = req.body;

    if (!Array.isArray(counters) || counters.length === 0) {
      return res.status(400).json({ success: false, message: "Counters array is required." });
    }

    const newCounterArray = new Counter({ counters });
    await newCounterArray.save();

    res.status(201).json({ success: true, data: newCounterArray });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// Get All Counters
exports.getCounters = async (req, res) => {
  try {
    const data = await Counter.find();
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Single Counter
exports.getCounterById = async (req, res) => {
  try {
    const { id } = req.params;

    const counterArray = await Counter.findById(id);
    if (!counterArray) {
      return res.status(404).json({ success: false, message: "Counter array not found." });
    }

    res.status(200).json({ success: true, data: counterArray });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// Update Counter
exports.updateCounter = async (req, res) => {
  try {
    const { id } = req.params;
    const { counters } = req.body;

    if (!Array.isArray(counters)) {
      return res.status(400).json({ success: false, message: "Counters must be an array." });
    }

    const updated = await Counter.findByIdAndUpdate(
      id,
      { counters },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Counter array not found." });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Counter
exports.deleteCounter = async (req, res) => {
    try {
    const { id } = req.params;
    const deleted = await Counter.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Counter array not found." });
    }

    res.status(200).json({ success: true, message: "Deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
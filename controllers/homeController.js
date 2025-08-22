// const { Home, HomeCourses, Review } = require("../models/homeModel");
// const { uploadImage } = require('../config/cloudinary');
// // Create Home
// exports.createHome = async (req, res) => {
//   try {
//     const { name } = req.body;
//     if (!req.file) return res.status(400).json({ message: "Image is required" });

//     const imageUrl = await uploadImage(req.file.buffer);

//     const homeData = await Home.create({ name, image: imageUrl });

//     res.status(201).json({ message: "Home created successfully", data: homeData });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating home", error: error.message });
//   }
// };

// // Get All
// exports.getAllHomes = async (req, res) => {
//   try {
//     const homes = await Home.find();
//     res.status(200).json({ message: "All Homes", data: homes });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching homes", error: error.message });
//   }
// };

// // Get by ID
// exports.getHomeById = async (req, res) => {
//   try {
//     const home = await Home.findById(req.params.id);
//     if (!home) return res.status(404).json({ message: "Home not found" });

//     res.status(200).json({ message: "Home fetched", data: home });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching home", error: error.message });
//   }
// };

// // Update Home
// exports.updateHome = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const home = await Home.findById(req.params.id);
//     if (!home) return res.status(404).json({ message: "Home not found" });

//     if (req.file) {
//       const imageUrl = await uploadImage(req.file.buffer);
//       home.image = imageUrl;
//     }

//     home.name = name || home.name;

//     await home.save();

//     res.status(200).json({ message: "Home updated", data: home });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating home", error: error.message });
//   }
// };

// // Delete
// exports.deleteHome = async (req, res) => {
//   try {
//     const home = await Home.findByIdAndDelete(req.params.id);
//     if (!home) return res.status(404).json({ message: "Home not found" });

//     res.status(200).json({ message: "Home deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting home", error: error.message });
//   }
// };


// // POST: Create
// exports.createHomeCourses = async (req, res) => {
//   try {
//     const { title, name, content } = req.body;
//     if (!req.file) return res.status(400).json({ message: 'Image is required' });

//     const imageUrl = await uploadImage(req.file.buffer);

//     const homeCourses = await HomeCourses.create({ title, name, content, image: imageUrl });
//     res.status(201).json({ message: 'Created successfully', data: homeCourses });
//   } catch (error) {
//     res.status(500).json({ message: 'Creation failed', error: error.message });
//   }
// };

// // GET: All
// exports.getAllHomeCourses = async (req, res) => {
//   try {
//     const data = await HomeCourses.find();
//     res.status(200).json({ message: 'Fetched successfully', data });
//   } catch (error) {
//     res.status(500).json({ message: 'Fetch failed', error: error.message });
//   }
// };

// // GET: By ID
// exports.getHomeCoursesById = async (req, res) => {
//   try {
//     const data = await HomeCourses.findById(req.params.id);
//     if (!data) return res.status(404).json({ message: 'Not found' });
//     res.status(200).json({ message: 'Fetched successfully', data });
//   } catch (error) {
//     res.status(500).json({ message: 'Error', error: error.message });
//   }
// };

// // PUT: Update
// exports.updateHomeCourses = async (req, res) => {
//   try {
//     const { title, name, content } = req.body;
//     const updateData = { title, name, content };

//     if (req.file) {
//       const imageUrl = await uploadImage(req.file.buffer);
//       updateData.image = imageUrl;
//     }

//     const updated = await HomeCourses.findByIdAndUpdate(req.params.id, updateData, { new: true });
//     if (!updated) return res.status(404).json({ message: 'Not found' });

//     res.status(200).json({ message: 'Updated successfully', data: updated });
//   } catch (error) {
//     res.status(500).json({ message: 'Update failed', error: error.message });
//   }
// };

// // DELETE
// exports.deleteHomeCourses = async (req, res) => {
//   try {
//     const deleted = await HomeCourses.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: 'Not found' });

//     res.status(200).json({ message: 'Deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Delete failed', error: error.message });
//   }
// };

// // CREATE
// exports.createReview = async (req, res) => {
//   try {
//     const { name, rating, content } = req.body;
//     let imageUrl = "";

//     if (req.file) {
//       imageUrl = await uploadImage(req.file.buffer);
//     }

//     const newReview = await Review.create({
//       image: imageUrl,
//       name,
//       rating,
//       content,
//     });

//     res.status(201).json({ message: "Review created", data: newReview });
//   } catch (err) {
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// };

// // GET ALL
// exports.getAllReviews = async (req, res) => {
//   try {
//     const Reviews = await Review.find().sort({ createdAt: -1 });
//     res.status(200).json({ message: "All Reviews", data: Reviews });
//   } catch (err) {
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// };

// // GET BY ID
// exports.getReviewById = async (req, res) => {
//   try {
//     const Reviews = await Review.findById(req.params.id);
//     if (!Reviews) return res.status(404).json({ message: "Review not found" });
//     res.status(200).json({ message: "Review found", data: Review });
//   } catch (err) {
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// };

// // UPDATE
// exports.updateReview = async (req, res) => {
//   try {
//     const { name, rating, content } = req.body;
//     const ratingData = await Review.findById(req.params.id);
//     if (!ratingData) return res.status(404).json({ message: "Review not found" });

//     let imageUrl = ratingData.image;
//     if (req.file) {
//       imageUrl = await uploadImage(req.file.buffer);
//     }

//     const updated = await Review.findByIdAndUpdate(
//       req.params.id,
//       {
//         image: imageUrl,
//         name,
//         rating,
//         content,
//       },
//       { new: true }
//     );

//     res.status(200).json({ message: "Review updated", data: updated });
//   } catch (err) {
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// };

// // DELETE
// exports.deleteReview = async (req, res) => {
//   try {
//     const deleted = await Review.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: "Review not found" });

//     res.status(200).json({ message: "Review deleted", data: deleted });
//   } catch (err) {
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// };

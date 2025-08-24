const Course = require("../models/coursesModel");
const { uploadToCloudinary} = require("../config/cloudinary1");
const mongoose = require("mongoose");



exports.createCourse = async (req, res) => {
   try {
    const {
      name,
      description,
      mode,
      category,
      subcategory,
      duration,
      faq,
      features,
      reviews,
      toolsImages // Added toolsImages field
    } = req.body;

    // Parse JSON fields
    const faqArray = faq ? JSON.parse(faq) : [];
    const featuresArray = features ? JSON.parse(features) : [];
    let reviewsArray = reviews ? JSON.parse(reviews) : [];
    const toolsImagesArray = toolsImages ? JSON.parse(toolsImages) : []; // Parse toolsImages

    // Extract files
    const files = req.files || [];
    console.log("Uploaded files:", files.map(f => ({ fieldname: f.fieldname, originalname: f.originalname })));
    
    const mainImageFile = files.find(file => file.fieldname === "image");
    const featureFiles = files.filter(file => file.fieldname === "featureImages" || file.fieldname === "featureImages[]");
    const toolsFiles = files.filter(file => file.fieldname === "toolsImages" || file.fieldname === "toolsImages[]"); // Added tools files
    const reviewFiles = files.filter(file => 
      file.fieldname === "reviewImages" || 
      file.fieldname === "reviewImages[]" ||
      file.fieldname === "reviewImage" ||
      file.fieldname === "reviewImage[]"
    );

    // Upload main image
    if (!mainImageFile) {
      return res.status(400).json({ success: false, message: "Main image is required" });
    }
    const courseImageUrl = await uploadToCloudinary(mainImageFile.buffer, "courses/main");

    // Upload feature images
    const featureImageUrls = [];
    for (const file of featureFiles) {
      const uploadedUrl = await uploadToCloudinary(file.buffer, "courses/features");
      featureImageUrls.push(uploadedUrl);
    }

    const featuresWithImages = featuresArray.map((feature, index) => ({
      ...feature,
      image: featureImageUrls[index] || null
    }));

    // Upload tools images (NEW)
    const toolsImageUrls = [];
    for (const file of toolsFiles) {
      const uploadedUrl = await uploadToCloudinary(file.buffer, "courses/tools");
      toolsImageUrls.push(uploadedUrl);
    }

    // Upload review images
    const reviewImageUrls = [];
    for (const file of reviewFiles) {
      const uploadedUrl = await uploadToCloudinary(file.buffer, "courses/reviews");
      reviewImageUrls.push(uploadedUrl);
    }

    // Map review images to reviews
    reviewsArray = reviewsArray.map((review, index) => ({
      ...review,
      image: reviewImageUrls[index] || null
    }));

    // Validate that all reviews have images
    const reviewsWithoutImages = reviewsArray.filter(r => !r.image);
    if (reviewsWithoutImages.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Each review must have an image uploaded",
        missingImagesForReviews: reviewsWithoutImages.map(r => r.name)
      });
    }

    // Validate that number of review images matches number of reviews
    if (reviewImageUrls.length !== reviewsArray.length) {
      return res.status(400).json({
        success: false,
        message: "Number of review images must match number of reviews",
        reviewsCount: reviewsArray.length,
        reviewImagesCount: reviewImageUrls.length
      });
    }

    // Create course
    const course = new Course({
      name,
      description,
      mode,
      category,
      subcategory,
      duration,
      faq: faqArray,
      features: featuresWithImages,
      reviews: reviewsArray,
      image: courseImageUrl,
      toolsImages: toolsImageUrls // Store tools images instead of featureImages
    });

    await course.save();

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating course",
      error: error.message
    });
  }
};
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      message: "Courses fetched successfully",
      count: courses.length,
      data: courses 
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching courses", 
      error: error.message 
    });
  }
};

// Get Course By ID
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid Course ID format" 
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: "Course not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Course fetched successfully",
      data: course 
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching course", 
      error: error.message 
    });
  }
};

// Get Courses By Category (based on category name)
exports.getCourseByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ 
        success: false, 
        message: "Category name is required" 
      });
    }

    const courses = await Course.find({ 
      category: { $regex: new RegExp(category, 'i') } 
    }).sort({ createdAt: -1 });

    if (courses.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: `No courses found in category: ${category}` 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: `Courses in category '${category}' fetched successfully`,
      count: courses.length,
      data: courses 
    });
  } catch (error) {
    console.error("Error fetching courses by category:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching courses by category", 
      error: error.message 
    });
  }
};

// Update Course By ID
exports.updateCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid Course ID format" 
      });
    }

    // Check if course exists
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return res.status(404).json({ 
        success: false, 
        message: "Course not found" 
      });
    }

    const {
      name,
      description,
      mode,
      category,
      subcategory,
      duration,
      faq,
      features,
      reviews,
      toolsImages
    } = req.body;

    // Prepare update data
    const updateData = {
      name: name || existingCourse.name,
      description: description || existingCourse.description,
      mode: mode || existingCourse.mode,
      category: category || existingCourse.category,
      subcategory: subcategory || existingCourse.subcategory,
      duration: duration || existingCourse.duration
    };

    // Handle file uploads if any
    const files = req.files || [];
    const mainImageFile = files.find(file => file.fieldname === "image");
    const featureFiles = files.filter(file => file.fieldname === "featureImages" || file.fieldname === "featureImages[]");
    const toolsFiles = files.filter(file => file.fieldname === "toolsImages" || file.fieldname === "toolsImages[]");
    const reviewFiles = files.filter(file => file.fieldname.startsWith("reviewImages"));

    // Upload new main image if provided
    if (mainImageFile) {
      updateData.image = await uploadToCloudinary(mainImageFile.buffer, "courses/main");
    }

    // Handle feature images and data
    if (featureFiles.length > 0 || features) {
      const featureImageUrls = [...existingCourse.features.map(f => f.image)];
      
      // Upload new feature images
      for (const file of featureFiles) {
        const uploadedUrl = await uploadToCloudinary(file.buffer, "courses/features");
        featureImageUrls.push(uploadedUrl);
      }

      // Update features with images
      if (features) {
        const featuresArray = JSON.parse(features);
        updateData.features = featuresArray.map((feature, index) => ({
          ...feature,
          image: featureImageUrls[index] || feature.image || null
        }));
      }
    }

    // Handle tools images
    if (toolsFiles.length > 0 || toolsImages) {
      const toolsImageUrls = [...existingCourse.toolsImages];
      
      // Upload new tools images
      for (const file of toolsFiles) {
        const uploadedUrl = await uploadToCloudinary(file.buffer, "courses/tools");
        toolsImageUrls.push(uploadedUrl);
      }
      
      updateData.toolsImages = toolsImages ? [...toolsImageUrls, ...JSON.parse(toolsImages)] : toolsImageUrls;
    }

    // Handle review images and data
    if (reviewFiles.length > 0 || reviews) {
      let reviewsArray = reviews ? JSON.parse(reviews) : existingCourse.reviews;
      const reviewImageUrls = [];
      
      // Upload new review images
      for (const file of reviewFiles) {
        const uploadedUrl = await uploadToCloudinary(file.buffer, "courses/reviews");
        reviewImageUrls.push(uploadedUrl);
      }
      
      // Combine existing review images with new ones
      const existingReviewImages = existingCourse.reviews.map(r => r.image);
      const allReviewImages = [...existingReviewImages, ...reviewImageUrls];
      
      updateData.reviews = reviewsArray.map((review, index) => ({
        ...review,
        image: allReviewImages[index] || review.image
      }));
    }

    // Handle FAQ
    if (faq) {
      updateData.faq = JSON.parse(faq);
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id, 
      updateData, 
      { 
        new: true, 
        runValidators: true 
      }
    );

    res.status(200).json({ 
      success: true, 
      message: "Course updated successfully", 
      data: updatedCourse 
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error updating course", 
      error: error.message 
    });
  }
};

// Delete Course By ID
exports.deleteCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid Course ID format" 
      });
    }

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ 
        success: false, 
        message: "Course not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Course deleted successfully",
      data: {
        id: deletedCourse._id,
        name: deletedCourse.name
      }
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error deleting course", 
      error: error.message 
    });
  }};
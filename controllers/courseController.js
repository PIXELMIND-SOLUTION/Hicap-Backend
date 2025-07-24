const Course = require("../models/coursesModel");
const { uploadToCloudinary } = require("../config/cloudinary");
const fs = require("fs");

// ✅ CREATE COURSE (with proper file handling)
exports.createCourse = async (req, res) => {
  try {
    // Destructure all fields from processed request body
    const {
      name,
      description,
      mode,
      category,
      subcategory,
      duration,
      noOfLessons,
      noOfStudents,
      price,
      isPopular,
      isHighRated,
      status,
      faq = [],
      courseObject = [],
      features = []
    } = req.body;

    // 1. Handle Main Image Upload
    let courseImage = "";
    const mainImageFile = req.files?.find(f => f.fieldname === 'image');
    if (mainImageFile) {
      const result = await uploadToCloudinary(mainImageFile.path, "courses");
      courseImage = result.secure_url;
      fs.unlinkSync(mainImageFile.path); // Cleanup temp file
    }

    // 2. Process Feature Images
    const processedFeatures = await Promise.all(
      features.map(async (feature) => {
        if (feature.image && feature.image.startsWith("uploads")) {
          const result = await uploadToCloudinary(feature.image, "courses/features");
          fs.unlinkSync(feature.image); // Cleanup temp file
          return { ...feature, image: result.secure_url };
        }
        return feature;
      })
    );

    console.log("kkkk",req.body);

    // 3. Create Course Document
    const course = new Course({
      name,
      description,
      mode,
      category,
      subcategory,
      duration,
      noOfLessons,
      noOfStudents,
      price,
      isPopular: isPopular === "true",
      isHighRated: isHighRated === "true",
      status,
      image: courseImage,
      features: processedFeatures,
      faq,
      courseObject
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course
    });

  } catch (error) {
    console.error("Error in createCourse:", error);
    
    // Cleanup any uploaded files if error occurs
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({ 
      success: false, 
      message: error.message.includes("validation") 
        ? error.message 
        : "Internal server error" 
    });
  }
};

// ✅ GET ALL COURSES (with sorting)
exports.getAllCourses = async (req, res) => {
  try {
    const { sort = "-createdAt", limit } = req.query;
    const courses = await Course.find()
      .sort(sort)
      .limit(parseInt(limit) || undefined);

    res.status(200).json({ 
      success: true, 
      count: courses.length,
      data: courses 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// ✅ GET SINGLE COURSE (with existence check)
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: "Course not found" 
      });
    }
    res.status(200).json({ 
      success: true, 
      data: course 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// ✅ UPDATE COURSE (with proper file handling)
exports.updateCourse = async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // 1. Handle Main Image Update
    if (req.files?.image) {
      const result = await uploadToCloudinary(req.files.image[0].path, "courses");
      updates.image = result.secure_url;
      fs.unlinkSync(req.files.image[0].path);
    }

    // 2. Process Feature Updates
    if (req.body.features) {
      updates.features = await Promise.all(
        req.body.features.map(async (feature) => {
          if (feature.image && feature.image.startsWith("uploads")) {
            const result = await uploadToCloudinary(feature.image, "courses/features");
            fs.unlinkSync(feature.image);
            return { ...feature, image: result.secure_url };
          }
          return feature;
        })
      );
    }

    // 3. Apply Updates
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: "Course not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Course updated",
      data: course 
    });

  } catch (err) {
    console.error("Error in updateCourse:", err);
    
    // Cleanup files if error occurred
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

// ✅ DELETE COURSE (with existence check)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: "Course not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Course deleted",
      data: course 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};
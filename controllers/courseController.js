const Course = require("../models/coursesModel");
const { uploadToCloudinary } = require("../config/cloudinary");
const fs = require('fs');
const path = require('path');

exports.createCourse = async (req, res) => {
  try {
    // 1. Parse incoming data
    const body = req.body.data ? JSON.parse(req.body.data) : req.body;
    
    // 2. Initialize variables for file uploads
    let courseImage = '';
    const processedFeatures = [];

    // 3. Upload main course image
    if (req.files?.image?.[0]) {
      const image = req.files.image[0];
      
      // Verify file exists before uploading
      if (fs.existsSync(image.path)) {
        courseImage = await uploadToCloudinary(image.path, "uploads");
        fs.unlinkSync(image.path); // Clean up temp file
      } else {
        console.warn(`File not found at path: ${image.path}`);
      }
    }

    // 4. Process feature images
    if (body.features && Array.isArray(body.features)) {
      for (let i = 0; i < body.features.length; i++) {
        const fileKey = `features[${i}][image]`;
        if (req.files[fileKey]?.[0]) {
          const featureFile = req.files[fileKey][0];
          
          if (fs.existsSync(featureFile.path)) {
            const imageUrl = await uploadToCloudinary(featureFile.path, "uploads/features");
            fs.unlinkSync(featureFile.path); // Clean up temp file
            body.features[i].image = imageUrl;
          } else {
            console.warn(`File not found at path: ${featureFile.path}`);
          }
        }
        processedFeatures.push(body.features[i]);
      }
    }

    // 5. Create course document
    const newCourse = await Course.create({
      name: body.name,
      description: body.description,
      mode: body.mode || 'online',
      category: body.category,
      subcategory: body.subcategory,
      duration: body.duration,
      noOfLessons: body.noOfLessons || 0,
      noOfStudents: body.noOfStudents || 0,
      price: body.price,
      rating: body.rating || 0,
      reviewCount: body.reviewCount || 0,
      isPopular: body.isPopular || false,
      isHighRated: body.isHighRated || false,
      status: body.status || 'available',
      image: courseImage,
      features: processedFeatures,
      faq: body.faq || [],
      courseObject: body.courseObject || []
    });

    // 6. Return success response
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse
    });

  } catch (error) {
    console.error("Create course error:", error);
    
    // 7. Cleanup any uploaded files if error occurs
    if (req.files) {
      Object.values(req.files).flat().forEach(file => {
        try {
          if (file?.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (cleanupError) {
          console.error("Error cleaning up file:", cleanupError);
        }
      });
    }

    // 8. Error response
    const statusCode = error.name === 'ValidationError' ? 400 : 500;
    const message = error.name === 'ValidationError' 
      ? error.message 
      : 'Internal server error';
      
    res.status(statusCode).json({ 
      success: false, 
      message 
    });
  }
};



// GET ALL COURSES
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET SINGLE COURSE BY ID
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



exports.updateCourse = async (req, res) => {
  try {
    // 1. Prepare updates object
    const courseId = req.params.id;
    const requestBody = req.body;
    const requestFiles = req.files;
    const courseUpdates = { ...requestBody };

    // 2. Handle main image update
    if (requestFiles?.image?.[0]) {
      const mainImageFile = requestFiles.image[0];
      const mainImagePath = mainImageFile.path;
      
      if (fs.existsSync(mainImagePath)) {
        try {
          const mainImageUrl = await uploadToCloudinary(mainImagePath, "uploads");
          courseUpdates.image = mainImageUrl;
        } catch (uploadError) {
          console.error('Main image upload failed:', uploadError);
          throw new Error('Failed to upload main course image');
        } finally {
          fs.unlinkSync(mainImagePath);
        }
      }
    }

    // 3. Process feature images
    if (requestBody.features && Array.isArray(requestBody.features)) {
      const updatedFeatures = await Promise.all(
        requestBody.features.map(async (featureData, featureIndex) => {
          const featureImageKey = `features[${featureIndex}][image]`;
          
          // Check for new feature image upload
          if (requestFiles[featureImageKey]?.[0]) {
            const featureImageFile = requestFiles[featureImageKey][0];
            const featureImagePath = featureImageFile.path;
            
            if (fs.existsSync(featureImagePath)) {
              try {
                const featureImageUrl = await uploadToCloudinary(featureImagePath, "uploads/features");
                featureData.image = featureImageUrl;
              } catch (featureUploadError) {
                console.error(`Feature ${featureIndex} image upload failed:`, featureUploadError);
                throw new Error(`Failed to upload feature image ${featureIndex}`);
              } finally {
                fs.unlinkSync(featureImagePath);
              }
            }
          }
          
          // Preserve existing image if no new upload
          if (!featureData.image) {
            const existingCourseData = await Course.findById(courseId);
            if (existingCourseData?.features?.[featureIndex]?.image) {
              featureData.image = existingCourseData.features[featureIndex].image;
            }
          }
          
          return featureData;
        })
      );
      
      courseUpdates.features = updatedFeatures;
    }

    // 4. Update course in database
    const updatedCourseDocument = await Course.findByIdAndUpdate(
      courseId,
      courseUpdates,
      { 
        new: true,
        runValidators: true,
        context: 'query'
      }
    );

    // 5. Handle course not found
    if (!updatedCourseDocument) {
      return res.status(404).json({
        success: false,
        message: "No course found with the provided ID",
        courseId: courseId
      });
    }

    // 6. Send success response
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      updatedCourse: updatedCourseDocument
    });

  } catch (error) {
    // 7. Error handling and cleanup
    if (req.files) {
      Object.values(req.files).flat().forEach(fileObject => {
        try {
          if (fileObject?.path && fs.existsSync(fileObject.path)) {
            fs.unlinkSync(fileObject.path);
          }
        } catch (fileCleanupError) {
          console.error('Error cleaning up file:', fileCleanupError);
        }
      });
    }

    // 8. Determine appropriate status code
    const errorStatusCode = error.name === 'ValidationError' ? 400 : 500;
    const errorResponseMessage = error.name === 'ValidationError' 
      ? error.message 
      : 'An error occurred while updating the course';

    res.status(errorStatusCode).json({
      success: false,
      error: error.name,
      message: errorResponseMessage,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
// DELETE COURSE
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
      message: "Course deleted successfully",
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
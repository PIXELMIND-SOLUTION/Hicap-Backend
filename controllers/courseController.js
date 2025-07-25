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
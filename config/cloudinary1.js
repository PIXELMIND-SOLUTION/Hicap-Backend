const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const streamifier = require("streamifier");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload buffer directly using upload_stream
const uploadImage = (fileBuffer, folderName = "uploads") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folderName, resource_type: "auto" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// Make uploadToCloudinary also work with buffer (unify both)
const uploadToCloudinary = async (fileBuffer, folderName = "uploads") => {
  try {
    return await uploadImage(fileBuffer, folderName); // reuse buffer upload
  } catch (error) {
    throw error;
  }
};

const uploadImages = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "uploads" }, // Changed from "courses"
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

const uploadToCloudinarys = async (filePath, folderName = "uploads") => { // Changed default folder
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    throw error;
  }
};


module.exports = { cloudinary, uploadImage, uploadToCloudinary,uploadImages,uploadToCloudinarys };

const multer = require('multer');

const storage = multer.memoryStorage(); // Save to memory buffer for stream upload
const upload = multer({ storage });

module.exports = upload;

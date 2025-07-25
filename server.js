const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const aboutRoutes = require("./routes/AboutUSRoute");
const enquiryRoutes = require('./routes/EnquiryRoutes');
const contentRoutes = require("./routes/contentRoutes");
const homeRoutes = require('./routes/homeRoute');
const homeFeatureRoutes = require('./routes/homeFeatureRoutes');
const mentorRoutes = require("./routes/ourMentorRoute");
const faqRoutes = require("./routes/faqRoutes");
const courseRoutes = require("./routes/courseRoutes");
const user = require('./routes/registerUserRoute');

const path = require("path");
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: "*" }
});

// Attach Socket.IO to app
app.set('io', io);

app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected')
  })
  .catch((err) => {
    console.log('Mongo Error:', err)}
);



// ✅ Routes
app.use("/api", aboutRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use("/api", contentRoutes);
app.use('/api', homeRoutes);
app.use("/api/home-features", homeFeatureRoutes);
app.use("/api/our-mentor", mentorRoutes);
app.use("/api", faqRoutes);
app.use("/api", courseRoutes);
app.use('/api', user);





// Socket.IO connection
io.on('connection', (socket) => {
  console.log(' Socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log(' Socket disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
    console.log(`🚀 server running on port ${PORT}`)
});

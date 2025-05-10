// const express = require('express');
// const mongoose = require('mongoose');
// const connectDB = require('./config/db');
// const dotenv = require('dotenv');
// const cors = require('cors');

// dotenv.config();  

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // **Static File Serving (Uploads Folder)**
// app.use('/uploads', express.static('uploads'));  

// // **Routes**
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/blogs', require('./routes/blogRoutes'));  
// app.use('/api/result', require('./routes/resultRoutes'));
// app.use('/api/registration', require('./routes/registrationRoutes'));
// app.use('/api/contact', require('./routes/contactFormRoutes'));

// // Start Server
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/result', require('./routes/resultRoutes'));
app.use('/api/registration', require('./routes/registrationRoutes'));
app.use('/api/contact', require('./routes/contactFormRoutes'));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
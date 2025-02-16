const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();  // This should be at the very top
const cors = require('cors');
app.use(cors());

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/result', require('./routes/resultRoutes'));
app.use('/api/registration', require('./routes/registrationRoutes'));
app.use('/api/contact', require('./routes/contactFormRoutes'));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
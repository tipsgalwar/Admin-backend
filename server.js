const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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

// Secret Key (Ensure it's stored securely)
const SECRET_KEY = process.env.SECRET_KEY || "MY_SECRET_KEY";

// Dummy Predefined User (Hardcoded for Testing)
const PREDEFINED_USER = {
    username: "tipsgalwar",
    password: bcrypt.hashSync("abhishek009", 10)  // Hashing Password
};

// 🔹 **Login Route (JWT Generate करेगा)**
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    if (username !== PREDEFINED_USER.username) {
        return res.status(401).json({ message: "Invalid Username" });
    }

    // Password Check
    const isMatch = await bcrypt.compare(password, PREDEFINED_USER.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ message: "Login Successful", token });
});

app.get("/api/protected", (req, res) => {
    const token = req.header("Authorization");

    if (!token) return res.status(401).json({ message: "Access Denied. No Token Provided." });

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        res.json({ message: `Welcome ${verified.username}, You have accessed a protected route!` });
    } catch (err) {
        res.status(403).json({ message: "Invalid Token" });
    }
});

// Existing Routes
app.use('/api/result', require('./routes/resultRoutes'));
app.use('/api/registration', require('./routes/registrationRoutes'));
app.use('/api/contact', require('./routes/contactFormRoutes'));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

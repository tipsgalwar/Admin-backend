const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || "MY_SECRET_KEY";

// Dummy Predefined User (Optional)
const PREDEFINED_USER = {
    username: "tipsgalwar",
    password: bcrypt.hashSync("abhishek009", 10)
};

// **Login Controller**
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (username === PREDEFINED_USER.username) {
        const isMatch = await bcrypt.compare(password, PREDEFINED_USER.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid Password" });

        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
        return res.json({ message: "Login Successful", token });
    }

    try {
        // **Check User in Database**
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: "Invalid Username" });

        // **Password Check**
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid Password" });

        // **Generate JWT Token**
        const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ message: "Login Successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// **Protected Route**
const protectedRoute = (req, res) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied. No Token Provided." });

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        res.json({ message: `Welcome ${verified.username}, You have accessed a protected route!` });
    } catch (err) {
        res.status(403).json({ message: "Invalid Token" });
    }
};

module.exports = { loginUser, protectedRoute };

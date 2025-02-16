const Registration = require('../models/Registration');

// Get all registrations
exports.getRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find();
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a new registration
exports.addRegistration = async (req, res) => {
    const registration = new Registration(req.body);
    try {
        const newRegistration = await registration.save();
        res.status(201).json(newRegistration);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
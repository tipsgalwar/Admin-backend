const ContactForm = require('../models/ContactForm');

// Get all inquiries
exports.getInquiries = async (req, res) => {
    try {
        const inquiries = await ContactForm.find();
        res.json(inquiries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a new inquiry
exports.addInquiry = async (req, res) => {
    const inquiry = new ContactForm(req.body);
    try {
        const newInquiry = await inquiry.save();
        res.status(201).json(newInquiry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
const Result = require('../models/Result');

// Get all results
exports.getResults = async (req, res) => {
    try {
        const results = await Result.find();
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a new result
exports.addResult = async (req, res) => {
    const result = new Result(req.body);
    try {
        const newResult = await result.save();
        res.status(201).json(newResult);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
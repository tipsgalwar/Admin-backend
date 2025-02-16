const mongoose = require('mongoose');

const contactFormSchema = new mongoose.Schema({
    name: String,
    email: String,
    number: String,
    qualification: String,
    subject: String,
    message: String
}, { timestamps: true });

module.exports = mongoose.model('ContactForm', contactFormSchema, 'contactForm'); 

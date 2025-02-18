// const mongoose = require('mongoose');

// const contactFormSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     number: String,
//     qualification: String,
//     subject: String,
//     message: String
// }, { timestamps: true });

// module.exports = mongoose.model('ContactForm', contactFormSchema, 'contactForm'); 

const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    number: { type: String, required: true },
    qualification: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

// Convert timestamps to local date-time format
formDataSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.createdAt = new Date(ret.createdAt).toLocaleString();
    ret.updatedAt = new Date(ret.updatedAt).toLocaleString();
    return ret;
  },
});

// Explicitly specifying the collection name 'contactForm'
module.exports = mongoose.model('FormData', formDataSchema, 'contactForm');

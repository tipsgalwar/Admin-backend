// const mongoose = require('mongoose');

// // Define the base URL (use environment variable)
// const BASE_URL = process.env.BASE_URL || 'https://admin-backend-wbbc.onrender.com';

// const blogSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     metaDescription: { type: String },
//     image1: { type: String },
//     image2: { type: String },
//     content1: { type: String, required: true },
//     content2: { type: String, required: true },
//     author: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// // Convert timestamps and image paths to full URLs
// blogSchema.set('toJSON', {
//   transform: function (doc, ret) {
//     ret.createdAt = new Date(ret.createdAt).toLocaleString();
//     ret.updatedAt = new Date(ret.updatedAt).toLocaleString();
//     if (ret.image1) ret.image1 = `${BASE_URL}/${ret.image1}`;
//     if (ret.image2) ret.image2 = `${BASE_URL}/${ret.image2}`;
//     return ret;
//   },
// });

// module.exports = mongoose.model('Blog', blogSchema);




const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    metaDescription: { type: String },
    image1: { type: String },
    image2: { type: String },
    content1: { type: String, required: true },
    content2: { type: String, required: true },
    author: { type: String, required: true },
  },
  { timestamps: true }
);

// JSON ट्रांसफॉर्मेशन
blogSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.createdAt = new Date(ret.createdAt).toLocaleString();
    ret.updatedAt = new Date(ret.updatedAt).toLocaleString();
    
    // रिलेटिव URL का उपयोग करें
    if (ret.image1 && !ret.image1.startsWith('http')) {
      ret.image1 = `/uploads/${ret.image1}`;
    }
    if (ret.image2 && !ret.image2.startsWith('http')) {
      ret.image2 = `/uploads/${ret.image2}`;
    }
    
    return ret;
  },
});

module.exports = mongoose.model('Blog', blogSchema);
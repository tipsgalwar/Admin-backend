// const mongoose = require("mongoose");

// const blogSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     metaDescription: { type: String },
//     image1: { type: String },
//     image2: { type: String },
//     content1: { type: String, required: true },
//     content2: { type: String, required: true },
//     author: { type: String, required: true }, // ✅ Name as string
//   },
//   { timestamps: true }
// );

// // Convert timestamps to local date-time format
// blogSchema.set("toJSON", {
//   transform: function (doc, ret) {
//     ret.createdAt = new Date(ret.createdAt).toLocaleString();
//     ret.updatedAt = new Date(ret.updatedAt).toLocaleString();
//     return ret;
//   },
// });

// module.exports = mongoose.model("Blog", blogSchema);




const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    metaDescription: { type: String },
    image1: { type: String },
    image1PublicId: { type: String }, // Added for Cloudinary
    image2: { type: String },
    image2PublicId: { type: String }, // Added for Cloudinary
    content1: { type: String, required: true },
    content2: { type: String, required: true },
    author: { type: String, required: true },
  },
  { timestamps: true }
);

// Convert timestamps to local date-time format
blogSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.createdAt = new Date(ret.createdAt).toLocaleString();
    ret.updatedAt = new Date(ret.updatedAt).toLocaleString();
    return ret;
  },
});

module.exports = mongoose.model('Blog', blogSchema);
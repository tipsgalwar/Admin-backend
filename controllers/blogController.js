// const Blog = require("../models/blogModel");

// const cloudinary = require('cloudinary').v2;

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Create a Blog
// exports.createBlog = async (req, res) => {
//   try {
//     const { title, metaDescription, content1, content2, author } = req.body;

//     if (!author) {
//       return res.status(400).json({ message: 'Author is required' });
//     }

//     // Upload images to Cloudinary
//     let image1 = null;
//     let image2 = null;

//     if (req.files?.image1?.[0]) {
//       const result = await cloudinary.uploader.upload(req.files.image1[0].path, {
//         folder: 'blogs',
//       });
//       image1 = result.secure_url;
//     }

//     if (req.files?.image2?.[0]) {
//       const result = await cloudinary.uploader.upload(req.files.image2[0].path, {
//         folder: 'blogs',
//       });
//       image2 = result.secure_url;
//     }

//     const blog = new Blog({
//       title,
//       metaDescription,
//       image1,
//       image2,
//       content1,
//       content2,
//       author,
//     });

//     await blog.save();

//     res.status(201).json({ message: 'Blog created successfully!', blog });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating blog', error });
//   }
// };

// // Update Blog
// exports.updateBlog = async (req, res) => {
//   try {
//     const { title, metaDescription, content1, content2, author } = req.body;
//     const existingBlog = await Blog.findById(req.params.id);
//     if (!existingBlog) return res.status(404).json({ message: 'Blog not found' });

//     let image1 = existingBlog.image1;
//     let image2 = existingBlog.image2;

//     if (req.files?.image1?.[0]) {
//       const result = await cloudinary.uploader.upload(req.files.image1[0].path, {
//         folder: 'blogs',
//       });
//       image1 = result.secure_url;
//     }

//     if (req.files?.image2?.[0]) {
//       const result = await cloudinary.uploader.upload(req.files.image2[0].path, {
//         folder: 'blogs',
//       });
//       image2 = result.secure_url;
//     }

//     const updateData = {
//       title,
//       metaDescription,
//       image1,
//       content1,
//       image2,
//       content2,
//       author,
//     };

//     const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
//       new: true,
//     });

//     res.status(200).json({ message: 'Blog updated successfully', blog });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating blog', error });
//   }
// };

// // Delete Blog
// exports.deleteBlog = async (req, res) => {
//   try {
//     const blog = await Blog.findByIdAndDelete(req.params.id);
//     if (!blog) return res.status(404).json({ message: "Blog not found" });
//     res.status(200).json({ message: "Blog deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting blog", error });
//   }
// };

// // Get Single Blog by ID
// exports.getBlogById = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) return res.status(404).json({ message: "Blog not found" });
//     res.status(200).json(blog);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching blog", error });
//   }
// };
//     // Get All Blogs
//     exports.getAllBlogs = async (req, res) => {
//       try {
//         const blogs = await Blog.find()
//           .sort({ createdAt: -1 });
    
//         res.status(200).json(blogs);
//       } catch (error) {
//         res.status(500).json({ message: "Error fetching blogs", error });
//       }
//     };



const Blog = require("../models/blogModel");
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Cloudinary कॉन्फिगरेशन
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// सहायक फंक्शन: इमेज अपलोड
const uploadImage = async (file) => {
  if (!file) return null;
  
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'blogs',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};

// ब्लॉग बनाएं
exports.createBlog = async (req, res) => {
  try {
    const { title, metaDescription, content1, content2, author } = req.body;

    // वैलिडेशन
    if (!title || !content1 || !content2 || !author) {
      return res.status(400).json({ 
        success: false,
        message: 'Required fields are missing' 
      });
    }

    // इमेज अपलोड
    const [image1, image2] = await Promise.all([
      uploadImage(req.files?.image1?.[0]),
      uploadImage(req.files?.image2?.[0])
    ]);

    // नया ब्लॉग बनाएं
    const blog = new Blog({
      title,
      metaDescription,
      image1,
      image2,
      content1,
      content2,
      author,
    });

    await blog.save();

    res.status(201).json({ 
      success: true,
      message: 'Blog created successfully!', 
      data: blog 
    });
  } catch (error) {
    console.error('Error in createBlog:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error creating blog' 
    });
  }
};

// सभी ब्लॉग्स प्राप्त करें
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true,
      data: blogs 
    });
  } catch (error) {
    console.error('Error in getAllBlogs:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching blogs' 
    });
  }
};

// एकल ब्लॉग प्राप्त करें
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: "Blog not found" 
      });
    }
    res.status(200).json({ 
      success: true,
      data: blog 
    });
  } catch (error) {
    console.error('Error in getBlogById:', error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching blog" 
    });
  }
};

// ब्लॉग अपडेट करें
exports.updateBlog = async (req, res) => {
  try {
    const { title, metaDescription, content1, content2, author } = req.body;
    const existingBlog = await Blog.findById(req.params.id);
    
    if (!existingBlog) {
      return res.status(404).json({ 
        success: false,
        message: 'Blog not found' 
      });
    }

    // इमेज अपलोड (यदि प्रदान की गई हैं)
    const [image1, image2] = await Promise.all([
      req.files?.image1?.[0] ? uploadImage(req.files.image1[0]) : Promise.resolve(existingBlog.image1),
      req.files?.image2?.[0] ? uploadImage(req.files.image2[0]) : Promise.resolve(existingBlog.image2)
    ]);

    // अपडेट डेटा
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        metaDescription,
        image1,
        image2,
        content1,
        content2,
        author,
      },
      { new: true }
    );

    res.status(200).json({ 
      success: true,
      message: 'Blog updated successfully', 
      data: updatedBlog 
    });
  } catch (error) {
    console.error('Error in updateBlog:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating blog' 
    });
  }
};

// ब्लॉग डिलीट करें
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: "Blog not found" 
      });
    }
    res.status(200).json({ 
      success: true,
      message: "Blog deleted successfully" 
    });
  } catch (error) {
    console.error('Error in deleteBlog:', error);
    res.status(500).json({ 
      success: false,
      message: "Error deleting blog" 
    });
  }
};
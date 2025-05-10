// const Blog = require("../models/blogModel");

// // Create a Blog
// exports.createBlog = async (req, res) => {
//   try {
//     const {
//       title,
//       metaDescription,
//       content1,
//       content2,
//       author,
//     } = req.body;

//     // Handling multiple images using multer.fields
//     const image1 = req.files?.image1?.[0]?.path || null;
//     const image2 = req.files?.image2?.[0]?.path || null;

//     if (!author) {
//       return res.status(400).json({ message: "Author is required" });
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

//     res.status(201).json({ message: "Blog created successfully!", blog });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating blog", error });
//   }
// };

// // Get All Blogs
// exports.getAllBlogs = async (req, res) => {
//   try {
//     const blogs = await Blog.find()
//       .sort({ createdAt: -1 });

//     res.status(200).json(blogs);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching blogs", error });
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

// // Update Blog
// exports.updateBlog = async (req, res) => {
//   try {
//     const {
//       title,
//       metaDescription,
//       content1,
//       content2,
//       author,
//     } = req.body;

//     const image1 = req.files?.image1?.[0]?.path || req.body.image1;
//     const image2 = req.files?.image2?.[0]?.path || req.body.image2;

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

//     if (!blog) return res.status(404).json({ message: "Blog not found" });

//     res.status(200).json({ message: "Blog updated successfully", blog });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating blog", error });
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




const Blog = require('../models/blogModel');
const cloudinary = require('../config/cloudinary');

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = 'blogs') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
    }
  }
};

// Create a Blog
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      metaDescription,
      content1,
      content2,
      author,
    } = req.body;

    if (!author) {
      return res.status(400).json({ message: 'Author is required' });
    }

    // Upload images to Cloudinary
    let image1 = null;
    let image2 = null;

    if (req.files?.image1?.[0]?.buffer) {
      const result = await uploadToCloudinary(req.files.image1[0].buffer);
      image1 = { url: result.url, public_id: result.public_id };
    }

    if (req.files?.image2?.[0]?.buffer) {
      const result = await uploadToCloudinary(req.files.image2[0].buffer);
      image2 = { url: result.url, public_id: result.public_id };
    }

    const blog = new Blog({
      title,
      metaDescription,
      image1: image1 ? image1.url : null,
      image1PublicId: image1 ? image1.public_id : null,
      image2: image2 ? image2.url : null,
      image2PublicId: image2 ? image2.public_id : null,
      content1,
      content2,
      author,
    });

    await blog.save();

    res.status(201).json({ message: 'Blog created successfully!', blog });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Error creating blog', error: error.message });
  }
};

// Get All Blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error });
  }
};

// Get Single Blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog', error });
  }
};

// Update Blog
exports.updateBlog = async (req, res) => {
  try {
    const {
      title,
      metaDescription,
      content1,
      content2,
      author,
    } = req.body;

    // Fetch existing blog to get old image public IDs
    const existingBlog = await Blog.findById(req.params.id);
    if (!existingBlog) return res.status(404).json({ message: 'Blog not found' });

    let image1 = { url: existingBlog.image1, public_id: existingBlog.image1PublicId };
    let image2 = { url: existingBlog.image2, public_id: existingBlog.image2PublicId };

    // Upload new images to Cloudinary and delete old ones
    if (req.files?.image1?.[0]?.buffer) {
      // Delete old image1 from Cloudinary
      await deleteFromCloudinary(existingBlog.image1PublicId);
      // Upload new image1
      const result = await uploadToCloudinary(req.files.image1[0].buffer);
      image1 = { url: result.url, public_id: result.public_id };
    }

    if (req.files?.image2?.[0]?.buffer) {
      // Delete old image2 from Cloudinary
      await deleteFromCloudinary(existingBlog.image2PublicId);
      // Upload new image2
      const result = await uploadToCloudinary(req.files.image2[0].buffer);
      image2 = { url: result.url, public_id: result.public_id };
    }

    const updateData = {
      title,
      metaDescription,
      image1: image1.url,
      image1PublicId: image1.public_id,
      image2: image2.url,
      image2PublicId: image2.public_id,
      content1,
      content2,
      author,
    };

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    console| console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Error updating blog', error: error.message });
  }
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Delete images from Cloudinary
    await deleteFromCloudinary(blog.image1PublicId);
    await deleteFromCloudinary(blog.image2PublicId);

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error });
  }
};
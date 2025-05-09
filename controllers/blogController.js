const Blog = require("../models/blogModel");

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, metaDescription, content1, content2, author } = req.body;

    if (!author) {
      return res.status(400).json({ message: 'Author is required' });
    }

    // Upload images to Cloudinary
    let image1 = null;
    let image2 = null;

    if (req.files?.image1?.[0]) {
      const result = await cloudinary.uploader.upload(req.files.image1[0].path, {
        folder: 'blogs',
      });
      image1 = result.secure_url;
    }

    if (req.files?.image2?.[0]) {
      const result = await cloudinary.uploader.upload(req.files.image2[0].path, {
        folder: 'blogs',
      });
      image2 = result.secure_url;
    }

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

    res.status(201).json({ message: 'Blog created successfully!', blog });
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error });
  }
};

// Update Blog
exports.updateBlog = async (req, res) => {
  try {
    const { title, metaDescription, content1, content2, author } = req.body;
    const existingBlog = await Blog.findById(req.params.id);
    if (!existingBlog) return res.status(404).json({ message: 'Blog not found' });

    let image1 = existingBlog.image1;
    let image2 = existingBlog.image2;

    if (req.files?.image1?.[0]) {
      const result = await cloudinary.uploader.upload(req.files.image1[0].path, {
        folder: 'blogs',
      });
      image1 = result.secure_url;
    }

    if (req.files?.image2?.[0]) {
      const result = await cloudinary.uploader.upload(req.files.image2[0].path, {
        folder: 'blogs',
      });
      image2 = result.secure_url;
    }

    const updateData = {
      title,
      metaDescription,
      image1,
      content1,
      image2,
      content2,
      author,
    };

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog', error });
  }
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error });
  }
};

// Get Single Blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error });
  }
};
    // Get All Blogs
    exports.getAllBlogs = async (req, res) => {
      try {
        const blogs = await Blog.find()
          .sort({ createdAt: -1 });
    
        res.status(200).json(blogs);
      } catch (error) {
        res.status(500).json({ message: "Error fetching blogs", error });
      }
    };
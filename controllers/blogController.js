const Blog = require("../models/blogModel");

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

    // Handling multiple images using multer.fields
    const image1 = req.files?.image1?.[0]?.path || null;
    const image2 = req.files?.image2?.[0]?.path || null;

    if (!author) {
      return res.status(400).json({ message: "Author is required" });
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

    res.status(201).json({ message: "Blog created successfully!", blog });
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error });
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

    const image1 = req.files?.image1?.[0]?.path || req.body.image1;
    const image2 = req.files?.image2?.[0]?.path || req.body.image2;

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

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    res.status(500).json({ message: "Error updating blog", error });
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

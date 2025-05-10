// const express = require('express');
// const multer = require('multer');
// const router = express.Router();
// const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } = require('../controllers/blogController');

// // Setup Multer for image uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, 'uploads/'),
//     filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
// });

// const upload = multer({ storage });

// // Routes
// router.post('/',
//     upload.fields([
//         { name: 'image1', maxCount: 1 },
//         { name: 'image2', maxCount: 1 }
//     ]),
//     createBlog
// );

// router.get('/', getAllBlogs);
// router.get('/:id', getBlogById);

// router.put('/:id',
//     upload.fields([
//         { name: 'image1', maxCount: 1 },
//         { name: 'image2', maxCount: 1 }
//     ]),
//     updateBlog
// );

// router.delete('/:id', deleteBlog);

// module.exports = router;




const express = require('express');
const multer = require('multer');
const router = express.Router();
const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } = require('../controllers/blogController');

// Setup Multer for image uploads (use memory storage)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // Limit to 5MB
});

// Routes
router.post(
  '/',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 }
  ]),
  createBlog
);

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

router.put(
  '/:id',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 }
  ]),
  updateBlog
);

router.delete('/:id', deleteBlog);

module.exports = router;
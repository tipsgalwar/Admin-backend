const express = require('express');
const multer = require('multer');
const router = express.Router();
const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } = require('../controllers/blogController');

// Setup Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Routes
router.post('/',
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 }
    ]),
    createBlog
);

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

router.put('/:id',
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 }
    ]),
    updateBlog
);

router.delete('/:id', deleteBlog);

module.exports = router;




// const express = require('express');
// const multer = require('multer');
// const router = express.Router();
// const fs = require('fs');
// const path = require('path');
// const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } = require('../controllers/blogController');

// // अस्थायी डायरेक्टरी सुनिश्चित करें
// const tmpDir = path.join(__dirname, '../tmp');
// if (!fs.existsSync(tmpDir)) {
//   fs.mkdirSync(tmpDir, { recursive: true });
// }

// // Multer कॉन्फिगरेशन
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, tmpDir),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed!'), false);
//   }
// };

// const upload = multer({ 
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   fileFilter
// });

// // फाइल सफाई मिडलवेयर
// const cleanupFiles = (req, res, next) => {
//   if (req.files) {
//     const files = Object.values(req.files).flat();
//     files.forEach(file => {
//       fs.unlink(file.path, err => {
//         if (err) console.error('Error deleting temp file:', err);
//       });
//     });
//   }
//   next();
// };

// // रूट्स
// router.post('/',
//   upload.fields([
//     { name: 'image1', maxCount: 1 },
//     { name: 'image2', maxCount: 1 }
//   ]),
//   cleanupFiles,
//   createBlog
// );

// router.get('/', getAllBlogs);
// router.get('/:id', getBlogById);

// router.put('/:id',
//   upload.fields([
//     { name: 'image1', maxCount: 1 },
//     { name: 'image2', maxCount: 1 }
//   ]),
//   cleanupFiles,
//   updateBlog
// );

// router.delete('/:id', deleteBlog);

// module.exports = router;
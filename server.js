// const express = require("express");
// const mongoose = require("mongoose");
// const connectDB = require("./config/db");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const path = require("path");

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());
// const fs = require("fs");
// const uploadDir = path.join(__dirname, "Uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }
// // **Static File Serving (Uploads Folder)**
// app.use("/uploads", express.static(path.join(__dirname, "Uploads"))); // Use 'Uploads' with capital 'U'

// // **Routes**
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/blogs", require("./routes/blogRoutes"));
// app.use("/api/result", require("./routes/resultRoutes"));
// app.use("/api/registration", require("./routes/registrationRoutes"));
// app.use("/api/contact", require("./routes/contactFormRoutes"));

// // Start Server
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB कनेक्शन
connectDB();

// मिडलवेयर
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// टेम्पोररी और अपलोड डायरेक्टरी बनाएं
const tmpDir = path.join(__dirname, "tmp");
const uploadDir = path.join(__dirname, "Uploads");

[tmpDir, uploadDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// स्टेटिक फाइल सर्विंग
app.use("/uploads", express.static(uploadDir));

// रूट्स
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/result", require("./routes/resultRoutes"));
app.use("/api/registration", require("./routes/registrationRoutes"));
app.use("/api/contact", require("./routes/contactFormRoutes"));

// एरर हैंडलिंग मिडलवेयर
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// सर्वर स्टार्ट
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
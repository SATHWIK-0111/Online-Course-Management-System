require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const adminRouter = require("./routes/admin");//require is used for loading external files
const userRouter = require("./routes/user");

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(compression());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Routes
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.get("/", (req, res) => res.json({msg: "Welcome to Course Management API!"}));

// MongoDB Connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/courses', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "Courses"
    });
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

connectDB();

// Handle MongoDB connection errors
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

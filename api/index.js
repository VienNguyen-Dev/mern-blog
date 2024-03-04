import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from '../api/routes/user.route.js';
import authRoutes from '../api/routes/auth.route.js';
import postRoutes from '../api/routes/post.route.js'
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to mongoDB successfuly!")
  }).catch((err) => {
    console.log(err)
  })

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error"
  res.status(statusCode).json({
    success: false,
    statusCode,
    message

  });
})


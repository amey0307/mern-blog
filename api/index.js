import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser';
import postRoutes from './routes/post.route.js'

dotenv.config();

mongoose.connect(
    "mongodb+srv://ameytr07:ameytr07@mern-blog.1z6qnxd.mongodb.net/mern-blog?retryWrites=true&w=majority&appName=Mern-blog"
)
    .then(() => {
        console.log("Mongoose is connected");
    })
    .catch((e) => {
        console.log("Lund ni connect hua bc mongoose se");
        console.log(e);
    })

const app = express();
app.use(express.json()) //This line is to show json object in terminal during post req (console log)
app.use(cookieParser());

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//testing api
app.use('/api/user', userRoutes);

//authentication api
app.use('/api/auth', authRoutes);

//posts
app.use('/api/post', postRoutes)

//middleware for error
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error"

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})
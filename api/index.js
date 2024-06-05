import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser';

dotenv.config();

mongoose.connect(
    process.env.MONGO
)
.then(()=>{
    console.log("Mongoose is connected");
})
.catch((e)=>{
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

//middleware for error
app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error"

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})
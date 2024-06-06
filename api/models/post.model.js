import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
    },
    created: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
}, {timestamps: true})

export default mongoose.model("Post", postSchema);
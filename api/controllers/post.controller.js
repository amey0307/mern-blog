import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";

export const createPost = async (req, res, next) => {
    //req.body -> is the data that is sent from the client
    //req.user -> is the user that is logged in
    if (!req.user.isAdmin) {
        return next(errorHandler(401, "Unauthorized"))
    }

    if (!req.body.title || !req.body.content || !req.body.category) {
        return next(errorHandler(400, "Please fill in all fields"))
    }

    const slug = req.body.title.toLowerCase().split(' ').join('-').replace(/[^a-zA-Z0-9 -]/g, "");

    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id,
        photo: req.body.profilePicture
    })

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost)
    } catch (e) {
        return next(errorHandler(500, e.message))
    }
}

//API for sending postes as requested
export const getPosts = async (req, res, next) => {
    // return next(errorHandler(401, "Unauthorized"))
    try {
        //from where we going to send post othws from first
        const startIndex = parseInt(req.query.startIndex) || 0;
        //how many are requested to send to client (default=9)
        const limit = parseInt(req.query.limit) || 9;
        //In accessnding order or decending order
        const sortBy = req.query.order === 'asc' ? 1 : -1;
        //find post (if parametres requested by client then send accordingly)
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $option: 'i' } },
                    { content: { $regex: req.query.searchTerm, $option: 'i' } }
                ],
            })
        }).sort({ updatedAt: sortBy }).skip(startIndex).limit(limit)

        // Total Posts
        const totalPosts = await Post.countDocuments({
            userId: req.query.userId,
        });

        //no of posts from in last month
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )
        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
            userId: req.query.userId
        })

        //send the response to the client
        res
            .status(200)
            .json({
                success: true,
                posts,
                totalPosts,
                lastMonthPosts
            })
    } catch (e) {
        next(errorHandler(401, `Error Fetching Posts: ${e}`));
    }
}
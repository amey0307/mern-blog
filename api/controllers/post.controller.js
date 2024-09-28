import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

//API for creating post
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

//Api for deleting post
export const deletePost = async (req, res, next) => {
    console.log(req.query)
    if (!req.user.isAdmin) {
        return next(errorHandler(401, "Unauthorized"))
    }

    try {
        const deletedPost = await Post.findByIdAndDelete(req.query.id);
        if (!deletedPost) {
            return next(errorHandler(404, "Post not found"))
        }
        res.status(200).json({ success: true, deletedPost })
    } catch (e) {
        return next(errorHandler(500, e.message))
    }
}

//API for updating post
export const updatePost = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(401, "Unauthorized"))
    }

    if (!req.body.title || !req.body.content || !req.body.category) {
        return next(errorHandler(400, "Please fill in all fields"))
    }

    const slug = req.body.title.toLowerCase().split(' ').join('-').replace(/[^a-zA-Z0-9 -]/g, "");

    try {
        const updatedPost = await Post.findByIdAndUpdate(req.query.id, {
            ...req.body,
            slug,
            userId: req.user.id,
            photo: req.body.profilePicture
        }, { new: true });

        if (!updatedPost) {
            return next(errorHandler(404, "Post not found"))
        }

        res.status(200).json(updatedPost)
    } catch (e) {
        return next(errorHandler(500, e.message))
    }
}

export const likePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.query.postId);

        if (post.likedByUsers.includes(req.user.id)) {
            post.likedByUsers.pull(req.user.id);
            post.likes -= 1;
            post.isLikedByUser = false;
        }
        post.likedByUsers.push(req.user.id);
        post.likes += 1;
        post.isLikedByUser = true;


        await post.save();
        res.status(200).json(post.likedByUsers)

    } catch (e) {
        return next(errorHandler(500, e.message))
    }
}

export const unlikePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.query.postId);

        if (post.likedByUsers.includes(req.user.id)) {
            post.likedByUsers.pull(req.user.id);
            post.likes -= 1;
            post.isLikedByUser = false;
        }


        await post.save();
        res.status(200).json(post.likedByUsers)
    }
    catch (e) {
        return next(errorHandler(500, e.message))
    }
}

export const getLikedPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({ likedByUsers: req.user.id });
        res.status(200).json(posts)
    } catch (e) {
        return next(errorHandler(500, e.message))
    }
}

export const commentOnPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.body.postId);
        post.comment.push({
            userId: req.user.id,
            comment: req.body.comment,
            commentId: req.body.commentId,
            userName: req.body.userName,
        })
        await post.save();
        res.status(200).json(post.comment)
    } catch (e) {
        return next(errorHandler(500, e.message))
    }
}

export const replyOnPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.body.postId);
        const reply = {
            $push: {
                reply: {
                    userId: req.body.userId,
                    reply: req.body.reply,
                    replyId: req.body.replyId,
                    userName: req.body.userName,
                    commentId: req.body.commentId
                }
            }
        }
        await post.updateOne(reply);
        res.status(200).json(post.reply)
    } catch (e) {
        return next(errorHandler(500, e.message))
    }
}

export const getComments = async (req, res, next) => {
    try {
        const post = await Post.findById(req.query.postId);
        res.status(200).json(post.comment)
    }
    catch (e) {
        return next(errorHandler(500, e.message))
    }
}

export const getReplies = async (req, res, next) => {
    try {
        const post = await Post.findById(req.query.postId);
        res.status(200).json(post.reply)
    }
    catch (e) {
        return next(errorHandler(500, e.message))
    }
}

export const searchPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({
            $or: [
                { title: { $regex: req.query.search, $options: 'i' } },
                { content: { $regex: req.query.search, $options: 'i' } }
            ]
        })
        res.status(200).json(posts)
    } catch (e) {
        return next(errorHandler(500, e.message))
    }
}


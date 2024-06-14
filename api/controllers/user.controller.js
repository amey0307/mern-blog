import User from "../models/user.model.js";
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs'
import Post from "../models/post.model.js";

export const test = (req, res) => {
    res.json({ name: "Api is working" });
}

export const updateUser = async (req, res, next) => {


    if (req.user.id !== req.params.userId) {
        return next(errorHandler(401, "Unauthorized"))
    }

    if (!req.body.password && (req.body.newPassword || req.body.rePassword)) {
        return next(errorHandler(400, "Password is required"))
    }

    if ((req.body.newPassword || req.body.rePassword) && (req.body.newPassword != req.body.rePassword)) {
        return next(errorHandler(400, "Passwords do not match"))
    }

    if (req.body.newPassword) {
        const hashedPassword = bcryptjs.hashSync(req.body.newPassword, 10)
        req.body.newPassword = hashedPassword;
    }
    try {

        const updateUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.newPassword,
            },
        },
            { new: true }
        )

        const { password, ...rest } = updateUser._doc;
        res.json(rest);
    } catch (e) {
        return next(errorHandler(500, e.message))
    }
}

export const deleteUser = async (req, res, next) => {

    if (req.user.id !== req.params.userId && !req.user.isAdmin) {
        return next(errorHandler(401, "Unauthorized"))
    }
    try {
        await User.findByIdAndDelete(req.params.userId)
        res.json("User deleted successfully");
    }
    catch (e) {
        return next(errorHandler(500, e.message))
    }
}

export const signout = (req, res) => {
    res
        .clearCookie('access_token')
        .json("Signout success");
}

// export const likedPost = async (req, res, next) => {
//     try {
//         const user = await User.findById(req.user.id);
//         const post = await Post.findById(req.query.postId);
//         if (user.LikedPostId.includes(req.query.postId)) {
//             user.LikedPostId.pull(post._id);
//             post.likedByUsers.pull(user._id)
//             post.likes -= 1;
//         }
//         else {
//             user.LikedPostId.push(post._id);
//             post.likedByUsers.push(user._id)
//             post.likes += 1;
//         }

//         await user.save();
//         await post.save();

//         res.status(200).json({ message: 'Success', likedPosts: user.LikedPostId });
//     } catch (e) {
//         return next(errorHandler(500, e.message))
//     }
// }

export const getLikePost = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, posts: user.LikedPostId });
    } catch (e) {
        return next(errorHandler(500, e.message))
    }
}

export const getUsers = async (req, res, next) => {
    const users = await User.find({ isAdmin: false })
    res.status(200).json(users)

}
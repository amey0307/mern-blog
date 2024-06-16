import express from 'express';
import { verifyToken } from '../utils/verify.utils.js';
import { createPost, deletePost, getPosts, likePost, unlikePost, updatePost, getLikedPosts, commentOnPost, getComments, replyOnPost, getReplies, searchPosts } from '../controllers/post.controller.js';

const router = express.Router();

router.use('/create', verifyToken, createPost)
router.get('/getPosts', getPosts)
router.delete('/delete', verifyToken, deletePost)
router.put('/update', verifyToken, updatePost)
router.put('/likepost', verifyToken, likePost)
router.put('/unlikepost', verifyToken, unlikePost)
router.get('/getlikedposts', verifyToken, getLikedPosts)
router.post('/comment', verifyToken, commentOnPost)
router.post('/reply', verifyToken, replyOnPost)
router.get('/getComments', verifyToken, getComments)
router.get('/getReplies', verifyToken, getReplies)
router.get('/search', searchPosts)

export default router;
import express from 'express';
import { verifyToken } from '../utils/verify.utils.js';
import { createPost, deletePost, getPosts } from '../controllers/post.controller.js';

const router = express.Router();

router.use('/create', verifyToken, createPost)
router.get('/getPosts', getPosts)
router.delete('/delete', verifyToken, deletePost)

export default router;
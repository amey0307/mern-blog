import express from 'express';
import { verifyToken } from '../utils/verify.utils.js';
import { createPost } from '../controllers/post.controller.js';

const router = express.Router();

router.use('/create',verifyToken, createPost)

export default router;
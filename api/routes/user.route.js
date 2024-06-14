import express from 'express'
import { deleteUser, signout, test, updateUser, getLikePost, getUsers } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verify.utils.js';

const router = express.Router();

router.get('/test', test)
router.put('/update/:userId', verifyToken, updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser)
router.post('/signout', signout)
// router.put('/likedpost', verifyToken, likedPost)
router.get('/getlikedposts', verifyToken, getLikePost)
router.get('/getusers', getUsers)

export default router;
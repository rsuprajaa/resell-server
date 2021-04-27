import express from 'express'
import { updateProduct } from '../controllers/productController.js'
const router = express.Router()
import {authUser, deleteUser, getToken, getUserProfile, registerUser, updateUserProfile, verify} from '../controllers/userController.js'
import { auth } from '../middleware/authMiddleware.js'

router.route('/').post(registerUser).delete(auth, deleteUser)
router.route('/token').get(auth, getToken)
router.route('/verify').post(auth, verify)
router.route('/login').post(authUser)
router.route('/profile').get(auth, getUserProfile).put(auth, updateUserProfile)

export default router
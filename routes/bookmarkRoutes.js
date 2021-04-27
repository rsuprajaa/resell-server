import express from 'express'
import { addToBookmarks, deleteBookmark, getBookmarks } from '../controllers/bookmarkController.js'
import { auth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(auth, getBookmarks).post(auth, addToBookmarks)
router.route('/:id').delete(auth, deleteBookmark)

export default router
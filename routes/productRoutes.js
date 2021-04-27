import express from 'express'
import { createProduct, deleteProduct, getAllProducts, getProductByID, updateProduct, getProductsByUserID, getProductByCategory } from '../controllers/productController.js'
import { auth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(getAllProducts).post(auth, createProduct)
router.route('/:id').get(getProductByID).put(auth, updateProduct).delete(auth, deleteProduct)
router.route('/user/:id').get(getProductsByUserID)
router.route('/tags/:category').get(getProductByCategory)

export default router
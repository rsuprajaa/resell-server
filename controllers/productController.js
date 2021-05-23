import asyncHandler from 'express-async-handler'
import { cloudinary } from '../cloudinary/index.js'
import Bookmark from '../models/bookmarkModel.js'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const getAllProducts = asyncHandler(async (req, res) => {
	if (req.query.sortBy === 'lowToHigh') {
		if (req.query.search) {
			const regex = new RegExp(escapeRegex(req.query.search), 'gi')
			const products = await Product.find({ title: regex }).sort({ price: 1 })
			res.json(products)
		} else {
			const products = await Product.find().sort({ price: 1 })
			res.json({
				products,
			})
		}
	} else {
		if (req.query.search) {
			const regex = new RegExp(escapeRegex(req.query.search), 'gi')
			const products = await Product.find({ title: regex }).sort({ date: -1 })
			res.json(products)
		} else {
			const products = await Product.find().sort({ date: -1 })
			res.json({
				products,
			})
		}
	}
})

const createProduct = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id)
	if (!user.verified) {
		//redirect to verify page
		res.send('User not verified')
	}
	const { title, description, price, image, category } = req.body
	const uploadedImage = await cloudinary.uploader.upload(image)
	const newProduct = new Product({
		title,
		description,
		price,
		image: uploadedImage.url,
		category,
		user: req.user._id,
		name: user.name,
		contact: user.contact,
	})
	const product = await newProduct.save()
	res.json(product)
})

const getProductByID = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id)
	console.log(product)
	if (!product) {
		res.status(400)
		throw new Error('Product not found')
	} else {
		res.json(product)
	}
})

const updateProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id)
	if (!product) {
		res.status(400)
		throw new Error('Product not found')
	}
	if (product.user.toString() != req.user._id) {
		res.status(401)
		throw new Error('User not authorized')
	} else {
		;(product.title = req.body.title || product.title),
			(product.description = req.body.description || product.description),
			(product.price = req.body.price || product.price),
			(product.category = req.body.category || product.category)
		await product.save()
		res.json(product)
	}
})

const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id)
	if (!product) {
		res.status(401)
		throw new Error('Product not found')
	}
	if (product.user.toString() != req.user._id) {
		res.status(401)
		throw new Error('User not authorized')
	} else {
		await Bookmark.deleteMany({ product })
		await product.remove()
		res.json({ message: 'Product removed' })
	}
})

const getProductsByUserID = asyncHandler(async (req, res) => {
	const user = req.params.id
	const products = await Product.find({ user })
	res.json(products)
})

const getProductByCategory = asyncHandler(async (req, res) => {
	const category = req.params.category
	const products = await Product.find({ category }).sort({ date: -1 })
	res.json(products)
})

export {
	getAllProducts,
	createProduct,
	getProductByID,
	deleteProduct,
	updateProduct,
	getProductsByUserID,
	getProductByCategory,
}

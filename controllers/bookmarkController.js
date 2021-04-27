import asyncHandler from 'express-async-handler'
import Bookmark from '../models/bookmarkModel.js'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'

export const getBookmarks = asyncHandler(async (req, res) => {
      const user = await User.findById(req.user._id)
      if (!user) {
            res.status(400)
            throw new Error("User not logged in")
      }
      else {
            const products = await Bookmark.find({user}).populate('product')
            res.json(products)
      }
})

export const addToBookmarks = asyncHandler(async (req, res) => {
      const user = await User.findById(req.user._id)
      if (!user) {
            res.status(400)
            throw new Error("User not logged in")
      }
      else {
            const { product_id } = req.body
            const checkIfBookmarked = await Bookmark.find({ product: product_id })
            if (checkIfBookmarked.length !== 0) {
                  res.status(400)
                  throw new Error("Product is already bookmarked")
            }
            const product = await Product.findById(product_id)
            if (!product) {
                  res.status(400)
                  throw new Error("Product not found")
            }
            const newProduct = new Bookmark({
                  user,
                  product: product_id
            })
            await newProduct.save()
            res.json(newProduct)
      }
})

export const deleteBookmark = asyncHandler(async (req, res) => {
      const bookmark = await Bookmark.findById(req.params.id)
      if (!bookmark) {
            res.status(401)
            throw new Error("Bookmark not found")
      }
      await bookmark.remove()
      res.status(200).json({message: "Bookmark deleted"})
})
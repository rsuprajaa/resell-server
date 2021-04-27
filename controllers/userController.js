import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import Bookmark from '../models/bookmarkModel.js'
import Product from '../models/productModel.js'
import User from '../models/userModel.js'
import Twilio from 'twilio';

const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export const authUser = asyncHandler(async (req,res) => {
      const { email, password } = req.body
      const user = await User.findOne( {email} )
      if (user && (await user.matchPassword(password))) {
            res.json({
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  contact: user.contact,
                  token: jwt.sign({id: user._id}, process.env.JWT_SECRETKEY, {expiresIn: '30d'})
            })
      }
      else {
            res.status(401)
            throw new Error("Invalid email or password")
      }
})

export const registerUser = asyncHandler(async (req,res) => {
      const { email, password, name, contact } = req.body
      const userExists = await User.findOne({ email })
      if (userExists) {
            res.status(400)
            throw new Error('User already exists')
      }
      const user = await User.create({
            name,
            email,
            password,
            contact
      })
      if (user) {
            res.json({
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  contact: user.contact,
                  token: jwt.sign({id: user._id}, process.env.JWT_SECRETKEY, {expiresIn: '30d'})
            })
      }
      else {
            res.status(404)
            throw new Error('User not found')
      }
})

export const getToken = asyncHandler(async (req, res) => {
      const user = await User.findById(req.user._id)
      if (!user) {
            res.status(401)
            throw new Error("User not authorized")
      }
      const {contact} = user
      client
            .verify
            .services(process.env.TWILIO_SERVICE_ID)
            .verifications
            .create({
                to: `+${contact}`,
                channel: 'sms'
            })
            .then(data => {
                res.status(200).send({
                    message: "Verification is sent!",
                    contact,
                    data
                })
            })
})

export const verify = asyncHandler(async (req, res) => {
      const user = await User.findById(req.user._id)
      if (!user) {
            res.status(401)
            throw new Error("User not authorized")
      }
      const {contact} = user
      const {code} = req.body
      if (contact && code) {
          const data = await client
              .verify
              .services(process.env.TWILIO_SERVICE_ID)
              .verificationChecks
              .create({
                  to: `+${contact}`,
                  code
              })
            if (data.status === "approved") {
                        user.verified = true
                        await user.save()
                      res.status(200).send({
                          message: "User is Verified!!",
                          data
                      })
                  }
      } else {
          res.status(400).send({
              message: "Wrong phone number or code",
              phonenumber: contact,
          })
      }
})
  
export const getUserProfile = asyncHandler(async (req, res) => {
      const user = await User.findById(req.user._id)
      if (user) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email
        })
      } else {
        res.status(404)
        throw new Error('User not found')
      }
})
    
export const updateUserProfile = asyncHandler(async (req, res) => {
      const user = await User.findById(req.user._id)
      if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
          user.password = req.body.password
        }
        const updatedUser = await user.save()
        res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          token: jwt.sign({id: user._id}, process.env.JWT_SECRETKEY, {expiresIn: '30d'})
        })
      } else {
        res.status(404)
        throw new Error('User not found')
      }
})

export const deleteUser = asyncHandler(async (req, res) => {
      const user = await User.findById(req.user._id)
      if (user) {
        await Product.deleteMany({ user })
        await Bookmark.deleteMany({user})
        await user.remove()
        res.json({ message: 'User deleted' })
      } else {
        res.status(404)
        throw new Error('User not found')
      }
    })
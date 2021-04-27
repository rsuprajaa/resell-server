import mongoose from 'mongoose'

const productSchema = mongoose.Schema({
      user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
      },
      title: {
            type: String,
            required: true,
            maxLength: 60,
            required: true
      },
      description: {
            type: String,
            maxLength: 400,
            required: true
      },
      price: {
            type: Number,
            required: true
      },
      category: {
            type: String,
            default: 'Other'
      },
      image: {
            cloud_name: {
                  type: String,
                  required: true
            },
            imageID: {
                  type: String,
                  required: true
            }
      },
      name: {
            type: String,
            required: true
      },
      contact: {
            type: String,
            required: true
      },
      date: {
            type: Date,
            default: Date.now()
      }
})

const Product = mongoose.model('Product', productSchema)
export default Product
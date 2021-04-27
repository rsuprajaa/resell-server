import mongoose from 'mongoose'

const bookmarkSchema = mongoose.Schema({
      user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
      },
      product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
            unique:true
      }
})

const Bookmark = mongoose.model('Bookmark', bookmarkSchema)
export default Bookmark
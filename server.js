import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import bookmarkRoutes from './routes/bookmarkRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

dotenv.config()
connectDB()

const app = express()

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb', extended:false}))

app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/bookmarks', bookmarkRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`)
})
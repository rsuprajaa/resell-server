import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import connectDB from "./config/db.js"
import { errorHandler, notFound } from "./middleware/errorMiddleware.js"
import bookmarkRoutes from "./routes/bookmarkRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import userRoutes from "./routes/userRoutes.js"

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: false }))

app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/bookmarks", bookmarkRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`)
})

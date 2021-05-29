import express from "express"
import {
	authUser,
	deleteUser,
	getToken,
	getUserProfile,
	registerUser,
	updateUserProfile,
	verify,
} from "../controllers/userController.js"
import { auth } from "../middleware/authMiddleware.js"
const router = express.Router()

router.route("/").post(registerUser).delete(auth, deleteUser)
router.route("/token").get(auth, getToken)
router.route("/verify").post(auth, verify)
router.route("/login").post(authUser)
router.route("/profile").put(auth, updateUserProfile)
router.route("/profile/:id").get(getUserProfile)

export default router

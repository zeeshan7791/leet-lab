import express from "express"
import { check, forgotPassword, login, logout, register, resetPassword, updateProfile } from "../controllers/auth.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const authRoutes=express.Router()
authRoutes.post("/register",register)
authRoutes.post("/login",login)
authRoutes.post("/forgot-password",forgotPassword)
authRoutes.post("/reset-password/:token",resetPassword)
authRoutes.get("/logout",authMiddleware,logout)
authRoutes.get("/check",authMiddleware,check)
authRoutes.put("/update/:id",authMiddleware,updateProfile)
export default authRoutes
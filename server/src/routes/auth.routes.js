import express from "express"
import { check, login, logout, register, updateProfile } from "../controllers/auth.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const authRoutes=express.Router()
authRoutes.post("/register",register)
authRoutes.post("/login",login)
authRoutes.get("/logout",authMiddleware,logout)
authRoutes.get("/check",authMiddleware,check)
authRoutes.put("/update/:id",authMiddleware,updateProfile)
export default authRoutes
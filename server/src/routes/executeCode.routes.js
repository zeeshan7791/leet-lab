 import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { executionCode } from "../controllers/execute.controller.js"

 const executionRoute=express.Router()
executionRoute.post('/',authMiddleware,executionCode)

 export default executionRoute
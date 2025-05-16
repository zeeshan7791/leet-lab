import express from "express"
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js"
import { createProblem,deleteProblem, getAllProblems, getProblemById, getAllProblemsSolvedByUser, updateProblemById } from "../controllers/problem.controller.js"

const problemRoutes=express.Router()



problemRoutes.post("/create-problem",authMiddleware,checkAdmin,createProblem)
problemRoutes.get("/get-all-problems",authMiddleware,getAllProblems)
problemRoutes.get("/get-problem/:id",authMiddleware,getProblemById)
problemRoutes.put("/update-problem/:id",authMiddleware,checkAdmin,updateProblemById)
problemRoutes.delete("/delete-problem/:id",authMiddleware,deleteProblem)
problemRoutes.get("get-solved-problems",authMiddleware,getAllProblemsSolvedByUser)

export default problemRoutes
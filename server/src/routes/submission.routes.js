import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { getAllSubmission, getAllSubmissionsForProblem, getSubmissiondForProblem } from "../controllers/submission.controller.js"

const submissionRoutes=express.Router()
submissionRoutes.get("/get-all-submissions",authMiddleware,getAllSubmission)
submissionRoutes.get("/get-submission/:problemId",authMiddleware,getSubmissiondForProblem)
submissionRoutes.get("/get--submission-count/:problemId",authMiddleware,getAllSubmissionsForProblem)



export default submissionRoutes
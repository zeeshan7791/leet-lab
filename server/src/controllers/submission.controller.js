export const getAllSubmission=async(req,res)=>{
    try {
        const userId=req.user.id

        const submissions=await db.submission.findMany({
            where:{
                userId:userId
            }
        })
        return res.status(200).json({
            success:true,
            message:"Submissions fetched successfully",
            submissions
        })
    } catch (error) {
         return res.status(500).json({
            success:false,
            error:"Failed to fetch submissions",
            
        })
    }
}
export const getSubmissiondForProblem=async(req,res)=>{
    try {
        const userId=req.user.id
        const problemId=req.params.problemId

         const submissions=await db.submission.findMany({
            where:{
                userId:userId,
                problemId:problemId
            }
        })
        return res.status(200).json({
            success:true,
            message:"Submissions fetched successfully",
            submissions
        })
    } catch (error) {
          return res.status(500).json({
            success:false,
            error:"Failed to fetch submissions",
            
        })
        
    }
}
export const getAllSubmissionsForProblem=async(req,res)=>{
    try {
        const problemId=req.params.problemId
         const submission=await db.submission.count({
            where:{
                userId:userId,
                problemId:problemId
            }
        })
        return res.status(200).json({
            success:true,
            message:"Submissions fetched successfully",
          count:submission
        })
    } catch (error) {
          return res.status(500).json({
            success:false,
            error:"Failed to fetch submissions",
            
        })
    }
}
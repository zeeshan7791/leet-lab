import { pollBatchResults, submitBatch } from "../libs/judeg0.lib.js";

export const executionCode=async(req,res)=>{
    const {source_code,language_id,stdin,expected_outputs,problemId}=req.body
    
   
    try {
        const userId=req.user.id
        
        if(!Array.isArray(stdin)||stdin.length===0||!Array.isArray(expected_outputs)||expected_outputs.length!==stdin.length){
return res.status(400).json({error:"invalid or missing testcases"})
        }

        const submissions = stdin.map((input) => ({
            source_code,
            language_id,
            stdin: input
        }));
        console.log(submissions,'submissions------')
        const submitReponse=await submitBatch(submissions)
        console.log(submitReponse,"response---------")
        const tokens = submitReponse.map((res) => res.token);

//  console.log(tokens,'token---------')
console.log(tokens,"token------------------")
        const results=await pollBatchResults(tokens)
        console.log(results,'results----------')

        return res.status(200).json({
            message:'code executed'
        })

    } catch (error) {
return res.status(500).json({error:"error while submitting problem"})
        
    }
}
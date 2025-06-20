import { db } from "../libs/db.js";
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judeg0.lib.js";
export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;


  // going to check the user role once again
  if(req.user.role!=="ADMIN"){
    return res.status(403).json({
      message:"You are not allowed to create a problem"
    })
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Language ${language} is not supported` });
      }
    

      //
      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));
      

      const submissionResults = await submitBatch(submissions);
     

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
      
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }
     

    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    });


    return res.status(201).json({
      sucess: true,
      message: "Message Created Successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Creating Problem",
    });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems=await db.problem.findMany({
      include:{
        solvedBy:{
          where:{
            userId:req.user.id
          }
        }

      }
    });
    if(!problems){
      return res.status(404).json({
        error: "No Problem Found",
      });
    }
    return res.status(200).json({
      success:true,
      message: "Problems fetched successfully",
      problems
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error While fetching problems",
    });
  }
};
export const getProblemById = async (req, res) => {
  
  const {id}=req.params
  console.log(id,'backend id of problem----------')
  try {
    const problem=await db.problem.findUnique({
where:{
  id,
}
    })
    if(!problem){
      return res.status(404).json({
        error: "Problem not found",
      });
    }
    return res.status(200).json({
      success:true,
     message:"Problem fetched successfully",
     problem
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error While Fetching Problem by id",
    });
  }
};
export const updateProblemById = async (req, res) => {
    const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

 const {id}=req.params
console.log(id,'value in from front end')

  try {
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Language ${language} is not supported` });
      }
    

      //
      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));
      

      const submissionResults = await submitBatch(submissions);
     

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
      
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }
     const findProblem=await db.problem.findUnique({
      where:{id},
     })

   if(!findProblem){
   return res.status(404).json({
      sucess: true,
      message: "Problem not found",
    });
    }
  
   const updateProblem = await db.problem.update({
  where: { id },
  data: {
    title:title?title:findProblem.title,
    description:description?description:findProblem.description,
    difficulty:difficulty?difficulty:findProblem.difficulty,
    tags:tags?tags:tags.difficulty,
    examples:examples?examples:findProblem.examples,
    constraints:constraints?constraints:findProblem.constraints,
    testcases:testcases?testcases:findProblem.testcases,
    codeSnippets:codeSnippets?codeSnippets:findProblem.codeSnippets,
    referenceSolutions:referenceSolutions?referenceSolutions:findProblem.referenceSolutions,
    userId: req.user.id,
  },
});
   

      return res.status(201).json({
      sucess: true,
      message: "Problem updated successfully",
      problem: updateProblem,
    });
  } catch (error) {
       return res.status(500).json({
      sucess: false,
      message: "Failed to update problem",
     
    });
  } 
};
export const deleteProblem = async (req, res) => {
  const {id}=req.params
  try {
    const problem=await db.problem.findUnique({
      where:{id}
    })
    if(!problem){
      return res.status(404).json({
        error: "Problem not found",
      });
    }
    await db.problem.delete({where:{id}})
    return res.status(200).json({
      success:true,
     message:"Problem deleted successfully",
   
    });

  } catch (error) {
    return res.status(500).json({
      error: "Error While deleting problem",
    });
  } 
};
export const getAllProblemsSolvedByUser = async (req, res) => {
  try {
    const problems=await db.problem.findMany({
      where:{
        solvedBy:{
          some:{
            userId:req.user.id
          }
        }

      },
      include:{
      solvedBy:{
          where:{
userId:req.user.id
        }
      }
    }
    })

    return res.status(200).json({
      success:true,
      message:"Problems fetched successfully",
      problems
    })
  } catch (error) {
     return res.status(500).json({
      success:false,
    error:"Failed to fetch problems",
 
    })
  }
};

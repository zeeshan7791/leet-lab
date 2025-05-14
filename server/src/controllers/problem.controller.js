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
console.log(submissions,'submissions--------')
console.log("before-================")
      const submissionResults = await submitBatch(submissions);
      console.log(submissionResults,'submissionresult------after')

      const tokens = submissionResults.map((res) => res.token);
console.log(tokens.join(","),'token------------')
      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Result-----", result);
        console.log(
          `Testcase ${i + 1} and Language ${language} ----- result ${JSON.stringify(result.status.description)}`
        );
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
    const problems=await db.problem.findMany();
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
 const {id}=req.params
  try {
    const problem=await db.problem.findUnique({
      where:{id}
    })
    if(!problem){

    }
  } catch (error) {
    
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

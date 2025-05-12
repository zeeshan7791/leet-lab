import { all } from "axios";
import { db } from "../libs/db.js";
import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../libs/judeg0.lib.js";

export const executionCode = async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs, problemId } =
    req.body;

  try {
    const userId = req.user.id;

    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ error: "invalid or missing testcases" });
    }

    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));
    // console.log(submissions,'submissions------')
    const submitReponse = await submitBatch(submissions);
    // console.log(submitReponse,"response---------")
    const tokens = submitReponse.map((res) => res.token);

    console.log(tokens, "token---------");
    // console.log(tokens,"token------------------")
    const results = await pollBatchResults(tokens);
    // console.log(results,'results----------')

    let allPassed = true;
    const detailedResults = results.map((result, i) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[i]?.trim();
      const passed = stdout === expected_output;

      if (!passed) allPassed = false;

      return {
        testCase: 1 + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} kb` : undefined,
        time: result.time ? `${result.time}` : undefined,
      };
      console.log(`Testcase #${i + 1}`);
      console.log(`input for testcase #${i + 1}: #${stdin[i]}`);
      console.log(
        `Expected output for testcase #${i + 1}: #${expected_output}`
      );
      console.log(`Actual output for testcase #${i + 1}: #${stdout}`);
      console.log(`Matched testcase #${i + 1}: #${passed}`);
    });

    console.log("detailed result------------")
    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r) => r.compile_output)
          ? JSON.stringify(detailedResults.map((r) => r.compile_output))
          : null,
          status:allPassed?"Accepted":"Wrong Answer",
                memory:detailedResults.some((r)=>r.memory)?JSON.stringify(detailedResults.map((r)=>r.memory)):null,
                time:detailedResults.some((r)=>r.time)?JSON.stringify(detailedResults.map((r)=>r.time)):null,
          
      },
    });
    console.log("submission done result------------")

    //  all passed mark as done for use
     if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }
    console.log("all passed done result------------")

    // save individual test case results  using detailed results
    const testCaseResults=detailedResults.map((result)=>({
        submissionId:submission.id,
        testCase:result.testCase,
        passed:result.passed,
        stdout:result.stdout,
        expected:result.expected,
        stderr:result.stderr,
        compileOutput:result.compile_output,
        status:result.status,
        memory:result.memory,
        time:result.time

    }))
    // console.log("test case result done ------------")

    await db.testCaseResult.createMany({
        data:testCaseResults
    })
 console.log("test case result done ------------")
    // get submissionwithtestcase
    const submissionWithTestCase=await db.submission.findUnique({
        where:{
            id:submission.id,
        },
            include:{
                testCases:true
            }
        
    })
   
 console.log("submission with testcase done ------------")

    return res.status(200).json({
        success:true,
      message: "code executed",
      submission:submissionWithTestCase
    });
  } catch (error) {
    return res.status(500).json({ error: "error while submitting problem" });
  }
};

import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";
export const createProblem = async (req, res) => {
  //going to get the all the data from the req.body
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
  console.log("problem create controller", req.user);
  console.log("problem create controller role", req.user.role);

  //going to check the user role once again
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "You are not allowed to create a problem",
    });
  }

  try {
    /*
  {
  python:dsfdsfdsf,
  c++:jghhjghjg,
  javascript:sdfsdfsdf
  }
  [[pythpn:gjh],[c++:jghhjghjg],[javascript:sdfsdfsdf]]
    
    */
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      //coming from front end
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        return res.status(400).json({
          error: `Language ${language} is not supported`,
        });
      }
      /*"testcases": [
        {
            "input": "100 200",
            "output": "300"
        },
        {
            "input": "-500 -600",
            "output": "-1100"
        },
        {
            "input": "0 0",
            "output": "0"
        }
    
    ], */
      const submissions = testcases.map(({ input, output }) => ({
        language_id: languageId,
        source_code: solutionCode,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((r) => r.token); //token = [token1,token2,token3]
      const results = await pollBatchResults(tokens);
      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
      //save the problem to the databse
      console.log("problem create controller", req.user);
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
      return res.status(201).json(newProblem);
    }
  } catch (error) {
    return res.status(500).json({
      message: "Problem creation failed",
      error: error.message,
    });
  }
  //loop through each reference solution for different languages
  //get judge0 language id for the current language
  //prepare judge0 submission for all the testcases
  //submit all test cases in one batch
  //extract tokens from response
  //poll judge0 until all submission are done
  //validate that each test cases passed (status.id ===3)
  //save the problem in the database after all validations pass
};

export const getAllProblems = async (req, res) => {};

export const getProblemById = async (req, res) => {};

export const updateProblemById = async (req, res) => {};

export const deleteProblem = async (req, res) => {};

export const getAllProblemsSolvedByUser = async (req, res) => {};

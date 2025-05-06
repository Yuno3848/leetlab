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
      console.log("refrence solutions:", referenceSolutions);
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
      console.log("submission --------: ", submissions);
      const submissionResults = await submitBatch(submissions);
      console.log("submissionResults----", submissionResults);
      const tokens = submissionResults.map((r) => r.token); //token = [token1,token2,token3]
      const results = await pollBatchResults(tokens);
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Result-------", result);
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
      //save the problem to the databse
      console.log("problem create controller(line no.84)", req.user);
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
          userId: req.user.userId,
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

export const getAllProblems = async (req, res) => {
  try {
    const problem = await db.problem.findMany();
    if (!problem) {
      return res.status(404).json({
        error: "No problems Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Message Fetched Succesfully",
      problem,
    });
  } catch (error) {
    console.log("get all problems", error);
    return res.status(500).json({
      error: "Error While Fetching Problems",
    });
  }
};

export const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });
    if (!problem) {
      return res.status(404).json({ error: "Problem not found." });
    }
    return res.status(200).json({
      success: true,
      message: "Message Created Successfully",
      problem,
    });
  } catch (error) {
    console.log("get all problems", error);
    return res.status(500).json({
      error: "Error While Fetching Problem by id",
    });
  }
};

export const updateProblemById = async (req, res) => {
  const { id } = req.params;

  // Check user role first to avoid unnecessary database queries
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "You are not allowed to update a problem",
    });
  }

  try {
    // First check if the problem exists
    const problem = await db.problem.findUnique({
      where: { id },
    });

    if (!problem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

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

    // Validate reference solutions against test cases
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        return res.status(400).json({
          error: `Language ${language} is not supported`,
        });
      }

      const submissions = testcases.map(({ input, output }) => ({
        language_id: languageId,
        source_code: solutionCode,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((r) => r.token);
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

    // Update the problem in the database
    const updatedProblem = await db.problem.update({
      where: { id },
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
        // No need to update userId as it remains the same
      },
    });

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem: updatedProblem,
    });
  } catch (error) {
    console.log("update problem error:", error);
    return res.status(500).json({
      error: "Error while updating the problem",
      message: error.message,
    });
  }
};

export const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.problem.findUnique({
      where: { id },
    });
    if (!problem) {
      return res.status(404).json({ error: "Problem Not found" });
    }
    await db.problem.delete({ where: { id } });
    res.status(200).json({
      success: true,
      message: "Problem deleted Successfully",
    });
  } catch (error) {
    console.log("delete problem", error);
    return res.status(500).json({
      error: "Error While deleting the problem",
    });
  }
};

export const getAllProblemsSolvedByUser = async (req, res) => {};

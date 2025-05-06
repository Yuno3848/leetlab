import { db } from "../libs/db.js";
import { STATUS } from "../generated/prisma/index.js";
import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, problemId } = req.body;

    const userId = req.user.id;

    //validate test cases

    const problem = await db.problem.findUnique({
      where: {
        id: problemId,
      },
    });
    if (!problem) {
      return res.status(404).json({
        error: "No problems Found",
      });
    }
    const stdin = problem.testcases.map((t) => t.input);
    const expected_output = problem.testcases.map((t) => t.output);
    console.log("stdin(execute controller)----------------", stdin);
    console.log(
      "expected_output(execute controller)----------------------",
      expected_output
    );
    //prepare each test cases for judge0 batch submission

    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));
    //send batch of submission to judge0

    const submitResponse = await submitBatch(submissions);
    console.log(
      "submitResponse (execute controller) -------------------------",
      submitResponse
    );
    const tokens = submitResponse.map((res) => res.token);
    console.log(
      "tokens (execute controller)--------------------------",
      tokens
    );

    const results = await pollBatchResults(tokens);
    console.log();
    console.log("Result (execute controller )-------------------", results);
    let isAllPassed = true;
    const detailedResults = results.map((result, i) => {
      const stdout = result.stdout.trim();
      const expectedOutputs = expected_output[i]?.trim();
      const isPassed = expectedOutputs == stdout;
      if (!isPassed) isAllPassed = false;
      // console.log(`Testcases : ${i + 1}`);
      // console.log(`Input for testcases ${i + 1} : ${stdin[i]}`);
      // console.log(`Output for testcases ${i + 1} : ${expectedOutputs}`);
      // console.log(`Acutal Result ${i + 1}: ${actualResult}`);
      // console.log(`Matched Testcases : ${isPassed}`);
      return {
        testCase: i + 1, // 1 2 3
        isPassed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        status: result.description,
        memory: result.memory ? `${result.memory}KB` : undefined,
        time: result.time ? `${result.time} s` : undefined,
      };
    });
    console.log("detailed results(execute-controller)------", detailedResults);
    //storing submission summary
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
        compileOutput: detailedResults.some((c) => c.compile_output)
          ? JSON.stringify(detailedResults.map((c) => c.compile_output))
          : null,

        status: isAllPassed ? STATUS.ACCEPTED : STATUS.WRONG_ANSWER,
        time: detailedResults.some((t) => t.time)
          ? JSON.stringify(detailedResults.map((t) => t.time))
          : null,
        memory: detailedResults.some((m) => m.memory)
          ? JSON.stringify(detailedResults.map((m) => m.memory))
          : null,
      },
    });
    //if all passed = true mark problem solved for the current user
    if (isAllPassed) {
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
    //save indivudal testcase result using detailedResults

    const testCaseResult = detailedResults.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.isPassed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      status: result.status.description,
      memory: result.memory,
      time: result.time,
    }));
    await db.TestCaseResult.createMany({
      data: testCaseResult,
    });

    const submissionWithTestCase = await db.submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        testCases: true,
      },
    });
    res.status(200).json({
      messsage: "Code Executed! Successfully!",
      submission: submissionWithTestCase,
    });
  } catch (error) {
    console.log("Error executing code: ", error.message);
    return res.status(500).json({
      message: "Failed to execute code",
      error: error.message,
    });
  }
};

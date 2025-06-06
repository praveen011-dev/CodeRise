import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { db } from "../libs/db.js";

const executeCode = asyncHandler(async (req, res, next) => {
  const {
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId,
    isSubmit = false,
  } = req.body;

  const userId = req.user.id;

  if (
    !Array.isArray(stdin) ||
    stdin.length === 0 ||
    !Array.isArray(expected_outputs) ||
    expected_outputs.length !== stdin.length
  ) {
    return next(new ApiError(400, "Invalid or missing test cases"));
  }

  const submissions = stdin.map((input) => ({
    source_code,
    language_id,
    stdin: input,
  }));

  const submitResponse = await submitBatch(submissions);
  const tokens = submitResponse.map((res) => res.token);
  const results = await pollBatchResults(tokens);

  let allPassed = true;
  const detailedResults = results.map((result, i) => {
    const stdout = result.stdout?.trim();
    const expected_output = expected_outputs[i]?.trim();
    const passed = stdout === expected_output;

    if (!passed) allPassed = false;

    // --- CRITICAL MODIFICATION START ---
    let effectiveStatus = result.status.description;

    // If the test case did NOT pass based on output comparison,
    // and Judge0's reported status is "Accepted", override it to "Wrong Answer".
    // This handles the contradiction you're seeing.
    if (!passed && effectiveStatus === "Accepted") {
      effectiveStatus = "Wrong Answer";
    }
    // --- CRITICAL MODIFICATION END ---

    return {
      testCase: i + 1,
      passed, // This boolean is the source of truth for "did it pass functionally?"
      stdout,
      expectedOutput: expected_output,
      compileOutput: result.compile_output || null,
      stderr: result.stderr || null,
      status: effectiveStatus, // Use the potentially overridden status here
      memory: result.memory ? `${result.memory}KB` : undefined,
      time: result.time ? `${result.time}s` : undefined,
    };
  });

  // Determine overall status for 'Run Code'
  let overallRunStatus = "Accepted";
  if (!allPassed) {
    const firstFailingTest = detailedResults.find((tc) => !tc.passed);
    overallRunStatus = firstFailingTest ? firstFailingTest.status : "Failed";
  }

  if (!isSubmit) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          allPassed,
          testcases: detailedResults.map((dr) => ({
            status: dr.status,
            passed: dr.passed,
            stdout: dr.stdout,
            expectedOutput: dr.expectedOutput,
            time: dr.time,
            memory: dr.memory,
            compileOutput: dr.compileOutput,
            stderr: dr.stderr,
          })),
          status: overallRunStatus,
        },
        "Run complete",
      ),
    );
  }

  // --- Rest of the code for submission (isSubmit = true) ---
  const submission = await db.submission.create({
    data: {
      userId,
      problemId,
      sourceCode: source_code,
      language: getLanguageName(language_id),
      status: allPassed ? "Accepted" : "Wrong Answer", // This will now use the logic where if any test failed, overall will be "Wrong Answer"
    },
  });

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

  const testcaseResultsToCreate = detailedResults.map((result) => ({
    submissionId: submission.id,
    testCase: result.testCase,
    passed: result.passed,
    stdout: result.stdout,
    expectedOutput: result.expectedOutput,
    stderr: result.stderr,
    compileOutput: result.compileOutput,
    status: result.status, // Store the effective status
    memory: result.memory,
    time: result.time,
  }));

  await db.testCaseResult.createMany({
    data: testcaseResultsToCreate,
    skipDuplicates: true,
  });

  const submissionWithTestcases = await db.submission.findUnique({
    where: {
      id: submission.id,
    },
    include: {
      testcases: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, submissionWithTestcases, "Solution submitted"));
});

export { executeCode };

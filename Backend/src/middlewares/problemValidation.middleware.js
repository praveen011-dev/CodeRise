import { ApiError } from "../utils/api.error.js";
import {
  createProblemSchema,
  updateProblemSchema,
} from "../validation/problem.validator.js";

export const validateCreateProblem = (req, _res, next) => {
  const result = createProblemSchema.safeParse(req.body);

  if (!result.success) {
    console.error(
      "Zod Validation Errors:",
      JSON.stringify(result.error.format(), null, 2),
    );

    // Send a more detailed error response (or just the first one as you had)
    const formattedErrors = result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    return next(
      new ApiError(400, "Problem data validation failed", formattedErrors),
    );
  }
  next();
};

export const validateUpdateProblem = (req, _res, next) => {
  const result = updateProblemSchema.safeParse(req.body);

  if (!result.success) {
    return next(
      new ApiError(
        400,
        "Problem update data validation failed",
        result.error.issues,
      ),
    );
  }
  next();
};

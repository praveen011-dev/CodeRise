import { ApiError } from "../utils/api.error.js";
import {
  createProblemSchema,
  updateProblemSchema,
} from "../validation/problem.validator.js";

export const validateCreateProblem = (req, _res, next) => {
  const result = createProblemSchema.safeParse(req.body);

  if (!result.success) {
    return next(
      new ApiError(
        400,
        "Problem data validation failed",
        result.error.issues[0].message,
      ),
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
        result.error.issues[0].message,
      ),
    );
  }
  next();
};

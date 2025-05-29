import { z } from "zod";

// Schema for individual examples (input, output, explanation)
const exampleDetailSchema = z.object({
  input: z
    .string({ required_error: "Example input is required." })
    .min(1, { message: "Example input cannot be empty." }),
  output: z
    .string({ required_error: "Example output is required." })
    .min(1, { message: "Example output cannot be empty." }),
  explanation: z.string().optional(),
});

// Schema for language-keyed objects holding code strings (for snippets, solutions)
const languageCodeMapSchema = z
  .record(
    z
      .string()
      .min(1, { message: "Language key (e.g., JAVASCRIPT) cannot be empty." }),
    z.string().min(1, { message: "Code content cannot be empty." }),
  )
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "This field must be provided for at least one language.",
  });

// Main schema for creating a problem
export const createProblemSchema = z.object({
  title: z
    .string({ required_error: "Title is required." })
    .min(1, { message: "Title cannot be empty." }),
  description: z
    .string({ required_error: "Description is required." })
    .min(1, { message: "Description cannot be empty." }),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
    required_error: "Difficulty is required.",
    invalid_type_error: "Difficulty must be one of 'EASY', 'MEDIUM', 'HARD'.",
  }),
  tags: z.array(
    z.string().min(1, { message: "Each tag must be a non-empty string." }),
  ),
  examples: z
    .record(
      z
        .string()
        .min(1, { message: "Language key for examples cannot be empty." }),
      exampleDetailSchema,
    )
    .refine((obj) => Object.keys(obj).length > 0, {
      message: "Examples must be provided for at least one language.",
    }),
  constraints: z
    .string({ required_error: "Constraints are required." })
    .min(1, { message: "Constraints cannot be empty." }),
  testcases: z
    .array(
      z.object({
        input: z
          .string({ required_error: "Test case input is required." })
          .min(1, { message: "Test case input cannot be empty." }),
        output: z
          .string({ required_error: "Test case output is required." })
          .min(1, { message: "Test case output cannot be empty." }),
      }),
    )
    .min(1, { message: "At least one test case is required." }),

  codeSnippet: languageCodeMapSchema,
  refrenceSolution: languageCodeMapSchema,

  // Optional fields are here

  hints: z.string().optional(),
  editorail: z.string().optional(), // User's spelling "editorail"
  category: z.string().optional(),
  companyTags: z
    .array(
      z
        .string()
        .min(1, { message: "Each company tag must be a non-empty string." }),
    )
    .default([]),
  isDemo: z.boolean().optional(),
  demoSolution: languageCodeMapSchema.optional(),
});

export const updateProblemSchema = z.object({
  title: z.string().min(1, "Title cannot be empty.").optional(),
  description: z.string().min(1, "Description cannot be empty.").optional(),
  difficulty: z
    .enum(["EASY", "MEDIUM", "HARD"], {
      invalid_type_error: "Difficulty must be one of 'EASY', 'MEDIUM', 'HARD'.",
    })
    .optional(),
  tags: z
    .array(z.string().min(1, "Each tag must be a non-empty string."))
    .optional(),
  examples: z
    .record(z.string().min(1), exampleDetailSchema) // If 'examples' obj is sent, its lang keys must be non-empty
    .optional(),
  constraints: z.string().min(1, "Constraints cannot be empty.").optional(),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, "Test case input cannot be empty."),
        output: z.string().min(1, "Test case output cannot be empty."),
      }),
    )
    .min(1, "If provided, testcases array cannot be empty.")
    .optional(),
  codeSnippet: languageCodeMapSchema,
  refrenceSolution: languageCodeMapSchema,

  hints: z.string().optional(),
  editorail: z.string().optional(),
  category: z.string().optional(),
  companyTags: z
    .array(z.string().min(1, "Each company tag must be a non-empty string."))
    .optional(),
  isDemo: z.boolean().optional(),
  demoSolution: languageCodeMapSchema,
});

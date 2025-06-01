// src/validation/problem.validator.js
import { z } from "zod";

// For 'examples' items
const exampleDetailSchema = z.object({
  input: z.string().min(1, "Example input is required."),
  output: z.string().min(1, "Example output is required."),
  explanation: z.string().optional(),
});

// For language-keyed objects (used for examples, snippets, solutions)
const languageObjectSchema = (itemSchema) =>
  z
    .record(z.string().min(1, "Language key cannot be empty."), itemSchema)
    .refine((obj) => Object.keys(obj).length > 0, {
      message: "Must be provided for at least one language.",
    });

const codeStringSchema = z.string().min(1, "Code content cannot be empty.");

// Main schema for the 'Create Problem' form data payload
export const createProblemFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
    required_error: "Difficulty is required.",
  }),
  tags: z
    .array(z.string().min(1, "Each tag must be non-empty."))
    .min(1, "At least one tag is required."),
  examples: languageObjectSchema(exampleDetailSchema),
  constraints: z.string().min(1, "Constraints are required."),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, "Test case input is required."),
        output: z.string().min(1, "Test case output is required."),
      })
    )
    .min(1, "At least one test case is required."),
  codeSnippet: languageObjectSchema(codeStringSchema),
  refrenceSolution: languageObjectSchema(codeStringSchema),

  // Optional fields from your Prisma schema
  hints: z.string().optional(),
  editorail: z.string().optional(),
  category: z.string().optional(),
  companyTags: z
    .array(z.string().min(1, "Each company tag must be non-empty."))
    .default([]),
  isDemo: z.boolean().optional(),
  demoSolution: languageObjectSchema(codeStringSchema).optional(),
});

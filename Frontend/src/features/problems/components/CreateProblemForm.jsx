// src/features/problems/components/CreateProblemForm.jsx
import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { createProblemFormSchema } from "../schemas/Problem.schema.js";
import { createProblem as createProblemService } from "../../../services/problemService"; //

// Shadcn/UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox"; // For isDemo

// Lucide Icons
import {
  Plus,
  Trash2,
  Code2,
  FileText,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Download,
} from "lucide-react";
import Editor from "@monaco-editor/react";

// Keep your sample data definitions (sampledpData, sampleStringProblem)
// or import them from a separate file if you prefer.
// For this example, I'll assume they are defined in this file or imported.
// const sampledpData = { /* ... as you provided ... */ };
// const sampleStringProblem = { /* ... as you provided, ensure field names match new Zod schema ... */ };

const LANGUAGES = ["JAVASCRIPT", "PYTHON", "JAVA"]; // For iterating editor sections

function CreateProblemForm() {
  const [sampleType, setSampleType] = useState("DP");
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }, // isSubmitting from RHF
  } = useForm({
    resolver: zodResolver(createProblemFormSchema),
    defaultValues: {
      // Ensure these defaults match the (potentially renamed) Zod schema fields
      title: "",
      description: "",
      difficulty: "EASY",
      tags: [""],
      constraints: "",
      hints: "",
      editorail: "",
      category: "",
      companyTags: "",
      testcases: [{ input: "", output: "" }],
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON: { input: "", output: "", explanation: "" },
        JAVA: { input: "", output: "", explanation: "" },
      },
      codeSnippet: {
        JAVASCRIPT: "function solution(args) {\n  // Write your code here\n}",
        PYTHON: "def solution(args):\n    # Write your code here\n    pass",
        JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
      },
      refrenceSolution: {
        JAVASCRIPT: "// Add reference solution",
        PYTHON: "# Add reference solution",
        JAVA: "// Add reference solution",
      },
      isDemo: false,
      demoSolution: { JAVASCRIPT: "", PYTHON: "", JAVA: "" },
    },
  });

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replaceTestCases,
  } = useFieldArray({ control, name: "testcases" }); // Use 'testcases' (lowercase)

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray({ control, name: "tags" });

  const onSubmit = async (formData) => {
    try {
      const response = await createProblemService(formData);
      toast.success("Problem Created!", {
        description: response?.message || "Successfully added the new problem.",
      });
      reset();
      navigate("/problems"); // Or to the new problem's page, or problem list
    } catch (error) {
      toast.error("Failed to Create Problem", {
        description: error?.message || "An unknown error occurred.",
      });
      console.error("Error creating problem:", error);
    }
  };

  const loadSampleData = () => {
    // Ensure sampledpData and sampleStringProblem use the corrected field names
    // (e.g., testcases, codeSnippet, refrenceSolution, editorail)
    // const sampleDataToLoad = sampleType === "DP" ? sampledpData : sampleStringProblem;
    // reset(sampleDataToLoad);
    // For field arrays like tags and testcases, you might need to use replaceTags and replaceTestCases
    toast.info(
      "Load sample data functionality needs to be reviewed with updated field names."
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {" "}
      {/* Adjusted max-width */}
      <Card className="overflow-hidden">
        {" "}
        {/* Add overflow-hidden if content might break out */}
        <CardHeader className="bg-slate-50 dark:bg-slate-800 border-b">
          <CardTitle className="text-2xl md:text-3xl flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <FileText className="w-7 h-7 text-blue-600" />
            Create New Problem
          </CardTitle>
          <CardDescription>
            Fill in the details below to add a new programming problem.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Sample Data Buttons - using Shadcn Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <div className="flex border rounded-md">
              <Button
                type="button"
                variant={sampleType === "DP" ? "default" : "outline"}
                onClick={() => setSampleType("DP")}
                className="rounded-r-none border-r"
              >
                DP Sample
              </Button>
              <Button
                type="button"
                variant={sampleType === "string" ? "default" : "outline"}
                onClick={() => setSampleType("string")}
                className="rounded-l-none"
              >
                String Sample
              </Button>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={loadSampleData}
              className="gap-2"
            >
              <Download className="w-4 h-4" /> Load Sample
            </Button>
          </div>
          <Separator />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="font-semibold">
                  Title
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="e.g., Two Sum"
                  className="mt-1"
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="description" className="font-semibold">
                  Description (Markdown supported)
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Detailed problem description..."
                  className="mt-1 min-h-[150px]"
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="difficulty" className="font-semibold">
                  Difficulty
                </Label>
                <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="w-full md:w-[180px] mt-1">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EASY">Easy</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HARD">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.difficulty && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.difficulty.message}
                  </p>
                )}
              </div>
            </div>
            <Separator />

            {/* Tags */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> Tags
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendTag("")}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Tag
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tagFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <Input
                      {...register(`tags.${index}`)}
                      placeholder="e.g., Array"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTag(index)}
                      disabled={tagFields.length <= 1 /* Keep at least one */}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
              {errors.tags && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.tags.message || errors.tags.root?.message}
                </p>
              )}
            </div>
            <Separator />

            {/* Test Cases */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Test Cases
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendTestCase({ input: "", output: "" })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Test Case
                </Button>
              </div>
              <div className="space-y-3">
                {testCaseFields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Test Case #{index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTestCase(index)}
                        disabled={testCaseFields.length <= 1}
                      >
                        <Trash2 className="w-4 h-4 mr-1 text-red-500" />
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`testcases.${index}.input`}>
                          Input
                        </Label>
                        <Textarea
                          id={`testcases.${index}.input`}
                          {...register(`testcases.${index}.input`)}
                          className="mt-1 min-h-[70px]"
                        />
                        {errors.testcases?.[index]?.input && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.testcases[index].input.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor={`testcases.${index}.output`}>
                          Expected Output
                        </Label>
                        <Textarea
                          id={`testcases.${index}.output`}
                          {...register(`testcases.${index}.output`)}
                          className="mt-1 min-h-[70px]"
                        />
                        {errors.testcases?.[index]?.output && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.testcases[index].output.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {errors.testcases && !Array.isArray(errors.testcases) && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.testcases.message}
                </p>
              )}
            </div>
            <Separator />

            {/* Code Editors for Snippets, Solutions, Examples */}
            <div className="space-y-4">
              {LANGUAGES.map((language) => (
                <Card key={language} className="p-1">
                  {" "}
                  {/* Slightly less padding on outer card */}
                  <CardHeader className="p-3 pb-2">
                    {" "}
                    {/* Less padding in header */}
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Code2 className="w-5 h-5" />{" "}
                      {language.charAt(0) + language.slice(1).toLowerCase()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 p-3">
                    {/* Examples */}
                    <div className="border p-2 rounded-md bg-slate-50 dark:bg-slate-800/50">
                      <Label
                        htmlFor={`examples.${language}.input`}
                        className="font-medium text-sm"
                      >
                        Example Input
                      </Label>
                      <Textarea
                        id={`examples.${language}.input`}
                        {...register(`examples.${language}.input`)}
                        className="mt-1 text-xs min-h-[40px]"
                      />
                      {errors.examples?.[language]?.input && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.examples[language].input.message}
                        </p>
                      )}

                      <Label
                        htmlFor={`examples.${language}.output`}
                        className="font-medium text-sm mt-2 block"
                      >
                        Example Output
                      </Label>
                      <Textarea
                        id={`examples.${language}.output`}
                        {...register(`examples.${language}.output`)}
                        className="mt-1 text-xs min-h-[40px]"
                      />
                      {errors.examples?.[language]?.output && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.examples[language].output.message}
                        </p>
                      )}

                      <Label
                        htmlFor={`examples.${language}.explanation`}
                        className="font-medium text-sm mt-2 block"
                      >
                        Example Explanation (Optional)
                      </Label>
                      <Textarea
                        id={`examples.${language}.explanation`}
                        {...register(`examples.${language}.explanation`)}
                        className="mt-1 text-xs min-h-[60px]"
                      />
                    </div>
                    {/* Code Snippet */}
                    <div>
                      <Label
                        htmlFor={`codeSnippet.${language}`}
                        className="font-medium text-sm"
                      >
                        Starter Code Snippet
                      </Label>
                      <Controller
                        name={`codeSnippet.${language}`}
                        control={control}
                        render={({ field }) => (
                          <div className="mt-1 border rounded-md overflow-hidden">
                            <Editor
                              height="200px"
                              language={language.toLowerCase()}
                              theme="vs-dark"
                              value={field.value}
                              onChange={field.onChange}
                              options={{
                                minimap: { enabled: false },
                                fontSize: 12,
                                automaticLayout: true,
                              }}
                            />
                          </div>
                        )}
                      />
                      {errors.codeSnippet?.[language] && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.codeSnippet[language].message}
                        </p>
                      )}
                    </div>
                    {/* Reference Solution */}
                    <div>
                      <Label
                        htmlFor={`refrenceSolution.${language}`}
                        className="font-medium text-sm"
                      >
                        Reference Solution
                      </Label>
                      <Controller
                        name={`refrenceSolution.${language}`}
                        control={control}
                        render={({ field }) => (
                          <div className="mt-1 border rounded-md overflow-hidden">
                            <Editor
                              height="250px"
                              language={language.toLowerCase()}
                              theme="vs-dark"
                              value={field.value}
                              onChange={field.onChange}
                              options={{
                                minimap: { enabled: false },
                                fontSize: 12,
                                automaticLayout: true,
                              }}
                            />
                          </div>
                        )}
                      />
                      {errors.refrenceSolution?.[language] && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.refrenceSolution[language].message}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Separator />

            {/* Additional Information: Constraints, Hints, Editorial, Category, Company Tags, IsDemo, DemoSolution */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" /> Additional
                Information
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="constraints" className="font-medium">
                    Constraints
                  </Label>
                  <Textarea
                    id="constraints"
                    {...register("constraints")}
                    className="mt-1 min-h-[70px]"
                  />
                  {errors.constraints && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.constraints.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="hints" className="font-medium">
                    Hints (Optional)
                  </Label>
                  <Textarea
                    id="hints"
                    {...register("hints")}
                    className="mt-1 min-h-[70px]"
                  />
                </div>
                <div>
                  <Label htmlFor="editorail" className="font-medium">
                    Editorial (Optional)
                  </Label>
                  <Textarea
                    id="editorail"
                    {...register("editorail")}
                    className="mt-1 min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="font-medium">
                    Category (Optional)
                  </Label>
                  <Input
                    id="category"
                    {...register("category")}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="companyTags" className="font-medium">
                    Company Tags (comma-separated)
                  </Label>
                  <Input
                    id="companyTags"
                    {...register("companyTags", {
                      setValueAs: (value) => {
                        if (typeof value === "string") {
                          return value
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter((tag) => tag); // filter(Boolean) also works here to remove empty strings
                        }
                        // If the value isn't a string (e.g., undefined, or already an array),
                        // return an empty array or the value if it's already an array.
                        // For a text input, we generally expect a string or undefined.
                        return Array.isArray(value)
                          ? value.filter(
                              (tag) => typeof tag === "string" && tag.trim()
                            )
                          : [];
                      },
                    })}
                    placeholder="e.g. Google, Amazon"
                    className="mt-1"
                  />
                  {errors.companyTags && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.companyTags.message ||
                        errors.companyTags.root?.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Controller
                    name="isDemo"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="isDemo"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="isDemo" className="font-medium">
                    Is this a Demo Problem?
                  </Label>
                </div>
                {watch("isDemo") && (
                  <div className="pl-2 border-l-2 border-blue-500 space-y-2">
                    <h4 className="text-md font-semibold text-slate-700">
                      Demo Solution Code
                    </h4>
                    {LANGUAGES.map((language) => (
                      <div key={`demo-${language}`}>
                        <Label
                          htmlFor={`demoSolution.${language}`}
                          className="font-medium text-sm"
                        >
                          {language}
                        </Label>
                        <Controller
                          name={`demoSolution.${language}`}
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <div className="mt-1 border rounded-md overflow-hidden">
                              <Editor
                                height="150px"
                                language={language.toLowerCase()}
                                theme="vs-dark"
                                value={field.value}
                                onChange={field.onChange}
                                options={{
                                  minimap: { enabled: false },
                                  fontSize: 12,
                                  automaticLayout: true,
                                }}
                              />
                            </div>
                          )}
                        />
                        {errors.demoSolution?.[language] && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.demoSolution[language].message}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <Separator />

            <CardFooter className="pt-6">
              <Button
                type="submit"
                size="lg"
                className="w-full md:w-auto gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span
                    className="animate-spin inline-block w-5 h-5 border-2 border-t-transparent border-white rounded-full"
                    role="status"
                  ></span>
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                {isSubmitting ? "Creating Problem..." : "Create Problem"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateProblemForm;

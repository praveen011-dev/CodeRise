import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams to get problemId
import { toast } from "sonner"; // For notifications

import { createProblemFormSchema } from "../schemas/Problem.schema.js"; // Use the same validation schema
// Import useProblemStore to fetch problem data and use the update action
import { useProblemStore } from "../../../store/useProblemStore";

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
import { Checkbox } from "@/components/ui/checkbox";

// Lucide Icons
import {
  Plus,
  Trash2,
  Code2,
  FileText,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Download, // Included if you have sample data loading
} from "lucide-react";
import Editor from "@monaco-editor/react"; // For code editors

const LANGUAGES = ["JAVASCRIPT", "PYTHON", "JAVA"];

function EditProblemForm() {
  const { problemId } = useParams(); // Extract problemId from the URL (e.g., /admin/edit-problem/:problemId)
  const navigate = useNavigate(); // For navigation after update

  // Access relevant state and actions from the problem store
  const {
    problem, // The problem object that will be fetched for editing
    isProblemLoading, // Loading state for fetching a single problem
    error: problemError, // Error state if fetching a single problem fails
    getProblemById, // Action to fetch a single problem by ID
    updateProblem: updateProblemAction, // The action to send the updated problem data to the backend
  } = useProblemStore();

  const [sampleType, setSampleType] = useState("DP"); // State for sample data buttons (less critical in edit mode, but part of original form)

  const {
    register,
    control,
    handleSubmit,
    reset, // Key for prefilling the form with fetched data
    setValue, // Can be useful for manually setting values if needed
    watch, // To subscribe to form value changes (e.g., for 'isDemo' checkbox)
    formState: { errors, isSubmitting }, // Form submission state and validation errors
  } = useForm({
    resolver: zodResolver(createProblemFormSchema), // Apply the same Zod schema for validation
    // Default values are set as empty, but they will be dynamically overwritten
    // by the `reset` function once the problem data is loaded for editing.
    defaultValues: {
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
      examples: {},
      codeSnippet: {},
      refrenceSolution: {},
      isDemo: false,
      demoSolution: {},
    },
  });

  // react-hook-form's useFieldArray for managing dynamic fields (like test cases and tags)
  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
  } = useFieldArray({ control, name: "testcases" });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({ control, name: "tags" });

  // --- Effect 1: Fetch the problem data when the component mounts or problemId changes ---
  useEffect(() => {
    if (problemId) {
      getProblemById(problemId); // Call the store action to fetch the problem
    }
  }, [problemId, getProblemById]); // Dependencies: problemId from URL, and the getProblemById action

  // --- Effect 2: Prefill the form with the fetched problem data once it's available ---
  useEffect(() => {
    // Ensure that `problem` object exists and its ID matches the problemId from the URL.
    // This prevents trying to prefill with data for a different problem or before data is loaded.
    if (problem && problem.id === problemId) {
      reset({
        // Use reset to populate all form fields with the fetched data
        title: problem.title || "",
        description: problem.description || "",
        difficulty: problem.difficulty || "EASY",
        // Tags: Ensure it's an array for react-hook-form. If empty, provide [""] to show one input.
        tags: problem.tags?.length ? problem.tags : [""],
        constraints: problem.constraints || "",
        hints: problem.hints || "",
        editorail: problem.editorail || "",
        category: problem.category || "",
        // Company Tags: Convert the array from backend to a comma-separated string for the input field.
        companyTags: Array.isArray(problem.companyTags)
          ? problem.companyTags.join(", ")
          : problem.companyTags || "",
        // Testcases: Ensure it's an array. If empty, provide a default empty test case.
        testcases: problem.testcases?.length
          ? problem.testcases
          : [{ input: "", output: "" }],

        // Examples, Code Snippets, Reference Solutions, Demo Solution:
        // Dynamically populate these nested objects for each language.
        // Provide a fallback empty structure if the data is missing from the fetched problem.
        examples:
          problem.examples ||
          LANGUAGES.reduce(
            (acc, lang) => ({
              ...acc,
              [lang]: { input: "", output: "", explanation: "" },
            }),
            {}
          ),
        codeSnippet:
          problem.codeSnippet ||
          LANGUAGES.reduce((acc, lang) => ({ ...acc, [lang]: "" }), {}),
        refrenceSolution:
          problem.refrenceSolution ||
          LANGUAGES.reduce((acc, lang) => ({ ...acc, [lang]: "" }), {}),
        isDemo: typeof problem.isDemo === "boolean" ? problem.isDemo : false, // Ensure boolean type for checkbox
        demoSolution:
          problem.demoSolution ||
          LANGUAGES.reduce((acc, lang) => ({ ...acc, [lang]: "" }), {}),
      });
    }
  }, [problem, problemId, reset]); // Dependencies: fetched problem object, problemId from URL, and react-hook-form's reset function

  // --- onSubmit handler for updating the problem ---
  const onSubmit = async (formData) => {
    try {
      // Data transformation before sending to the backend
      const dataToSubmit = {
        ...formData,
        // Convert companyTags string from input back to an array for the backend.
        companyTags:
          typeof formData.companyTags === "string"
            ? formData.companyTags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag)
            : Array.isArray(formData.companyTags)
            ? formData.companyTags.filter((tag) => tag)
            : [],
        // Ensure tags array is clean (filter out any empty strings if user left fields blank)
        tags: formData.tags.filter((tag) => tag),
      };

      // Call the updateProblemAction from the Zustand store
      const response = await updateProblemAction(problemId, dataToSubmit);
      toast.success("Problem Updated!", {
        // Show success notification
        description: response?.message || "Successfully updated the problem.",
      });
      navigate("/problems"); // Navigate back to the problems list after a successful update
    } catch (error) {
      toast.error("Failed to Update Problem", {
        // Show error notification
        description: error?.message || "An unknown error occurred.",
      });
      console.error("Error updating problem:", error); // Log error for debugging
    }
  };

  // --- Load Sample Data (functionality for creating new problems, less relevant for edit) ---
  const loadSampleData = () => {
    toast.info(
      "Load sample data functionality needs to be reviewed with updated field names for editing."
    );
    // You could optionally implement logic here to prefill with specific sample data,
    // which might be useful for admins to quickly test problem setups.
  };

  // --- Loading and Error States for fetching problem data ---
  if (isProblemLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl text-center text-foreground">
        Loading problem data...
      </div>
    );
  }
  if (problemError) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl text-center text-destructive">
        Error loading problem: {problemError}
      </div>
    );
  }
  // If no problem is found after loading (e.g., if problemId is invalid or problem doesn't exist)
  if (!problem && !isProblemLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl text-center text-muted-foreground">
        Problem not found. Please check the URL or if the problem exists.
      </div>
    );
  }

  // --- Main JSX Return (Form Layout and Fields) ---
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card
        className="
          overflow-hidden shadow-xl relative z-10
          bg-card/70 border border-border/50
          backdrop-blur-md transition-colors duration-500
        "
      >
        <CardHeader
          className="
            bg-background/50 border-b border-border/50
            transition-colors duration-500
          "
        >
          {/* Card Title for Edit Mode */}
          <CardTitle className="text-2xl md:text-3xl flex items-center gap-2 text-foreground">
            <FileText className="w-7 h-7 text-primary" />
            Edit Problem: {problem?.title || "Loading..."}{" "}
            {/* Displays the title of the problem being edited */}
          </CardTitle>
          {/* Card Description for Edit Mode */}
          <CardDescription className="text-muted-foreground">
            Modify the details below to update this programming problem.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8 text-foreground">
          {/* Sample Data Buttons - Optional to keep for an edit form */}
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <div className="flex border border-border rounded-md overflow-hidden">
              <Button
                type="button"
                variant={sampleType === "DP" ? "default" : "outline"}
                onClick={() => setSampleType("DP")}
                className="rounded-r-none border-r border-border/50"
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
          <Separator className="bg-border/50" />

          {/* Form Starts Here */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="title"
                  className="font-semibold text-foreground"
                >
                  Title
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="e.g., Two Sum"
                  className="mt-1 bg-input/80 text-foreground"
                />
                {errors.title && (
                  <p className="text-destructive text-sm min-h-[1.25rem] mt-1">
                    {errors.title.message || "placeholder"}
                  </p>
                )}
                {!errors.title && (
                  <p className="text-destructive text-sm min-h-[1.25rem] mt-1 opacity-0">
                    placeholder
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="description"
                  className="font-semibold text-foreground"
                >
                  Description (Markdown supported)
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Detailed problem description..."
                  className="mt-1 min-h-[150px] bg-input/80 text-foreground"
                />
                {errors.description && (
                  <p className="text-destructive text-sm min-h-[1.25rem] mt-1">
                    {errors.description.message || "placeholder"}
                  </p>
                )}
                {!errors.description && (
                  <p className="text-destructive text-sm min-h-[1.25rem] mt-1 opacity-0">
                    placeholder
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="difficulty"
                  className="font-semibold text-foreground"
                >
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
                      <SelectTrigger className="w-full md:w-[180px] mt-1 bg-input/80 text-foreground">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover text-popover-foreground">
                        <SelectItem value="EASY">Easy</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HARD">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.difficulty && (
                  <p className="text-destructive text-sm min-h-[1.25rem] mt-1">
                    {errors.difficulty.message || "placeholder"}
                  </p>
                )}
                {!errors.difficulty && (
                  <p className="text-destructive text-sm min-h-[1.25rem] mt-1 opacity-0">
                    placeholder
                  </p>
                )}
              </div>
            </div>
            <Separator className="bg-border/50" />

            {/* Tags Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                  <BookOpen className="w-5 h-5 text-primary" /> Tags
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
                      className="bg-input/80 text-foreground"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTag(index)}
                      disabled={tagFields.length <= 1}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              {errors.tags && (
                <p className="text-destructive text-sm min-h-[1.25rem] mt-1">
                  {errors.tags.message ||
                    errors.tags.root?.message ||
                    "placeholder"}
                </p>
              )}
              {!errors.tags && (
                <p className="text-destructive text-sm min-h-[1.25rem] mt-1 opacity-0">
                  placeholder
                </p>
              )}
            </div>
            <Separator className="bg-border/50" />

            {/* Test Cases Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Test Cases
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
                  <Card
                    key={field.id}
                    className="
                      p-4 bg-card/50 border border-border/50
                      backdrop-blur-sm transition-colors duration-500
                    "
                  >
                    <div className="flex justify-between items-center mb-2 text-foreground">
                      <h4 className="font-medium">Test Case #{index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTestCase(index)}
                        disabled={testCaseFields.length <= 1}
                      >
                        <Trash2 className="w-4 h-4 mr-1 text-destructive" />
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label
                          htmlFor={`testcases.${index}.input`}
                          className="text-foreground"
                        >
                          Input
                        </Label>
                        <Textarea
                          id={`testcases.${index}.input`}
                          {...register(`testcases.${index}.input`)}
                          className="mt-1 min-h-[70px] bg-input/80 text-foreground"
                        />
                        <p
                          className={`text-xs text-destructive min-h-[1.25rem] mt-1 ${
                            errors.testcases?.[index]?.input
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        >
                          {errors.testcases?.[index]?.input?.message ||
                            "placeholder"}
                        </p>
                      </div>
                      <div>
                        <Label
                          htmlFor={`testcases.${index}.output`}
                          className="text-foreground"
                        >
                          Expected Output
                        </Label>
                        <Textarea
                          id={`testcases.${index}.output`}
                          {...register(`testcases.${index}.output`)}
                          className="mt-1 min-h-[70px] bg-input/80 text-foreground"
                        />
                        <p
                          className={`text-xs text-destructive min-h-[1.25rem] mt-1 ${
                            errors.testcases?.[index]?.output
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        >
                          {errors.testcases?.[index]?.output?.message ||
                            "placeholder"}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {errors.testcases && !Array.isArray(errors.testcases) && (
                <p className="text-destructive text-sm min-h-[1.25rem] mt-1">
                  {errors.testcases.message || "placeholder"}
                </p>
              )}
              {errors.testcases &&
                Array.isArray(errors.testcases) &&
                errors.testcases.some((tcError) => tcError) && (
                  <p className="text-destructive text-sm min-h-[1.25rem] mt-1">
                    Please fix errors in test cases above.
                  </p>
                )}
              {(!errors.testcases ||
                (Array.isArray(errors.testcases) &&
                  !errors.testcases.some((tcError) => tcError))) && (
                <p className="text-destructive text-sm min-h-[1.25rem] mt-1 opacity-0">
                  placeholder
                </p>
              )}
            </div>
            <Separator className="bg-border/50" />

            {/* Code Editors for Snippets, Solutions, Examples */}
            <div className="space-y-4">
              {LANGUAGES.map((language) => (
                <Card
                  key={language}
                  className="
                    p-1 bg-card/50 border border-border/50
                    backdrop-blur-sm transition-colors duration-500
                  "
                >
                  <CardHeader className="p-3 pb-2 bg-background/50 border-b border-border/50">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                      <Code2 className="w-5 h-5 text-primary" />{" "}
                      {language.charAt(0) + language.slice(1).toLowerCase()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 p-3">
                    {/* Examples */}
                    <div className="border border-border/50 p-2 rounded-md bg-background/50">
                      <Label
                        htmlFor={`examples.${language}.input`}
                        className="font-medium text-sm text-foreground"
                      >
                        Example Input
                      </Label>
                      <Textarea
                        id={`examples.${language}.input`}
                        {...register(`examples.${language}.input`)}
                        className="mt-1 text-xs min-h-[40px] bg-input/80 text-foreground"
                      />
                      <p
                        className={`text-xs text-destructive min-h-[1.25rem] mt-1 ${
                          errors.examples?.[language]?.input
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        {errors.examples?.[language]?.input?.message ||
                          "placeholder"}
                      </p>

                      <Label
                        htmlFor={`examples.${language}.output`}
                        className="font-medium text-sm mt-2 block text-foreground"
                      >
                        Example Output
                      </Label>
                      <Textarea
                        id={`examples.${language}.output`}
                        {...register(`examples.${language}.output`)}
                        className="mt-1 text-xs min-h-[40px] bg-input/80 text-foreground"
                      />
                      <p
                        className={`text-xs text-destructive min-h-[1.25rem] mt-1 ${
                          errors.examples?.[language]?.output
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        {errors.examples?.[language]?.output?.message ||
                          "placeholder"}
                      </p>

                      <Label
                        htmlFor={`examples.${language}.explanation`}
                        className="font-medium text-sm mt-2 block text-foreground"
                      >
                        Example Explanation (Optional)
                      </Label>
                      <Textarea
                        id={`examples.${language}.explanation`}
                        {...register(`examples.${language}.explanation`)}
                        className="mt-1 text-xs min-h-[60px] bg-input/80 text-foreground"
                      />
                      <p
                        className={`text-xs text-destructive min-h-[1.25rem] mt-1 ${
                          errors.examples?.[language]?.explanation
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        {errors.examples?.[language]?.explanation?.message ||
                          "placeholder"}
                      </p>
                    </div>
                    {/* Code Snippet */}
                    <div>
                      <Label
                        htmlFor={`codeSnippet.${language}`}
                        className="font-medium text-sm text-foreground"
                      >
                        Starter Code Snippet
                      </Label>
                      <Controller
                        name={`codeSnippet.${language}`}
                        control={control}
                        render={({ field }) => (
                          <div className="mt-1 border border-border/50 rounded-md overflow-hidden">
                            <Editor
                              height="200px"
                              language={language.toLowerCase()}
                              theme="vs-dark" // Consider custom theme here later
                              value={field.value}
                              onChange={field.onChange}
                              options={{
                                minimap: { enabled: false },
                                fontSize: 12,
                                automaticLayout: true,
                                wordWrap: "on",
                              }}
                            />
                          </div>
                        )}
                      />
                      <p
                        className={`text-xs text-destructive min-h-[1.25rem] mt-1 ${
                          errors.codeSnippet?.[language]
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        {errors.codeSnippet?.[language]?.message ||
                          "placeholder"}
                      </p>
                    </div>
                    {/* Reference Solution */}
                    <div>
                      <Label
                        htmlFor={`refrenceSolution.${language}`}
                        className="font-medium text-sm text-foreground"
                      >
                        Reference Solution
                      </Label>
                      <Controller
                        name={`refrenceSolution.${language}`}
                        control={control}
                        render={({ field }) => (
                          <div className="mt-1 border border-border/50 rounded-md overflow-hidden">
                            <Editor
                              height="250px"
                              language={language.toLowerCase()}
                              theme="vs-dark" // Consider custom theme here later
                              value={field.value}
                              onChange={field.onChange}
                              options={{
                                minimap: { enabled: false },
                                fontSize: 12,
                                automaticLayout: true,
                                wordWrap: "on",
                              }}
                            />
                          </div>
                        )}
                      />
                      <p
                        className={`text-xs text-destructive min-h-[1.25rem] mt-1 ${
                          errors.refrenceSolution?.[language]
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        {errors.refrenceSolution?.[language]?.message ||
                          "placeholder"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Separator className="bg-border/50" />

            {/* Additional Information: Constraints, Hints, Editorial, Category, Company Tags, IsDemo, DemoSolution */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-foreground">
                <Lightbulb className="w-5 h-5 text-yellow-400" /> Additional
                Information
              </h3>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="constraints"
                    className="font-medium text-foreground"
                  >
                    Constraints
                  </Label>
                  <Textarea
                    id="constraints"
                    {...register("constraints")}
                    className="mt-1 min-h-[70px] bg-input/80 text-foreground"
                  />
                  <p
                    className={`text-sm text-destructive min-h-[1.25rem] mt-1 ${
                      errors.constraints ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {errors.constraints?.message || "placeholder"}
                  </p>
                </div>
                <div>
                  <Label
                    htmlFor="hints"
                    className="font-medium text-foreground"
                  >
                    Hints (Optional)
                  </Label>
                  <Textarea
                    id="hints"
                    {...register("hints")}
                    className="mt-1 min-h-[70px] bg-input/80 text-foreground"
                  />
                  <p
                    className={`text-sm text-destructive min-h-[1.25rem] mt-1 ${
                      errors.hints ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {errors.hints?.message || "placeholder"}
                  </p>
                </div>
                <div>
                  <Label
                    htmlFor="editorail"
                    className="font-medium text-foreground"
                  >
                    Editorial (Optional)
                  </Label>
                  <Textarea
                    id="editorail"
                    {...register("editorail")}
                    className="mt-1 min-h-[100px] bg-input/80 text-foreground"
                  />
                  <p
                    className={`text-sm text-destructive min-h-[1.25rem] mt-1 ${
                      errors.editorail ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {errors.editorail?.message || "placeholder"}
                  </p>
                </div>
                <div>
                  <Label
                    htmlFor="category"
                    className="font-medium text-foreground"
                  >
                    Category (Optional)
                  </Label>
                  <Input
                    id="category"
                    {...register("category")}
                    className="mt-1 bg-input/80 text-foreground"
                  />
                  <p
                    className={`text-sm text-destructive min-h-[1.25rem] mt-1 ${
                      errors.category ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {errors.category?.message || "placeholder"}
                  </p>
                </div>
                <div>
                  <Label
                    htmlFor="companyTags"
                    className="font-medium text-foreground"
                  >
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
                            .filter((tag) => tag);
                        }
                        return Array.isArray(value)
                          ? value.filter(
                              (tag) => typeof tag === "string" && tag.trim()
                            )
                          : [];
                      },
                    })}
                    placeholder="e.g. Google, Amazon"
                    className="mt-1 bg-input/80 text-foreground"
                  />
                  <p
                    className={`text-sm text-destructive min-h-[1.25rem] mt-1 ${
                      errors.companyTags ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {errors.companyTags?.message ||
                      errors.companyTags?.root?.message ||
                      "placeholder"}
                  </p>
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
                  <Label
                    htmlFor="isDemo"
                    className="font-medium text-foreground"
                  >
                    Is this a Demo Problem?
                  </Label>
                </div>
                {/* Demo Solution section - apply theme-aware styling */}
                {watch("isDemo") && (
                  <div className="pl-2 border-l-2 border-primary/50 space-y-2">
                    <h4 className="text-md font-semibold text-foreground">
                      Demo Solution Code
                    </h4>
                    {LANGUAGES.map((language) => (
                      <div key={`demo-${language}`}>
                        <Label
                          htmlFor={`demoSolution.${language}`}
                          className="font-medium text-sm text-foreground"
                        >
                          {language}
                        </Label>
                        <Controller
                          name={`demoSolution.${language}`}
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <div className="mt-1 border border-border/50 rounded-md overflow-hidden">
                              <Editor
                                height="150px"
                                language={language.toLowerCase()}
                                theme="vs-dark" // Consider custom theme here later
                                value={field.value}
                                onChange={field.onChange}
                                options={{
                                  minimap: { enabled: false },
                                  fontSize: 12,
                                  automaticLayout: true,
                                  wordWrap: "on",
                                }}
                              />
                            </div>
                          )}
                        />
                        <p
                          className={`text-xs text-destructive min-h-[1.25rem] mt-1 ${
                            errors.demoSolution?.[language]
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        >
                          {errors.demoSolution?.[language]?.message ||
                            "placeholder"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <Separator className="bg-border/50" />

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
                {isSubmitting ? "Updating Problem..." : "Update Problem"}{" "}
                {/* Changed text for edit form */}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditProblemForm;

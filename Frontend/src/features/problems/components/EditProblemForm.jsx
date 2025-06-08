import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { createProblemFormSchema } from "../schemas/Problem.schema.js";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Lucide Icons
import {
  Plus,
  Trash2,
  Code2,
  FileText,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  ClipboardList,
} from "lucide-react";
import Editor from "@monaco-editor/react";

const LANGUAGES = ["JAVASCRIPT", "PYTHON", "JAVA"];

function EditProblemForm() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const {
    problem,
    isProblemLoading,
    error: problemError,
    getProblemById,
    updateProblem: updateProblemAction,
  } = useProblemStore();

  const [activeTab, setActiveTab] = useState("basic-details");

  const [openLanguages, setOpenLanguages] = useState({
    JAVASCRIPT: true,
    PYTHON: false,
    JAVA: false,
  });

  const [openDemoLanguages, setOpenDemoLanguages] = useState({
    JAVASCRIPT: false,
    PYTHON: false,
    JAVA: false,
  });

  const toggleLanguageSection = (lang) => {
    setOpenLanguages((prev) => ({
      ...prev,
      [lang]: !prev[lang],
    }));
  };

  const toggleDemoLanguageSection = (lang) => {
    setOpenDemoLanguages((prev) => ({
      ...prev,
      [lang]: !prev[lang],
    }));
  };

  const {
    register,
    control,
    handleSubmit, // Ensure handleSubmit is destructured
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(createProblemFormSchema),
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
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON: { input: "", output: "", explanation: "" },
        JAVA: { input: "", output: "", explanation: "" },
      },
      codeSnippet: {
        JAVASCRIPT: "function solution(args) {\n // Write your code here\n}",
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
  } = useFieldArray({ control, name: "testcases" });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray({ control, name: "tags" });

  useEffect(() => {
    if (problemId) {
      getProblemById(problemId);
    }
  }, [problemId, getProblemById]);

  useEffect(() => {
    if (problem && problem.id === problemId) {
      reset({
        title: problem.title || "",
        description: problem.description || "",
        difficulty: problem.difficulty || "EASY",
        tags: problem.tags?.length ? problem.tags : [""],
        constraints: problem.constraints || "",
        hints: problem.hints || "",
        editorail: problem.editorail || "",
        category: problem.category || "",
        companyTags: Array.isArray(problem.companyTags)
          ? problem.companyTags.join(", ")
          : problem.companyTags || "",
        testcases: problem.testcases?.length
          ? problem.testcases
          : [{ input: "", output: "" }],

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
        isDemo: typeof problem.isDemo === "boolean" ? problem.isDemo : false,
        demoSolution:
          problem.demoSolution ||
          LANGUAGES.reduce((acc, lang) => ({ ...acc, [lang]: "" }), {}),
      });
    }
  }, [problem, problemId, reset]);

  const onError = (errorsInForm) => {
    console.error("Form validation errors:", errorsInForm);
    toast.error("Please correct the form errors.", {
      description: "Some required fields are missing or invalid.",
    });
  };

  const onSubmit = async (formData) => {
    console.log(
      "onSubmit triggered. isSubmitting:",
      isSubmitting,
      "isValid:",
      isValid
    );

    try {
      const dataToSubmit = {
        ...formData,
        companyTags:
          typeof formData.companyTags === "string"
            ? formData.companyTags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag)
            : Array.isArray(formData.companyTags)
            ? formData.companyTags.filter((tag) => tag)
            : [],
        tags: formData.tags.filter((tag) => tag),
      };

      console.log("Form data sent to updateProblemAction:", dataToSubmit);

      const response = await updateProblemAction(problemId, dataToSubmit);
      toast.success("Problem Updated!", {
        description: response?.message || "Successfully updated the problem.",
      });
      navigate("/problems");
    } catch (error) {
      toast.error("Failed to Update Problem", {
        description: error?.message || "An unknown error occurred.",
      });
      console.error("Error updating problem:", error);
    }
  };

 
  if (problemError) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl text-center text-destructive">
        Error loading problem: {problemError}
      </div>
    );
  }
  if (!problem && !isProblemLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl text-center text-muted-foreground">
        Problem not found. Please check the URL or if the problem exists.
      </div>
    );
  }

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
          <CardTitle className="text-2xl md:text-3xl flex items-center gap-2 text-foreground">
            <FileText className="w-7 h-7 text-primary" />
            Edit Problem: {problem?.title || "Loading..."}{" "}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Modify the details below to update this programming problem.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8 text-foreground">
          <Separator className="bg-border/50" />
          {/* Corrected: Added onSubmit={handleSubmit(onSubmit, onError)} to the form tag */}
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="space-y-6"
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto flex-wrap">
                <TabsTrigger
                  value="basic-details"
                  className="flex items-center gap-2 px-2 py-2"
                >
                  <FileText className="w-4 h-4" /> Basic Details
                </TabsTrigger>
                <TabsTrigger
                  value="testcases-tags"
                  className="flex items-center gap-2 px-2 py-2"
                >
                  <ClipboardList className="w-4 h-4" /> Test Cases & Tags
                </TabsTrigger>
                <TabsTrigger
                  value="code-examples"
                  className="flex items-center gap-2 px-2 py-2"
                >
                  <Code2 className="w-4 h-4" /> Code & Examples
                </TabsTrigger>
                <TabsTrigger
                  value="additional-info"
                  className="flex items-center gap-2 px-2 py-2"
                >
                  <Info className="w-4 h-4" /> Additional Info
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic-details" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
                          <SelectTrigger className="w-full mt-1 bg-input/80 text-foreground">
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
                </div>
                <div className="mt-4">
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
                    className="mt-1 min-h-[120px] bg-input/80 text-foreground"
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
              </TabsContent>

              <TabsContent value="testcases-tags" className="mt-6 space-y-6">
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
                          <Trash2 className="w-4 h-4 text-destructive" />{" "}
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
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                      <CheckCircle2 className="w-5 h-5 text-primary" /> Test
                      Cases
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
                          <h4 className="font-medium">
                            Test Case #{index + 1}
                          </h4>
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
                              className="mt-1 min-h-[60px] bg-input/80 text-foreground"
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
                              className="mt-1 min-h-[60px] bg-input/80 text-foreground"
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
              </TabsContent>

              <TabsContent value="code-examples" className="mt-6 space-y-4">
                {LANGUAGES.map((language) => (
                  <Collapsible
                    key={language}
                    open={openLanguages[language]}
                    onOpenChange={() => toggleLanguageSection(language)}
                    className="space-y-2 border border-border/50 rounded-md bg-card/50 backdrop-blur-sm transition-colors duration-500"
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-3 bg-background/50 cursor-pointer hover:bg-accent/50 rounded-t-md">
                        <h4 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                          <Code2 className="w-5 h-5 text-primary" />{" "}
                          {language.charAt(0) + language.slice(1).toLowerCase()}
                        </h4>
                        {openLanguages[language] ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3 p-3 pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="space-y-4">
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
                          </div>
                          <div className="border border-border/50 p-2 rounded-md bg-background/50">
                            <Label
                              htmlFor={`examples.${language}.output`}
                              className="font-medium text-sm block text-foreground"
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
                          </div>
                          <div className="border border-border/50 p-2 rounded-md bg-background/50">
                            <Label
                              htmlFor={`examples.${language}.explanation`}
                              className="font-medium text-sm block text-foreground"
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
                              {errors.examples?.[language]?.explanation
                                ?.message || "placeholder"}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
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
                                    height="150px"
                                    language={language.toLowerCase()}
                                    theme="vs-dark"
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
                                    height="150px"
                                    language={language.toLowerCase()}
                                    theme="vs-dark"
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
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </TabsContent>

              <TabsContent value="additional-info" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="md:col-span-2">
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
                  <div className="md:col-span-2">
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
                  <div className="md:col-span-2">
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
                  <div className="md:col-span-2">
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
                    {watch("isDemo") && (
                      <div className="pl-2 border-l-2 border-primary/50 space-y-2 mt-4">
                        <h4 className="text-md font-semibold text-foreground">
                          Demo Solution Code
                        </h4>
                        {LANGUAGES.map((language) => (
                          <Collapsible
                            key={`demo-${language}`}
                            open={openDemoLanguages[language]}
                            onOpenChange={() =>
                              toggleDemoLanguageSection(language)
                            }
                            className="space-y-2 border border-border/50 rounded-md bg-card/50 backdrop-blur-sm transition-colors duration-500"
                          >
                            <CollapsibleTrigger asChild>
                              <div className="flex items-center justify-between p-3 bg-background/50 cursor-pointer hover:bg-accent/50 rounded-t-md">
                                <h4 className="text-md font-semibold flex items-center gap-2 text-foreground">
                                  {language}
                                </h4>
                                {openDemoLanguages[language] ? (
                                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-3 p-3 pt-0">
                              <Label
                                htmlFor={`demoSolution.${language}`}
                                className="font-medium text-sm text-foreground"
                              >
                                Demo Solution
                              </Label>
                              <Controller
                                name={`demoSolution.${language}`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                  <div className="mt-1 border border-border/50 rounded-md overflow-hidden">
                                    <Editor
                                      height="100px"
                                      language={language.toLowerCase()}
                                      theme="vs-dark"
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
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

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
              </Button>
            </CardFooter>
          </form>{" "}
          {/* Closing form tag moved here */}
        </CardContent>
      </Card>
    </div>
  );
}

export default EditProblemForm;

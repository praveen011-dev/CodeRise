import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Need Tabs wrapper
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible"; // Need CollapsibleTrigger

// Lucide Icons for visual consistency in skeleton tabs/collapsibles
import {
  FileText,
  ClipboardList,
  Code2,
  Info,
  ChevronDown,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

function EditProblemFormSkeleton() {
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
            <Skeleton className="h-7 w-64 skeleton-shimmer bg-gray-200 dark:bg-muted" />{" "}
            {/* Skeleton for title */}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            <Skeleton className="h-4 w-3/4 skeleton-shimmer bg-gray-200 dark:bg-muted" />{" "}
            {/* Skeleton for description */}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8 text-foreground">
          <Separator className="bg-border/50" />

          {/* Tabs List Skeleton - Wrapped in <Tabs> to satisfy context */}
          <Tabs defaultValue="basic-details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto flex-wrap">
              <TabsTrigger
                value="basic-details"
                disabled
                className="flex items-center gap-2 px-2 py-2"
              >
                <FileText className="w-4 h-4" />{" "}
                <Skeleton className="h-4 w-24 skeleton-shimmer bg-gray-200 dark:bg-muted" />
              </TabsTrigger>
              <TabsTrigger
                value="testcases-tags"
                disabled
                className="flex items-center gap-2 px-2 py-2"
              >
                <ClipboardList className="w-4 h-4" />{" "}
                <Skeleton className="h-4 w-28 skeleton-shimmer bg-gray-200 dark:bg-muted" />
              </TabsTrigger>
              <TabsTrigger
                value="code-examples"
                disabled
                className="flex items-center gap-2 px-2 py-2"
              >
                <Code2 className="w-4 h-4" />{" "}
                <Skeleton className="h-4 w-28 skeleton-shimmer bg-gray-200 dark:bg-muted" />
              </TabsTrigger>
              <TabsTrigger
                value="additional-info"
                disabled
                className="flex items-center gap-2 px-2 py-2"
              >
                <Info className="w-4 h-4" />{" "}
                <Skeleton className="h-4 w-28 skeleton-shimmer bg-gray-200 dark:bg-muted" />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Skeleton Content for the 'Basic Details' tab (as this is likely the default visible tab) */}
          {/* Apply grid layout similar to the actual form */}
          <div className="mt-6">
            {" "}
            {/* Use mt-6 to simulate spacing from tabs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Title Input Skeleton */}
              <div>
                <div className="font-semibold text-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Title
                </div>
                <Skeleton className="h-10 w-full mt-1 skeleton-shimmer bg-gray-200 dark:bg-muted" />
                <Skeleton className="h-4 w-1/2 mt-1 opacity-0" />{" "}
                {/* Placeholder for error message space */}
              </div>
              {/* Difficulty Select Skeleton */}
              <div>
                <div className="font-semibold text-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Difficulty
                </div>
                <Skeleton className="h-10 w-full mt-1 skeleton-shimmer bg-gray-200 dark:bg-muted" />
                <Skeleton className="h-4 w-1/2 mt-1 opacity-0" />
              </div>
              {/* Category Input Skeleton */}
              <div>
                <div className="font-semibold text-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Category (Optional)
                </div>
                <Skeleton className="h-10 w-full mt-1 skeleton-shimmer bg-gray-200 dark:bg-muted" />
                <Skeleton className="h-4 w-1/2 mt-1 opacity-0" />
              </div>
              {/* Company Tags Input Skeleton */}
              <div>
                <div className="font-semibold text-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Company Tags (comma-separated)
                </div>
                <Skeleton className="h-10 w-full mt-1 skeleton-shimmer bg-gray-200 dark:bg-muted" />
                <Skeleton className="h-4 w-1/2 mt-1 opacity-0" />
              </div>
            </div>
            {/* Description Textarea Skeleton (full width) */}
            <div className="mt-4">
              <div className="font-semibold text-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Description (Markdown supported)
              </div>
              <Skeleton className="mt-1 min-h-[120px] w-full skeleton-shimmer bg-gray-200 dark:bg-muted" />
              <Skeleton className="h-4 w-1/2 mt-1 opacity-0" />
            </div>
          </div>

          {/* You can add skeletons for other tabs here if you want them to be visible by default,
              but for minimal initial load, usually only the first tab's content is skeletonized.
              If you want a more complete skeleton for all tabs, uncomment and expand these:
          */}

          {/* Test Cases & Tags Tab Skeleton (Collapsed appearance) */}
          {/*
          <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                      <BookOpen className="w-5 h-5 text-primary" /> Tags
                  </h3>
                  <Skeleton className="h-9 w-24 skeleton-shimmer bg-gray-200 dark:bg-muted" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Skeleton className="h-10 w-full skeleton-shimmer bg-gray-200 dark:bg-muted" />
                  <Skeleton className="h-10 w-full skeleton-shimmer bg-gray-200 dark:bg-muted" />
                  <Skeleton className="h-10 w-full skeleton-shimmer bg-gray-200 dark:bg-muted" />
              </div>
              <Separator className="bg-border/50" />
              <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                      <CheckCircle2 className="w-5 h-5 text-primary" /> Test Cases
                  </h3>
                  <Skeleton className="h-9 w-32 skeleton-shimmer bg-gray-200 dark:bg-muted" />
              </div>
              {[...Array(2)].map((_, i) => ( // Simulate a couple of test case cards
                  <Card key={i} className="p-4 bg-card/50 border border-border/50 backdrop-blur-sm">
                      <div className="flex justify-between items-center mb-2 text-foreground">
                          <h4 className="font-medium"><Skeleton className="h-5 w-24 skeleton-shimmer bg-gray-200 dark:bg-muted" /></h4>
                          <Skeleton className="h-8 w-16 skeleton-shimmer bg-gray-200 dark:bg-muted" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                              <div className="text-foreground text-sm">Input</div>
                              <Skeleton className="min-h-[60px] w-full skeleton-shimmer bg-gray-200 dark:bg-muted" />
                          </div>
                          <div>
                              <div className="text-foreground text-sm">Output</div>
                              <Skeleton className="min-h-[60px] w-full skeleton-shimmer bg-gray-200 dark:bg-muted" />
                          </div>
                      </div>
                  </Card>
              ))}
          </div>
          */}

          {/* Code & Examples Tab Skeleton (Collapsed appearance) */}
          {/*
          <div className="mt-6 space-y-4">
              {[...Array(3)].map((_, i) => ( // For each language
                  <Collapsible key={i} open={false} className="space-y-2 border border-border/50 rounded-md bg-card/50 backdrop-blur-sm">
                      <CollapsibleTrigger asChild>
                          <div className="flex items-center justify-between p-3 bg-background/50 cursor-pointer hover:bg-accent/50 rounded-t-md">
                              <h4 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                                  <Code2 className="w-5 h-5 text-primary" />
                                  <Skeleton className="h-5 w-20 skeleton-shimmer bg-gray-200 dark:bg-muted" />
                              </h4>
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </div>
                      </CollapsibleTrigger>
                  </Collapsible>
              ))}
          </div>
          */}

          {/* Additional Information Tab Skeleton (Collapsed appearance) */}
          {/*
          <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="md:col-span-2">
                      <div className="font-medium text-foreground">Constraints</div>
                      <Skeleton className="min-h-[70px] w-full skeleton-shimmer bg-gray-200 dark:bg-muted" />
                  </div>
                  <div className="md:col-span-2">
                      <div className="font-medium text-foreground">Hints</div>
                      <Skeleton className="min-h-[70px] w-full skeleton-shimmer bg-gray-200 dark:bg-muted" />
                  </div>
                  <div className="md:col-span-2">
                      <div className="font-medium text-foreground">Editorial</div>
                      <Skeleton className="min-h-[100px] w-full skeleton-shimmer bg-gray-200 dark:bg-muted" />
                  </div>
                  <div className="md:col-span-2">
                      <div className="flex items-center space-x-2 pt-2">
                          <Skeleton className="h-4 w-4 rounded-sm skeleton-shimmer bg-gray-200 dark:bg-muted" />
                          <div className="font-medium text-foreground text-sm">Is this a Demo Problem?</div>
                      </div>
                  </div>
              </div>
          </div>
          */}

          <Separator className="bg-border/50" />

          <CardFooter className="pt-6">
            <Skeleton className="h-12 w-48 rounded-md skeleton-shimmer bg-gray-200 dark:bg-muted" />
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditProblemFormSkeleton;

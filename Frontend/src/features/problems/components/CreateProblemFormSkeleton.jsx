import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs component
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FileText, ClipboardList, Code2, Info, ChevronDown } from "lucide-react";


function CreateProblemFormSkeleton() {
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
            <FileText className="w-7 h-7 text-primary" /> Create New Problem
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            <Skeleton className="h-4 w-3/4 skeleton-shimmer bg-gray-200 dark:bg-muted" />
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8 text-foreground">
          {/* Sample Data Buttons Skeleton */}
          <div className="flex flex-col sm:flex-row gap-3 items-start mb-6">
            <div className="flex border border-border rounded-md overflow-hidden">
              <Skeleton className="h-10 w-28 rounded-r-none skeleton-shimmer bg-gray-200 dark:bg-muted" />
              <Skeleton className="h-10 w-28 rounded-l-none skeleton-shimmer bg-gray-200 dark:bg-muted" />
            </div>
            <Skeleton className="h-10 w-32 skeleton-shimmer bg-gray-200 dark:bg-muted" />
          </div>

          <Separator className="bg-border/50" />

          {/* Tabs List Skeleton - Now wrapped in <Tabs> */}
          <Tabs defaultValue="basic-details" className="w-full"> {/* Added <Tabs> wrapper */}
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto flex-wrap">
              <TabsTrigger value="basic-details" disabled className="flex items-center gap-2 px-2 py-2">
                <FileText className="w-4 h-4" /> <Skeleton className="h-4 w-24 skeleton-shimmer bg-gray-200 dark:bg-muted" />
              </TabsTrigger>
              <TabsTrigger value="testcases-tags" disabled className="flex items-center gap-2 px-2 py-2">
                <ClipboardList className="w-4 h-4" /> <Skeleton className="h-4 w-28 skeleton-shimmer bg-gray-200 dark:bg-muted" />
              </TabsTrigger>
              <TabsTrigger value="code-examples" disabled className="flex items-center gap-2 px-2 py-2">
                <Code2 className="w-4 h-4" /> <Skeleton className="h-4 w-28 skeleton-shimmer bg-gray-200 dark:bg-muted" />
              </TabsTrigger>
              <TabsTrigger value="additional-info" disabled className="flex items-center gap-2 px-2 py-2">
                <Info className="w-4 h-4" /> <Skeleton className="h-4 w-28 skeleton-shimmer bg-gray-200 dark:bg-muted" />
              </TabsTrigger>
            </TabsList>
          </Tabs> {/* Closing <Tabs> tag */}


          {/* Skeleton Content for the active tab (e.g., Basic Details) */}
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Title */}
              <div>
                {/* Replaced <Label> with <div> with similar styling */}
                <div className="font-semibold text-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Title</div> 
                <Skeleton className="h-10 w-full mt-1 skeleton-shimmer bg-gray-200 dark:bg-muted" />
                <Skeleton className="h-4 w-1/2 mt-1 opacity-0" /> {/* Placeholder for error message space */}
              </div>
              {/* Difficulty */}
              <div>
                {/* Replaced <Label> with <div> with similar styling */}
                <div className="font-semibold text-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Difficulty</div>
                <Skeleton className="h-10 w-full mt-1 skeleton-shimmer bg-gray-200 dark:bg-muted" />
                <Skeleton className="h-4 w-1/2 mt-1 opacity-0" />
              </div>
              {/* Category */}
              <div>
                {/* Replaced <Label> with <div> with similar styling */}
                <div className="font-semibold text-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Category (Optional)</div>
                <Skeleton className="h-10 w-full mt-1 skeleton-shimmer bg-gray-200 dark:bg-muted" />
                <Skeleton className="h-4 w-1/2 mt-1 opacity-0" />
              </div>
              {/* Company Tags */}
              <div>
                {/* Replaced <Label> with <div> with similar styling */}
                <div className="font-semibold text-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Company Tags (comma-separated)</div>
                <Skeleton className="h-10 w-full mt-1 skeleton-shimmer bg-gray-200 dark:bg-muted" />
                <Skeleton className="h-4 w-1/2 mt-1 opacity-0" />
              </div>
            </div>
            {/* Description spans full width */}
            <div className="mt-4">
              {/* Replaced <Label> with <div> with similar styling */}
              <div className="font-semibold text-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Description (Markdown supported)</div>
              <Skeleton className="mt-1 min-h-[120px] w-full skeleton-shimmer bg-gray-200 dark:bg-muted" />
              <Skeleton className="h-4 w-1/2 mt-1 opacity-0" />
            </div>
          </div>
          {/* Note: Other tab contents are omitted for brevity in skeleton,
              but you can extend this pattern for Test Cases, Code & Examples,
              and Additional Info if you want more detailed skeletons for each tab.
              For Test Cases, you'd loop a few skeleton cards.
              For Code/Editors, you'd use CollapsibleSkeleton (a simple div with same styling)
              to mimic the collapsed state, and a Skeleton block inside for the editor area.
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

export default CreateProblemFormSkeleton;

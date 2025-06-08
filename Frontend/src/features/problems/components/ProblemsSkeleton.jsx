import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProblemsSkeleton = () => {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-4">
      {/* Header Skeleton */}
      <Skeleton className="h-8 w-40 skelton-shimmer" />{" "}
      {/* Added skelton-shimmer */}
      {/* Filters/Controls */}
      <div className="p-4 rounded-md border bg-card/70 border-border/50 backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 w-full md:w-1/3 skelton-shimmer" />{" "}
          {/* Added skelton-shimmer */}
          <Skeleton className="h-10 w-full md:w-1/4 skelton-shimmer" />{" "}
          {/* Added skelton-shimmer */}
          <Skeleton className="h-10 w-full md:w-1/4 skelton-shimmer" />{" "}
          {/* Added skelton-shimmer */}
        </div>
      </div>
      {/* Problems Table Skeleton */}
      <div className="rounded-md border bg-card/70 border-border/50 backdrop-blur-md">
        <div className="overflow-x-auto p-4 space-y-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between space-x-4"
            >
              <Skeleton className="h-5 w-6 hidden sm:block skelton-shimmer" />{" "}
              {/* Added skelton-shimmer */}
              <Skeleton className="h-5 w-1/4 skelton-shimmer" />{" "}
              {/* Added skelton-shimmer */}
              <Skeleton className="h-5 w-1/3 hidden lg:block skelton-shimmer" />{" "}
              {/* Added skelton-shimmer */}
              <Skeleton className="h-8 w-28 skelton-shimmer" />{" "}
              {/* Added skelton-shimmer */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProblemsSkeleton;

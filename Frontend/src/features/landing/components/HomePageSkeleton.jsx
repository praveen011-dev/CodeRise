import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

function HomePageSkeleton() {
  return (
    <section className="relative py-15 overflow-hidden">
      {/* AI Quote Rotator Skeleton */}
      <div className="mt-6 mb-4 text-center">
        <Skeleton
          className="h-6 w-64 mx-auto skeleton-shimmer
                     bg-gray-200 dark:bg-muted" // Explicit background for light mode
        />
      </div>

      {/* Main Content Skeleton (mirroring HeroSection's structure) */}
      <div className="mx-auto w-[90%] md:w-[70%] max-w-6xl text-center px-4 relative hero-hexagon">
        {/* Title Skeleton */}
        <div className="space-y-4 mb-6">
          {/* Two lines for the main title */}
          <Skeleton
            className="h-10 md:h-12 w-3/4 mx-auto skeleton-shimmer
                       bg-gray-200 dark:bg-muted" // Explicit background for light mode
          />
          <Skeleton
            className="h-10 md:h-12 w-[60%] mx-auto skeleton-shimmer
                       bg-gray-200 dark:bg-muted" // Explicit background for light mode
          />
        </div>

        {/* Paragraph Skeleton */}
        <div className="space-y-2 max-w-2xl mx-auto mb-10">
          {/* Multiple lines for the paragraph */}
          <Skeleton
            className="h-4 w-[90%] mx-auto skeleton-shimmer
                       bg-gray-200 dark:bg-muted" // Explicit background for light mode
          />
          <Skeleton
            className="h-4 w-[85%] mx-auto skeleton-shimmer
                       bg-gray-200 dark:bg-muted" // Explicit background for light mode
          />
          <Skeleton
            className="h-4 w-[70%] mx-auto skeleton-shimmer
                       bg-gray-200 dark:bg-muted" // Explicit background for light mode
          />
        </div>

        {/* Buttons Skeleton */}
        <div className="flex justify-center gap-4">
          <Skeleton
            className="h-10 w-40 rounded-md skeleton-shimmer
                       bg-gray-200 dark:bg-muted" // Explicit background for light mode
          />
          <Skeleton
            className="h-10 w-40 rounded-md skeleton-shimmer
                       bg-gray-200 dark:bg-muted" // Explicit background for light mode
          />
        </div>
      </div>
    </section>
  );
}

export default HomePageSkeleton;

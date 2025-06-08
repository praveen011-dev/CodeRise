import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Only need AvatarFallback for skeleton
import { TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs"; // Only need Trigger and List for skeleton tabs
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Lucide Icons for visual consistency
import { User, Code, Check, List, CalendarDays } from "lucide-react";

function ProfilePageSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* Page Title Skeleton */}
      <Skeleton className="h-8 w-48 mb-6 skeleton-shimmer bg-gray-200 dark:bg-muted" />

      <div className="flex flex-col lg:flex-row gap-8">
        {" "}
        {/* Changed to flex-col on small, row on large */}
        {/* Left Section (User Info Card) Skeleton */}
        <Card
          className="
            w-full lg:w-1/2 mb-8 shadow-xl relative z-10
            bg-card/70 border border-border/50
            backdrop-blur-md transition-colors duration-500
          "
        >
          <CardContent className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6 text-foreground">
            {/* Avatar Skeleton */}
            <Avatar className="w-28 h-28 md:w-32 md:h-32 border-2 border-primary">
              <AvatarFallback className="bg-muted/50 text-muted-foreground">
                <User className="w-16 h-16 text-muted-foreground/50" />{" "}
                {/* Placeholder icon */}
              </AvatarFallback>
            </Avatar>
            {/* User Info Text Skeletons */}
            <div className="flex-grow text-center md:text-left space-y-2">
              <Skeleton className="h-7 w-48 skeleton-shimmer bg-gray-200 dark:bg-muted" />{" "}
              {/* Username */}
              <Skeleton className="h-5 w-56 skeleton-shimmer bg-gray-200 dark:bg-muted" />{" "}
              {/* Email */}
              <Skeleton className="h-6 w-24 rounded-full skeleton-shimmer bg-gray-200 dark:bg-muted" />{" "}
              {/* Role Badge */}
              <Skeleton className="h-4 w-40 skeleton-shimmer bg-gray-200 dark:bg-muted" />{" "}
              {/* Member Since */}
            </div>
          </CardContent>
        </Card>
        {/* Right Section (Rotating Quote Card) Skeleton */}
        <Card
          className="
            w-full lg:w-1/2 mb-8 shadow-xl relative z-10
            bg-card/70 border border-border/50
            backdrop-blur-md transition-colors duration-500
          "
        >
          <CardContent className="p-6 flex flex-col items-center justify-center text-foreground text-center gap-4 h-full w-full">
            <Skeleton className="h-7 w-3/4 mx-auto skeleton-shimmer bg-gray-200 dark:bg-muted" />
            <Skeleton className="h-7 w-2/3 mx-auto skeleton-shimmer bg-gray-200 dark:bg-muted" />
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Section Skeleton */}
      <Tabs defaultValue="submissions" className="w-full">
        <TabsList
          className="
            grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
            bg-muted/50 border border-border/50
            backdrop-blur-sm transition-colors duration-500
          "
        >
          <TabsTrigger
            value="submissions"
            disabled
            className="data-[state=active]:bg-background/70 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <Code className="mr-2 h-4 w-4" />{" "}
            <Skeleton className="h-4 w-24 skeleton-shimmer bg-gray-200 dark:bg-muted" />
          </TabsTrigger>
          <TabsTrigger
            value="problems-solved"
            disabled
            className="data-[state=active]:bg-background/70 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <Check className="mr-2 h-4 w-4" />{" "}
            <Skeleton className="h-4 w-20 skeleton-shimmer bg-gray-200 dark:bg-muted" />
          </TabsTrigger>
          <TabsTrigger
            value="playlists"
            disabled
            className="data-[state=active]:bg-background/70 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <List className="mr-2 h-4 w-4" />{" "}
            <Skeleton className="h-4 w-20 skeleton-shimmer bg-gray-200 dark:bg-muted" />
          </TabsTrigger>
          <TabsTrigger
            value="contributions"
            disabled
            className="data-[state=active]:bg-background/70 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <CalendarDays className="mr-2 h-4 w-4" />{" "}
            <Skeleton className="h-4 w-28 skeleton-shimmer bg-gray-200 dark:bg-muted" />
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main Content Area for Tabs (lg:col-span-2) */}
          <div className="lg:col-span-2">
            {/* Example: Submissions Tab Content Skeleton */}
            <Card
              className="
                shadow-xl relative z-10 h-full
                bg-card/70 border border-border/50
                backdrop-blur-md transition-colors duration-500
              "
            >
              <CardHeader>
                <CardTitle className="text-foreground">
                  <Skeleton className="h-6 w-48 skeleton-shimmer bg-gray-200 dark:bg-muted" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50">
                        <TableHead>
                          <Skeleton className="h-4 w-20 skeleton-shimmer bg-gray-200 dark:bg-muted" />
                        </TableHead>
                        <TableHead>
                          <Skeleton className="h-4 w-16 skeleton-shimmer bg-gray-200 dark:bg-muted" />
                        </TableHead>
                        <TableHead>
                          <Skeleton className="h-4 w-16 skeleton-shimmer bg-gray-200 dark:bg-muted" />
                        </TableHead>
                        <TableHead>
                          <Skeleton className="h-4 w-24 skeleton-shimmer bg-gray-200 dark:bg-muted" />
                        </TableHead>
                        <TableHead>
                          <Skeleton className="h-4 w-12 skeleton-shimmer bg-gray-200 dark:bg-muted" />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...Array(5)].map((_, i) => (
                        <TableRow key={i} className="border-border/50">
                          <TableCell>
                            <Skeleton className="h-4 w-32 skeleton-shimmer bg-gray-200 dark:bg-muted" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-16 skeleton-shimmer bg-gray-200 dark:bg-muted" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-12 rounded-full skeleton-shimmer bg-gray-200 dark:bg-muted" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-20 skeleton-shimmer bg-gray-200 dark:bg-muted" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-8 w-8 rounded-full skeleton-shimmer bg-gray-200 dark:bg-muted" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column for Overview Charts (lg:col-span-1) */}
          <div className="lg:col-span-1">
            <Card
              className="
                shadow-xl relative z-10 h-full
                bg-card/70 border border-border/50
                backdrop-blur-md transition-colors duration-500
              "
            >
              <CardHeader>
                <CardTitle className="text-foreground">
                  <Skeleton className="h-6 w-3/4 skeleton-shimmer bg-gray-200 dark:bg-muted" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-4 h-[calc(100%-4rem)]">
                {/* Placeholder for Pie Chart */}
                <Skeleton className="h-48 w-48 rounded-full skeleton-shimmer bg-gray-200 dark:bg-muted mb-4" />
                {/* Text Summary Skeletons */}
                <Skeleton className="h-4 w-2/3 skeleton-shimmer bg-gray-200 dark:bg-muted mb-2" />
                <Skeleton className="h-4 w-1/2 skeleton-shimmer bg-gray-200 dark:bg-muted" />
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export default ProfilePageSkeleton;

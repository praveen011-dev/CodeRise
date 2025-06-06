import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProblemStore } from "../../../store/useProblemStore";
import useAuthStore from "../../../store/authStore";
import CreatePlaylistDialog from "../../playlists/components/CreatePlaylistDialog";
import AddToPlaylistDialog from "../../playlists/components/AddToPlaylistDialog";

// Shadcn/UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // CardHeader might not be used but kept for completeness
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Lucide Icons
import { Edit3, Trash2, ListPlus, PlusCircle, Search } from "lucide-react";
import { toast } from "sonner";

function AllProblems() {
  const {
    getAllProblems,
    problems,
    isProblemsLoading,
    error: problemsError,
    solvedProblems,
  } = useProblemStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");

  const [isAddToPlaylistDialogOpen, setIsAddToPlaylistDialogOpen] =
    useState(false);
  const [selectedProblemForPlaylist, setSelectedProblemForPlaylist] =
    useState(null);

  const openAddToPlaylistDialog = (problem) => {
    setSelectedProblemForPlaylist(problem);
    setIsAddToPlaylistDialogOpen(true);
  };

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems, user]);

  const handleEditProblem = (problemId) => {
    toast.info(`Edit action for problem ID: ${problemId}`, {
      description: "This functionality is not yet implemented.",
    });
  };

  const handleDeleteProblem = (problemId) => {
    toast("Delete Problem?", {
      description: `Are you sure you want to delete problem ID: ${problemId}?`,
      action: {
        label: "Delete",
        onClick: () => console.log("Confirmed delete:", problemId),
      },
      cancel: { label: "Cancel", onClick: () => toast.dismiss() },
    });
  };

  const handleSaveToPlaylist = (problemId) => {
    toast.info(`Save to playlist for problem ID: ${problemId}`, {
      description: "This functionality is not yet implemented.",
    });
  };

  const filteredAndSortedProblems = useMemo(() => {
    return problems
      .filter((p) => p.title?.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(
        (p) =>
          difficultyFilter === "All" ||
          p.difficulty?.toUpperCase() === difficultyFilter
      )
      .filter((p) => {
        if (tagFilter === "All") return true;
        return p.tags
          ?.map((tag) => tag.toLowerCase())
          .includes(tagFilter.toLowerCase());
      });
  }, [problems, searchTerm, difficultyFilter, tagFilter]);

  const solvedProblemIds = useMemo(() => {
    return new Set(solvedProblems?.map((p) => p.id));
  }, [solvedProblems]);

  const allUniqueTags = useMemo(() => {
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((tag) => tagsSet.add(tag)));
    return ["All", ...Array.from(tagsSet).sort()];
  }, [problems]);

  if (isProblemsLoading && problems.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center text-lg text-foreground">
        Loading problems...
      </div>
    );
  }
  if (problemsError) {
    return (
      <div className="container mx-auto p-8 text-center text-red-500 text-lg text-destructive">
        Error loading problems: {problemsError}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {/* Adjusted header text color */}
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Problem Set
        </h1>
        {user?.role === "ADMIN" && (
          <Button
            onClick={() => navigate("/admin/add-problem")}
            className="gap-2 w-full sm:w-auto"
          >
            <PlusCircle size={18} /> Add New Problem
          </Button>
        )}

        <CreatePlaylistDialog
          onPlaylistCreated={(newPlaylist) => {
            console.log("Playlist created from ProblemListPage:", newPlaylist);
          }}
        />
      </div>

      {/* SEARCH/FILTER CARD - APPLYING NEW STYLES HERE */}
      <Card
        className="
          mb-6 shadow-xl relative z-10
          bg-card/70 border border-border/50
          backdrop-blur-md transition-colors duration-500
        "
      >
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-grow w-full md:max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by problem title..."
              // Adjusted Input background and text color
              className="pl-8 w-full bg-input/80 text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Adjusted Select background and text color */}
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-input/80 text-foreground">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Difficulties</SelectItem>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>
          {/* Adjusted Select background and text color */}
          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-input/80 text-foreground">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              {allUniqueTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* PROBLEMS TABLE CARD - APPLYING NEW STYLES HERE */}
      <Card
        className="
          shadow-xl relative z-10
          bg-card/70 border border-border/50
          backdrop-blur-md transition-colors duration-500
        "
      >
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {/* Adjusted TableRow border */}
                <TableRow className="border-border/50">
                  <TableHead className="w-[60px] px-3 hidden sm:table-cell text-foreground/80">
                    Solved
                  </TableHead>
                  <TableHead className="px-3 text-foreground/80">
                    Title
                  </TableHead>
                  <TableHead className="px-3 hidden lg:table-cell text-foreground/80">
                    Tags
                  </TableHead>
                  <TableHead className="px-3 text-foreground/80">
                    Difficulty
                  </TableHead>
                  <TableHead className="text-right px-3 text-foreground/80">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedProblems.length > 0 ? (
                  filteredAndSortedProblems.map((problem) => (
                    <TableRow
                      key={problem.id}
                      // Adjusted TableRow border and hover
                      className="border-border/50 hover:bg-accent/30"
                    >
                      <TableCell className="px-3 hidden sm:table-cell text-foreground">
                        <Checkbox
                          id={`solved-${problem.id}`}
                          checked={solvedProblemIds.has(problem.id)}
                          aria-label={`Mark ${problem.title} as solved`}
                        />
                      </TableCell>
                      <TableCell className="font-medium px-3 max-w-[200px] sm:max-w-xs truncate">
                        <Link
                          to={`/problems/${problem.id}`}
                          // Adjusted link color for theme
                          className="hover:underline text-primary"
                          title={problem.title}
                        >
                          <div className="flex items-center gap-2">
                            {problem.title || "Untitled Problem"}
                            {problem.isDemo && (
                              <Badge
                                variant="outline"
                                // Adjusted Badge colors for theme blending
                                className="bg-blue-100/80 text-blue-700/80 border-blue-200/80 dark:bg-blue-900/80 dark:text-blue-300/80 dark:border-blue-700/80 text-[0.6rem] px-1 py-0.5"
                              >
                                DEMO
                              </Badge>
                            )}
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="px-3 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1.5">
                          {problem.tags?.slice(0, 3).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs" // Secondary variant should handle theme colors already
                            >
                              {tag}
                            </Badge>
                          ))}
                          {problem.companyTags
                            ?.slice(0, 2)
                            .map((tag, index) => (
                              <Badge
                                key={`company-${index}`}
                                variant="outline"
                                // Adjusted Badge colors for theme blending
                                className="text-xs border-blue-500/50 text-blue-600/80 dark:border-blue-400/50 dark:text-blue-400/80"
                              >
                                {tag}
                              </Badge>
                            ))}
                        </div>
                      </TableCell>
                      <TableCell className="px-3">
                        <Badge
                          variant={
                            problem.difficulty === "EASY"
                              ? "default"
                              : problem.difficulty === "MEDIUM"
                              ? "secondary"
                              : problem.difficulty === "HARD"
                              ? "destructive"
                              : "outline"
                          }
                          // Adjusted Badge colors for theme blending
                          className={
                            problem.difficulty === "EASY"
                              ? "bg-green-100/80 text-green-700/80 border-green-200/80 dark:bg-green-900/80 dark:text-green-300/80 dark:border-green-700/80"
                              : problem.difficulty === "MEDIUM"
                              ? "bg-yellow-100/80 text-yellow-700/80 border-yellow-200/80 dark:bg-yellow-900/80 dark:text-yellow-300/80 dark:border-yellow-700/80"
                              : problem.difficulty === "HARD"
                              ? "bg-red-100/80 text-red-700/80 border-red-200/80 dark:bg-red-900/80 dark:text-red-300/80 dark:border-red-700/80"
                              : "dark:border-slate-600/80" // Fallback for unknown difficulty
                          }
                        >
                          {problem.difficulty || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-3">
                        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs h-8"
                            title="Save to Playlist"
                            onClick={() => openAddToPlaylistDialog(problem)}
                          >
                            <ListPlus size={14} />
                            <span className="hidden sm:inline">
                              Save to Playlist
                            </span>
                            <span className="sm:hidden">Save</span>
                          </Button>
                          {user?.role === "ADMIN" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEditProblem(problem.id)}
                                title="Edit Problem"
                              >
                                {/* Adjusted icon colors for theme */}
                                <Edit3 className="h-4 w-4 text-yellow-600/80 dark:text-yellow-500/80" />
                                <span className="sr-only">Edit Problem</span>
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDeleteProblem(problem.id)}
                                title="Delete Problem"
                              >
                                {/* Adjusted icon colors for theme */}
                                <Trash2 className="h-4 w-4 text-red-600/80 dark:text-red-500/80" />
                                <span className="sr-only">Delete Problem</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center h-24 text-muted-foreground"
                    >
                      No problems found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {selectedProblemForPlaylist && (
        <AddToPlaylistDialog
          problemId={selectedProblemForPlaylist.id}
          problemTitle={selectedProblemForPlaylist.title}
          isOpen={isAddToPlaylistDialogOpen}
          setIsOpen={setIsAddToPlaylistDialogOpen}
          onPlaylistCreated={(newPlaylistWithProblem) => {
            console.log(
              "Playlist action completed via dialog:",
              newPlaylistWithProblem
            );
          }}
        />
      )}
    </div>
  );
}

export default AllProblems;

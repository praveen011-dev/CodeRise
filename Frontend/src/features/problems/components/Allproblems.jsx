import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProblemStore } from "../../../store/useProblemStore"; // Adjust path if needed
import useAuthStore from "../../../store/authStore"; // Adjust path if needed
import CreatePlaylistDialog from "../../playlists/components/CreatePlaylistDialog";
import AddToPlaylistDialog from "../../playlists/components/AddToPlaylistDialog";

// Shadcn/UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

  // Add state to control the dialog for adding to playlist
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

  // Placeholder Action Handlers
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
      .filter(
        (p) => p.title?.toLowerCase().includes(searchTerm.toLowerCase()) // Added optional chaining for title
      )
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
      <div className="container mx-auto p-8 text-center text-lg">
        Loading problems...
      </div>
    );
  }
  if (problemsError) {
    return (
      <div className="container mx-auto p-8 text-center text-red-500 text-lg">
        Error loading problems: {problemsError}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
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

        {/* create playlist dialog */}
        <CreatePlaylistDialog
          onPlaylistCreated={(newPlaylist) => {
            // This is an optional callback if you want to do something after a playlist is created,
            // like refresh a list of playlists if you display one on this page.
            console.log("Playlist created from ProblemListPage:", newPlaylist);
            // toast.success(`Playlist "${newPlaylist.name}" created!`);
            // Example: maybe refetch user's playlists if you have a store for that
            // useUserPlaylistsStore.getState().fetchPlaylists();
          }}
        />
      </div>

      <Card className="mb-6 shadow-sm dark:bg-slate-800">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-grow w-full md:max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by problem title..."
              className="pl-8 w-full bg-white dark:bg-slate-700 dark:text-slate-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-slate-700 dark:text-slate-50">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Difficulties</SelectItem>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-slate-700 dark:text-slate-50">
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

      {/* Problems Table Card */}
      <Card className="shadow-sm dark:bg-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="dark:border-slate-700">
                  <TableHead className="w-[60px] px-3 hidden sm:table-cell">
                    Solved
                  </TableHead>
                  <TableHead className="px-3">Title</TableHead>
                  <TableHead className="px-3 hidden lg:table-cell">
                    Tags
                  </TableHead>
                  <TableHead className="px-3">Difficulty</TableHead>
                  <TableHead className="text-right px-3">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedProblems.length > 0 ? (
                  filteredAndSortedProblems.map((problem) => (
                    <TableRow
                      key={problem.id}
                      className="dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50"
                    >
                      <TableCell className="px-3 hidden sm:table-cell">
                        <Checkbox
                          id={`solved-${problem.id}`}
                          checked={solvedProblemIds.has(problem.id)}
                          aria-label={`Mark ${problem.title} as solved`}
                        />
                      </TableCell>
                      <TableCell className="font-medium px-3 max-w-[200px] sm:max-w-xs truncate">
                        <Link
                          to={`/problems/${problem.id}`}
                          className="hover:underline text-blue-600 dark:text-blue-400"
                          title={problem.title}
                        >
                          <div className="flex items-center gap-2">
                            {" "}
                            {/* Added flex container */}
                            {problem.title || "Untitled Problem"}
                            {problem.isDemo && (
                              <Badge
                                variant="outline" // Use outline variant from Shadcn
                                className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700 text-[0.6rem] px-1 py-0.5"
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
                              className="text-xs"
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
                                className="text-xs border-blue-500/50 text-blue-600 dark:border-blue-400/50 dark:text-blue-400"
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
                          className={
                            problem.difficulty === "EASY"
                              ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700"
                              : problem.difficulty === "MEDIUM"
                              ? "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700"
                              : problem.difficulty === "HARD"
                              ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700"
                              : "dark:border-slate-600"
                          }
                        >
                          {problem.difficulty || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-3">
                        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                          {" "}
                          {/* Adjusted spacing */}
                          {/* "Save to Playlist" Button - Triggers the dialog */}
                          {/* The AddToPlaylistDialog component itself will be rendered elsewhere, controlled by state */}
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
                          {/* "Edit" and "Delete" Buttons - Conditionally rendered for ADMIN */}
                          {user?.role === "ADMIN" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEditProblem(problem.id)}
                                title="Edit Problem"
                              >
                                <Edit3 className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                                <span className="sr-only">Edit Problem</span>
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDeleteProblem(problem.id)}
                                title="Delete Problem"
                              >
                                <Trash2 className="h-4 w-4 text-red-600 dark:text-red-500" />
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
                      className="text-center h-24 text-slate-500 dark:text-slate-400"
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
      {/* --- RENDER AddToPlaylistDialog CONDITIONALLY --- */}
      {selectedProblemForPlaylist && (
        <AddToPlaylistDialog
          problemId={selectedProblemForPlaylist.id}
          problemTitle={selectedProblemForPlaylist.title}
          isOpen={isAddToPlaylistDialogOpen}
          setIsOpen={setIsAddToPlaylistDialogOpen} // Pass the setter to control visibility
          onPlaylistCreated={(newPlaylistWithProblem) => {
            // Optional callback
            console.log(
              "Playlist action completed via dialog:",
              newPlaylistWithProblem
            );
            // Potentially refresh global playlist state if needed
            // useUserPlaylistsStore.getState().getUserPlaylists();
          }}
        />
      )}
    </div>
  );
}

export default AllProblems;

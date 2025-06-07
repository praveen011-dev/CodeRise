import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import {
  updateProfilePictureService,
  fetchUserSolvedProblemsCount,
  fetchTotalProblemsCount,
  fetchUserSubmissionsCount,
  fetchUserPlaylistsCount,
  fetchUserContributions,
  fetchUserSubmissionsList,
  fetchUserSolvedProblemsList,
  fetchUserPlaylistsList,
} from "@/services/authService";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Lucide Icons
import {
  ChevronDown,
  ChevronUp,
  CalendarDays,
  Code,
  List,
  User,
  Check,
} from "lucide-react";
import { toast } from "sonner";

// For Contribution Graph
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip as ReactTooltip } from "react-tooltip";

// For Recharts Pie Chart
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";

// For Syntax Highlighting
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import java from "react-syntax-highlighter/dist/esm/languages/hljs/java";
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("java", java);

function ProfilePage() {
  const { user, updateUserProfile } = useAuthStore();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stats
  const [submissionsCount, setSubmissionsCount] = useState(0);
  const [playlistsCount, setPlaylistsCount] = useState(0);
  const [solvedProblemsCount, setSolvedProblemsCount] = useState(0);
  const [totalProblemsCount, setTotalProblemsCount] = useState(0);
  const [contributionData, setContributionData] = useState([]);

  // Detailed Lists
  const [submissionsList, setSubmissionsList] = useState({
    total: 0,
    accepted: 0,
    wrongAnswer: 0,
    list: [],
  });
  const [solvedProblemsList, setSolvedProblemsList] = useState([]);
  const [playlistsList, setPlaylistsList] = useState([]);

  const [expandedSubmissionId, setExpandedSubmissionId] = useState(null);
  const [activeTabOverview, setActiveTabOverview] = useState("submissions");

  const toggleCodeVisibility = (submissionId) => {
    setExpandedSubmissionId((prevId) =>
      prevId === submissionId ? null : submissionId
    );
  };

  const mapLanguageToHljs = (lang) => {
    switch (lang.toLowerCase()) {
      case "javascript":
      case "js":
        return "javascript";
      case "python":
      case "py":
        return "python";
      case "java":
        return "java";
      default:
        return "plaintext";
    }
  };

  useEffect(() => {
    const fetchAllProfileData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const results = await Promise.allSettled([
          fetchUserSolvedProblemsCount(user.id),
          fetchTotalProblemsCount(),
          fetchUserSubmissionsCount(user.id),
          fetchUserPlaylistsCount(user.id),
          fetchUserContributions(user.id),
          fetchUserSubmissionsList(user.id),
          fetchUserSolvedProblemsList(user.id),
          fetchUserPlaylistsList(user.id),
        ]);

        const [
          solvedCountRes,
          totalProblemsCountRes,
          submissionsCountRes,
          playlistsCountRes,
          contributionsRes,
          submissionsListRes,
          solvedProblemsListRes,
          playlistsListRes,
        ] = results.map((result) =>
          result.status === "fulfilled" ? result.value : null
        );

        setSolvedProblemsCount(solvedCountRes?.count || 0);
        setTotalProblemsCount(totalProblemsCountRes?.count || 0);
        setSubmissionsCount(submissionsCountRes?.count || 0);
        setPlaylistsCount(playlistsCountRes?.count || 0);
        setContributionData(contributionsRes || []);

        setSubmissionsList(
          submissionsListRes || {
            total: 0,
            accepted: 0,
            wrongAnswer: 0,
            list: [],
          }
        );
        setSolvedProblemsList(solvedProblemsListRes || []);
        setPlaylistsList(playlistsListRes || []);

        const hasError = results.some((result) => result.status === "rejected");
        if (hasError) {
          console.error(
            "Some profile data fetches failed:",
            results.filter((r) => r.status === "rejected")
          );
          setError("Failed to load some profile data. Please try again.");
          toast.error("Failed to load some profile data.");
        } else {
          setError(null);
        }
      } catch (err) {
        console.error("Critical error fetching all profile data:", err);
        setError("Failed to load profile data due to a critical error.");
        toast.error("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllProfileData();
  }, [user?.id]);

  const getAvatarContent = () => {
    if (user?.image) {
      return (
        <AvatarImage src={user.image} alt={`${user.username}'s profile`} />
      );
    } else if (user?.username) {
      const nameParts = user.username.split(" ");
      let initials = "";
      if (nameParts.length > 0) {
        initials += nameParts[0][0];
        if (nameParts.length > 1) {
          initials += nameParts[nameParts.length - 1][0];
        }
      }
      return <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>;
    }
    return <AvatarFallback>NR</AvatarFallback>;
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (e.g., JPEG, PNG, GIF).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit. Max 5MB allowed.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const updatedUserData = await updateProfilePictureService(formData);
      toast.success("Profile picture updated successfully!");
      updateUserProfile({
        image: updatedUserData.image,
      });
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      toast.error(err.message || "Failed to upload profile picture.");
      setError(err.message);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Data for Solved Problems Pie Chart
  const solvedChartData = useMemo(() => {
    const unsolvedCount = totalProblemsCount - solvedProblemsCount;
    return [
      {
        name: "Solved",
        value: solvedProblemsCount,
        color: "hsl(142.1 76.2% 36.3%)", // Green for solved
      },
      {
        name: "Unsolved",
        value: unsolvedCount >= 0 ? unsolvedCount : 0,
        color: "var(--chart-inactive-slice)",
      },
    ];
  }, [solvedProblemsCount, totalProblemsCount]);

  // Data for Playlists Pie Chart
  const playlistChartData = useMemo(() => {
    return [
      {
        name: "Playlists",
        value: playlistsCount,
        color: "hsl(262.1 83.3% 57.8%)",
      },
      {
        name: "Remaining",
        value: Math.max(0, 5 - playlistsCount), // max of 5 playlists
        color: "var(--chart-inactive-slice)",
      },
    ];
  }, [playlistsCount]);

  // Data for Submissions Pie Chart
  const submissionChartData = useMemo(() => {
    const accepted = submissionsList.accepted || 0;
    const wrongAnswer = submissionsList.wrongAnswer || 0;
    const total = submissionsList.total || 0;
    const otherErrors = total - (accepted + wrongAnswer);

    const data = [];
    if (accepted > 0)
      data.push({
        name: "Accepted",
        value: accepted,
        color: "hsl(142.1 76.2% 36.3%)",
      }); // Green
    if (wrongAnswer > 0)
      data.push({
        name: "Wrong Answer",
        value: wrongAnswer,
        color: "hsl(0 84.2% 60.2%)",
      }); // Red
    if (otherErrors > 0)
      data.push({
        name: "Other",
        value: otherErrors,
        color: "var(--chart-inactive-slice)",
      });
    if (data.length === 0 && total === 0) {
      data.push({
        name: "No Submissions",
        value: 1,
        color: "var(--chart-inactive-slice)",
      });
    } else if (data.length === 0 && total > 0) {
      data.push({
        name: "Other",
        value: total,
        color: "var(--chart-inactive-slice)",
      });
    }

    return data;
  }, [
    submissionsList.accepted,
    submissionsList.wrongAnswer,
    submissionsList.total,
  ]);

  // Data for Contributions Pie Chart (Active Days vs. Inactive Days in last 12 months)
  const contributionsChartData = useMemo(() => {
    const daysWithContributions = contributionData.filter(
      (d) => d.count > 0
    ).length;
    const today = new Date();
    const oneYearAgo = new Date(
      today.getFullYear() - 1,
      today.getMonth(),
      today.getDate()
    );
    const diffTime = Math.abs(today.getTime() - oneYearAgo.getTime());
    const totalDaysInLastYear = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return [
      {
        name: "Days Active",
        value: daysWithContributions,
        color: "hsl(142.1 76.2% 36.3%)",
      }, // Green
      {
        name: "Days Inactive",
        value: Math.max(0, totalDaysInLastYear - daysWithContributions),
        color: "var(--chart-inactive-slice)",
      },
    ];
  }, [contributionData]);

  if (!user && !loading) {
    return (
      <div className="container mx-auto p-8 text-center text-muted-foreground">
        Please log in to view your profile.
      </div>
    );
  }
  if (loading && user) {
    return (
      <div className="container mx-auto p-8 text-center text-muted-foreground">
        Loading profile data...
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto p-8 text-center text-destructive">
        {error}
      </div>
    );
  }
  if (!user) {
    return (
      <div className="container mx-auto p-8 text-center text-destructive">
        Could not retrieve user data. Please log in again.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">User Profile</h1>

      <Card
        className="
          mb-8 shadow-xl relative z-10
          bg-card/70 border border-border/50
          backdrop-blur-md transition-colors duration-500
        "
      >
        <CardContent className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6 text-foreground">
          <div className="relative group">
            <Avatar className="w-28 h-28 md:w-32 md:h-32 border-2 border-primary">
              {getAvatarContent()}
            </Avatar>
            <div
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-opacity cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleAvatarChange}
                accept="image/*"
                disabled={loading}
              />
            </div>
          </div>
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-2xl font-semibold text-foreground">
              {user.username}
            </h2>
            <p className="text-muted-foreground">{user.email}</p>
            <Badge variant="secondary" className="mt-2 capitalize">
              {user.role}
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">
              Member since:{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs
        defaultValue="submissions"
        className="w-full"
        onValueChange={setActiveTabOverview}
      >
        <TabsList
          className="
            grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
            bg-muted/50 border border-border/50
            backdrop-blur-sm transition-colors duration-500
          "
        >
          <TabsTrigger
            value="submissions"
            className="data-[state=active]:bg-background/70 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <Code className="mr-2 h-4 w-4" /> Submissions ({submissionsCount})
          </TabsTrigger>
          <TabsTrigger
            value="problems-solved"
            className="data-[state=active]:bg-background/70 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <Check className="mr-2 h-4 w-4" /> Solved ({solvedProblemsCount})
          </TabsTrigger>
          <TabsTrigger
            value="playlists"
            className="data-[state=active]:bg-background/70 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <List className="mr-2 h-4 w-4" /> Playlists ({playlistsCount})
          </TabsTrigger>
          <TabsTrigger
            value="contributions"
            className="data-[state=active]:bg-background/70 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <CalendarDays className="mr-2 h-4 w-4" /> Contributions
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <TabsContent value="submissions" className="mt-0">
              <Card
                className="
                  shadow-xl relative z-10 h-full
                  bg-card/70 border border-border/50
                  backdrop-blur-md transition-colors duration-500
                "
              >
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Recent Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-muted-foreground">
                      Loading submissions...
                    </p>
                  ) : (
                    <>
                      {submissionsList.list.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-border/50">
                                <TableHead className="text-foreground/80">
                                  Problem
                                </TableHead>
                                <TableHead className="text-foreground/80">
                                  Language
                                </TableHead>
                                <TableHead className="text-foreground/80">
                                  Status
                                </TableHead>
                                <TableHead className="text-foreground/80">
                                  Submitted At
                                </TableHead>
                                <TableHead className="text-foreground/80">
                                  Code
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {submissionsList.list.map((submission) => (
                                <React.Fragment key={submission.id}>
                                  <TableRow className="border-border/50 hover:bg-accent/30">
                                    <TableCell className="font-medium">
                                      <Link
                                        to={`/problems/${submission.problem.id}`}
                                        className="hover:underline text-primary"
                                      >
                                        {submission.problem.title}
                                      </Link>
                                    </TableCell>
                                    <TableCell className="text-foreground">
                                      {submission.language}
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        variant={
                                          submission.status === "Accepted"
                                            ? "default"
                                            : "destructive"
                                        }
                                        className={
                                          submission.status === "Accepted"
                                            ? "bg-green-100/80 text-green-700/80 dark:bg-green-900/80 dark:text-green-300/80"
                                            : "bg-red-100/80 text-red-700/80 dark:bg-red-900/80 dark:text-red-300/80"
                                        }
                                      >
                                        {submission.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-foreground">
                                      {new Date(
                                        submission.createdAt
                                      ).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          toggleCodeVisibility(submission.id)
                                        }
                                        className="text-foreground/80 hover:bg-muted"
                                      >
                                        {expandedSubmissionId ===
                                        submission.id ? (
                                          <ChevronUp className="h-4 w-4" />
                                        ) : (
                                          <ChevronDown className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                  {expandedSubmissionId === submission.id && (
                                    <TableRow>
                                      <TableCell
                                        colSpan={5}
                                        className="py-0 px-0"
                                      >
                                        <div className="w-full bg-background/50 border border-border/50 rounded-md p-4 overflow-x-auto text-sm">
                                          <h3 className="text-foreground font-semibold mb-2">
                                            Solution Code
                                          </h3>
                                          <SyntaxHighlighter
                                            language={mapLanguageToHljs(
                                              submission.language
                                            )}
                                            style={atomOneDark}
                                            customStyle={{
                                              backgroundColor:
                                                "var(--background-codeblock)",
                                              padding: "1rem",
                                              borderRadius: "0.375rem",
                                              width: "100%",
                                              overflowX: "auto",
                                              color:
                                                "var(--foreground-codeblock)",
                                            }}
                                            codeTagProps={{
                                              style: {
                                                fontFamily: "monospace",
                                                fontSize: "0.875rem",
                                              },
                                            }}
                                          >
                                            {submission.sourceCode ||
                                              "// Code not available"}
                                          </SyntaxHighlighter>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </React.Fragment>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          No submissions found yet.
                        </p>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="problems-solved" className="mt-0">
              <Card
                className="
                  shadow-xl relative z-10 h-full
                  bg-card/70 border border-border/50
                  backdrop-blur-md transition-colors duration-500
                "
              >
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Problems Solved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-muted-foreground">
                      Loading solved problems...
                    </p>
                  ) : solvedProblemsList.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border/50">
                            <TableHead className="text-foreground/80">
                              Title
                            </TableHead>
                            <TableHead className="text-foreground/80">
                              Difficulty
                            </TableHead>
                            <TableHead className="text-foreground/80">
                              Tags
                            </TableHead>
                            <TableHead className="text-foreground/80">
                              Solved At
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {solvedProblemsList.map((solvedProblem) => (
                            <TableRow
                              key={solvedProblem.id}
                              className="border-border/50 hover:bg-accent/30"
                            >
                              <TableCell className="font-medium">
                                <Link
                                  to={`/problems/${solvedProblem.problem.id}`}
                                  className="hover:underline text-primary"
                                >
                                  {solvedProblem.problem.title}
                                </Link>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    solvedProblem.problem.difficulty === "EASY"
                                      ? "default"
                                      : solvedProblem.problem.difficulty ===
                                        "MEDIUM"
                                      ? "secondary"
                                      : "destructive"
                                  }
                                  className={
                                    solvedProblem.problem.difficulty === "EASY"
                                      ? "bg-green-100/80 text-green-700/80 dark:bg-green-900/80 dark:text-green-300/80"
                                      : solvedProblem.problem.difficulty ===
                                        "MEDIUM"
                                      ? "bg-yellow-100/80 text-yellow-700/80 dark:bg-yellow-900/80 dark:text-yellow-300/80"
                                      : "bg-red-100/80 text-red-700/80 dark:bg-red-900/80 dark:text-red-300/80"
                                  }
                                >
                                  {solvedProblem.problem.difficulty}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {solvedProblem.problem.tags
                                    ?.slice(0, 3)
                                    .map((tag, index) => (
                                      <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                </div>
                              </TableCell>
                              <TableCell className="text-foreground">
                                {new Date(
                                  solvedProblem.createdAt
                                ).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No problems solved yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="playlists" className="mt-0">
              <Card
                className="
                  shadow-xl relative z-10 h-full
                  bg-card/70 border border-border/50
                  backdrop-blur-md transition-colors duration-500
                "
              >
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Your Playlists
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-muted-foreground">
                      Loading playlists...
                    </p>
                  ) : playlistsList.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border/50">
                            <TableHead className="text-foreground/80">
                              Name
                            </TableHead>
                            <TableHead className="text-foreground/80">
                              Description
                            </TableHead>
                            <TableHead className="text-foreground/80">
                              Created At
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {playlistsList.map((playlist) => (
                            <TableRow
                              key={playlist.id}
                              className="border-border/50 hover:bg-accent/30"
                            >
                              <TableCell className="font-medium">
                                <Link
                                  to={`/playlists/${playlist.id}`}
                                  className="hover:underline text-primary"
                                >
                                  {playlist.name}
                                </Link>
                              </TableCell>
                              <TableCell className="text-foreground">
                                {playlist.description || "No description"}
                              </TableCell>
                              <TableCell className="text-foreground">
                                {new Date(
                                  playlist.createdAt
                                ).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No playlists created yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contributions" className="mt-0">
              <Card
                className="
                  shadow-xl relative z-10 h-full
                  bg-card/70 border border-border/50
                  backdrop-blur-md transition-colors duration-500
                "
              >
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Contribution Graph
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-48 flex items-center justify-center text-muted-foreground">
                      Loading contributions...
                    </div>
                  ) : contributionData.length > 0 ? (
                    <div className="overflow-x-auto p-2 bg-background/50 rounded-md border border-border/50">
                      <CalendarHeatmap
                        startDate={
                          new Date(
                            new Date().setFullYear(new Date().getFullYear() - 1)
                          )
                        } // Set to exactly one year ago from today's date
                        endDate={new Date()}
                        values={contributionData}
                        classForValue={(value) => {
                          if (!value || value.count === 0) {
                            return "color-empty";
                          }
                          return `color-scale-${Math.min(value.count, 4)}`;
                        }}
                        tooltipDataAttrs={(value) => {
                          const dateString = value.date
                            ? new Date(value.date).toLocaleDateString()
                            : "N/A";
                          return {
                            "data-tooltip-id": "heatmap-tooltip",
                            "data-tooltip-content": `${dateString}: ${
                              value.count || 0
                            } contributions`,
                          };
                        }}
                        showWeekdayLabels={true}
                        gutterSize={2}
                      />
                      <ReactTooltip id="heatmap-tooltip" />
                    </div>
                  ) : (
                    <div className="bg-muted/50 h-48 flex items-center justify-center rounded-md text-muted-foreground border border-border/50">
                      <p>
                        No contributions recorded yet. Solve some problems to
                        see your graph!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          <div className="lg:col-span-1 hidden lg:block">
            <Card
              className="
                shadow-xl relative z-10 h-full
                bg-card/70 border border-border/50
                backdrop-blur-md transition-colors duration-500
              "
            >
              <CardHeader>
                <CardTitle className="text-foreground">
                  {activeTabOverview === "submissions" && "Submission Summary"}
                  {activeTabOverview === "problems-solved" &&
                    "Solved Problems Overview"}
                  {activeTabOverview === "playlists" && "Playlists Summary"}
                  {activeTabOverview === "contributions" && "Activity Insights"}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-4 h-[calc(100%-4rem)]">
                {loading ? (
                  <p className="text-muted-foreground">Loading data...</p>
                ) : (
                  <>
                    {activeTabOverview === "submissions" && (
                      <div className="flex flex-col items-center justify-center text-foreground w-full">
                        <h3 className="text-lg font-semibold mb-2">
                          Submission Rates
                        </h3>
                        {submissionsList.total > 0 ? (
                          <ResponsiveContainer width="90%" height={200}>
                            <PieChart>
                              <Pie
                                data={submissionChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {submissionChartData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                ))}
                              </Pie>
                              <RechartsTooltip
                                formatter={(value, name) => [
                                  `${value} ${name}`,
                                  value === 1 ? "day" : "days",
                                ]}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <p className="text-muted-foreground text-center">
                            No submissions yet to show chart.
                          </p>
                        )}
                        <p className="mt-4 text-center">
                          Total:{" "}
                          <span className="font-semibold text-primary">
                            {submissionsList.total}
                          </span>
                          <br />
                          Accepted:{" "}
                          <span className="text-green-500 font-semibold">
                            {submissionsList.accepted}
                          </span>
                          <br />
                          Wrong Answer:{" "}
                          <span className="text-red-500 font-semibold">
                            {submissionsList.wrongAnswer}
                          </span>
                        </p>
                      </div>
                    )}

                    {activeTabOverview === "problems-solved" && (
                      <div className="flex flex-col items-center justify-center text-foreground w-full">
                        <h3 className="text-lg font-semibold mb-2">
                          Problem Solved Rate
                        </h3>
                        {solvedProblemsCount > 0 || totalProblemsCount > 0 ? (
                          <ResponsiveContainer width="90%" height={200}>
                            <PieChart>
                              <Pie
                                data={solvedChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {solvedChartData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                ))}
                              </Pie>
                              <RechartsTooltip
                                formatter={(value, name) => [
                                  `${value} ${name}`,
                                  "",
                                ]}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <p className="text-muted-foreground text-center">
                            No problems solved yet to show chart.
                          </p>
                        )}
                        <p className="mt-4 text-center">
                          <span className="text-green-500 font-semibold">
                            {solvedProblemsCount}
                          </span>{" "}
                          solved out of{" "}
                          <span className="font-semibold">
                            {totalProblemsCount}
                          </span>{" "}
                          total problems.
                        </p>
                      </div>
                    )}

                    {activeTabOverview === "playlists" && (
                      <div className="flex flex-col items-center justify-center text-foreground w-full">
                        <h3 className="text-lg font-semibold mb-2">
                          Playlist Count
                        </h3>
                        {playlistsCount > 0 ? (
                          <ResponsiveContainer width="90%" height={200}>
                            <PieChart>
                              <Pie
                                data={playlistChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {playlistChartData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                ))}
                              </Pie>
                              <RechartsTooltip
                                formatter={(value, name) => [
                                  `${value} ${name}`,
                                  "",
                                ]}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <p className="text-muted-foreground text-center">
                            No playlists created yet to show chart.
                          </p>
                        )}
                        <p className="mt-4 text-center">
                          You have{" "}
                          <span className="text-primary font-semibold">
                            {playlistsCount}
                          </span>{" "}
                          playlists.
                        </p>
                      </div>
                    )}

                    {activeTabOverview === "contributions" && (
                      <div className="flex flex-col items-center justify-center text-foreground w-full">
                        <h3 className="text-lg font-semibold mb-2">
                          Annual Contributions Overview
                        </h3>
                        {contributionData.length > 0 ? (
                          <ResponsiveContainer width="90%" height={200}>
                            <PieChart>
                              <Pie
                                data={contributionsChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {contributionsChartData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                ))}
                              </Pie>
                              <RechartsTooltip
                                formatter={(value, name) => [
                                  `${value} ${name}`,
                                  value === 1 ? "day" : "days",
                                ]}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <p className="text-muted-foreground text-center">
                            No contribution data to show chart.
                          </p>
                        )}
                        <p className="mt-4 text-center">
                          Total contributions:{" "}
                          <span className="font-semibold text-primary">
                            {contributionData.reduce(
                              (acc, val) => acc + val.count,
                              0
                            )}
                          </span>{" "}
                          over the last 12 months.
                          <br />
                          Active days:{" "}
                          <span className="font-semibold text-green-500">
                            {contributionsChartData[0]?.value || 0}
                          </span>
                        </p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export default ProfilePage;

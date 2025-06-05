import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../../store/authStore"; // Adjust path
import {
  updateProfilePictureService,
  fetchUserSolvedProblemsCount,
  fetchUserSubmissionsCount,
  fetchUserPlaylistsCount,
  fetchUserContributions,
  fetchUserSubmissionsList,
  fetchUserSolvedProblemsList,
  fetchUserPlaylistsList,
} from "@/services/authService"; // Adjust path to your authService.js

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// Lucide Icons (ensure installed: npm install lucide-react)
import {
  ChevronDown,
  ChevronUp,
  CalendarDays,
  Code,
  List,
  User,
  Check,
} from "lucide-react"; // Make sure ALL these icons are imported
import { toast } from "sonner";

// For Contribution Graph (ensure installed: npm install react-calendar-heatmap d3-time-format react-tooltip)
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip as ReactTooltip } from "react-tooltip";

// For Syntax Highlighting
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs"; // Dark theme
// You'll need to register languages you plan to highlight
import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import java from "react-syntax-highlighter/dist/esm/languages/hljs/java"; // Java
// Register languages you support
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("java", java);

function ProfilePage() {
  const { user, updateUserProfile } = useAuthStore();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true); // Set to true initially to show loading state
  const [error, setError] = useState(null);

  // States for stats - these must be present
  const [submissionsCount, setSubmissionsCount] = useState(0);
  const [playlistsCount, setPlaylistsCount] = useState(0);
  const [solvedProblemsCount, setSolvedProblemsCount] = useState(0);
  const [contributionData, setContributionData] = useState([]);

  // NEW States for detailed lists
  const [submissionsList, setSubmissionsList] = useState({
    total: 0,
    accepted: 0,
    wrongAnswer: 0,
    list: [],
  });
  const [solvedProblemsList, setSolvedProblemsList] = useState([]);
  const [playlistsList, setPlaylistsList] = useState([]);

  // NEW STATE: To manage which submission's code is expanded
  const [expandedSubmissionId, setExpandedSubmissionId] = useState(null);

  // Toggle function for submission code visibility
  const toggleCodeVisibility = (submissionId) => {
    setExpandedSubmissionId((prevId) =>
      prevId === submissionId ? null : submissionId
    );
  };

  // Helper to map language names to syntax highlighter keys
  // This is important if your backend language names don't match hljs exactly
  const mapLanguageToHljs = (lang) => {
    switch (lang.toLowerCase()) {
      case "javascript":
        return "javascript";
      case "js":
        return "javascript";
      case "python":
        return "python";
      case "py":
        return "python";
      case "java":
        return "java";
      default:
        return "plaintext"; // Fallback for unknown languages
    }
  };

  // --- Effect to Fetch Profile Stats and Lists ---
  useEffect(() => {
    const fetchAllProfileData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [
          solvedCountRes,
          submissionsCountRes,
          playlistsCountRes,
          contributionsRes,
          // Fetching lists concurrently
          submissionsListRes,
          solvedProblemsListRes,
          playlistsListRes,
        ] = await Promise.all([
          fetchUserSolvedProblemsCount(user.id),
          fetchUserSubmissionsCount(user.id),
          fetchUserPlaylistsCount(user.id),
          fetchUserContributions(user.id),
          // Calls for lists
          fetchUserSubmissionsList(user.id),
          fetchUserSolvedProblemsList(user.id),
          fetchUserPlaylistsList(user.id),
        ]);

        // Update counts
        setSolvedProblemsCount(solvedCountRes.count);
        setSubmissionsCount(submissionsCountRes.count);
        setPlaylistsCount(playlistsCountRes.count);
        setContributionData(contributionsRes);

        // Update lists
        setSubmissionsList(submissionsListRes); // This will be { total, accepted, wrongAnswer, list }
        setSolvedProblemsList(solvedProblemsListRes);
        setPlaylistsList(playlistsListRes);
      } catch (err) {
        console.error("Error fetching all profile data:", err);
        setError("Failed to load profile data.");
        toast.error("Failed to load profile data.");
        // Reset states on error
        setSubmissionsCount(0);
        setPlaylistsCount(0);
        setSolvedProblemsCount(0);
        setContributionData([]);
        setSubmissionsList({ total: 0, accepted: 0, wrongAnswer: 0, list: [] });
        setSolvedProblemsList([]);
        setPlaylistsList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProfileData();
  }, [user?.id]); // Re-run effect if user ID changes

  // Helper to get avatar content (image or initials)
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

  // Handle Avatar File Change
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

    setLoading(true); // This loading state can be for the whole page or just avatar
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

  // --- Loading and Error States for the Page ---
  if (!user && !loading) {
    return (
      <div className="container mx-auto p-8 text-center text-muted-foreground">
        Please log in to view your profile.
      </div>
    );
  }
  if (loading && user) {
    // Only show loading spinner if user is present
    return (
      <div className="container mx-auto p-8 text-center text-muted-foreground">
        Loading profile data...
      </div>
    );
  }
  if (error) {
    // Show error if fetching failed
    return (
      <div className="container mx-auto p-8 text-center text-red-500">
        {error}
      </div>
    );
  }
  if (!user) {
    // Fallback in case user becomes null unexpectedly after initial check
    return (
      <div className="container mx-auto p-8 text-center text-red-500">
        Could not retrieve user data. Please log in again.
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>

      {/* Profile Header Card */}
      <Card className="mb-8">
        <CardContent className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
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
            <h2 className="text-2xl font-semibold">{user.username}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <Badge variant="outline" className="mt-2 capitalize">
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

      {/* Profile Tabs Section - THIS IS THE KEY PART */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
          {" "}
          {/* Ensure grid-cols-5 for all tabs */}
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="submissions">
            <Code className="mr-2 h-4 w-4" /> Submissions ({submissionsCount})
          </TabsTrigger>
          <TabsTrigger value="problems-solved">
            <Check className="mr-2 h-4 w-4" /> Solved ({solvedProblemsCount})
          </TabsTrigger>
          <TabsTrigger value="playlists">
            <List className="mr-2 h-4 w-4" /> Playlists ({playlistsCount})
          </TabsTrigger>
          <TabsTrigger value="contributions">
            <CalendarDays className="mr-2 h-4 w-4" /> Contributions
          </TabsTrigger>
        </TabsList>

        {/* Tab Content: Basic Profile Info */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={user.username || ""} readOnly />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email || ""} readOnly />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={user.role || ""} readOnly />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Content: Submissions - SHOWING DETAILED DATA */}
        <TabsContent value="submissions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading submissions...</p>
              ) : (
                <>
                  <div className="mb-4 text-sm">
                    <p>
                      Total Submissions:{" "}
                      <span className="font-semibold">
                        {submissionsList.total}
                      </span>
                    </p>
                    <p className="text-green-500">
                      Accepted:{" "}
                      <span className="font-semibold">
                        {submissionsList.accepted}
                      </span>
                    </p>
                    <p className="text-red-500">
                      Wrong Answer:{" "}
                      <span className="font-semibold">
                        {submissionsList.wrongAnswer}
                      </span>
                    </p>
                  </div>

                  {submissionsList.list.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Problem</TableHead>
                            <TableHead>Language</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted At</TableHead>
                            <TableHead>Code</TableHead> {/* NEW COLUMN */}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {submissionsList.list.map((submission) => (
                            <React.Fragment key={submission.id}>
                              <TableRow>
                                <TableCell className="font-medium">
                                  <Link
                                    to={`/problems/${submission.problem.id}`}
                                    className="hover:underline text-blue-600 dark:text-blue-400"
                                  >
                                    {submission.problem.title}
                                  </Link>
                                </TableCell>
                                <TableCell>{submission.language}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      submission.status === "Accepted"
                                        ? "default"
                                        : "destructive"
                                    }
                                    className={
                                      submission.status === "Accepted"
                                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                    }
                                  >
                                    {submission.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {new Date(
                                    submission.createdAt
                                  ).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  {/* Toggle button for code */}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      toggleCodeVisibility(submission.id)
                                    }
                                  >
                                    {expandedSubmissionId === submission.id ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TableCell>
                              </TableRow>
                              {/* Expanded Row for Code */}
                              {expandedSubmissionId === submission.id && (
                                <TableRow>
                                  <TableCell colSpan={5} className="py-0 px-0">
                                    <div className="w-full bg-gray-800 dark:bg-gray-900 rounded-md p-4 overflow-x-auto text-sm">
                                      <h3 className="text-white font-semibold mb-2">
                                        Solution Code
                                      </h3>
                                      <SyntaxHighlighter
                                        language={mapLanguageToHljs(
                                          submission.language
                                        )}
                                        style={atomOneDark} // Use the imported dark theme
                                        customStyle={{
                                          backgroundColor: "#2d2d2d", // codeblock
                                          padding: "1rem",
                                          borderRadius: "0.375rem",
                                          width: "100%",
                                          overflowX: "auto",
                                        }}
                                        codeTagProps={{
                                          style: {
                                            fontFamily: "monospace",
                                            fontSize: "0.875rem", // Adjust font size as needed
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

        {/* Tab Content: Problems Solved - SHOWING DETAILED DATA */}
        <TabsContent value="problems-solved" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Problems Solved</CardTitle>
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
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead>Solved At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {solvedProblemsList.map((solvedProblem) => (
                        <TableRow key={solvedProblem.id}>
                          <TableCell className="font-medium">
                            <Link
                              to={`/problems/${solvedProblem.problem.id}`}
                              className="hover:underline text-blue-600 dark:text-blue-400"
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
                                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                  : solvedProblem.problem.difficulty ===
                                    "MEDIUM"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
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
                          <TableCell>
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
                <p className="text-muted-foreground">No problems solved yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Content: Playlists - SHOWING DETAILED DATA */}
        <TabsContent value="playlists" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Playlists</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading playlists...</p>
              ) : playlistsList.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Created At</TableHead>
                        {/* Add a column for number of problems in playlist if you implement that count */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {playlistsList.map((playlist) => (
                        <TableRow key={playlist.id}>
                          <TableCell className="font-medium">
                            {/* You might link to a playlist detail page here later */}
                            <Link
                              to={`/playlists/${playlist.id}`}
                              className="hover:underline text-blue-600 dark:text-blue-400"
                            >
                              {playlist.name}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {playlist.description || "No description"}
                          </TableCell>
                          <TableCell>
                            {new Date(playlist.createdAt).toLocaleDateString()}
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

        {/* Tab Content: Contribution Graph */}
        <TabsContent value="contributions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contribution Graph</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-48 flex items-center justify-center text-muted-foreground">
                  Loading contributions...
                </div>
              ) : contributionData.length > 0 ? (
                <div className="overflow-x-auto p-2 bg-card rounded-md">
                  <CalendarHeatmap
                    startDate={new Date(new Date().getFullYear() - 1, 0, 1)}
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
                <div className="bg-gray-100 dark:bg-gray-700 h-48 flex items-center justify-center rounded-md text-muted-foreground">
                  <p>
                    No contributions recorded yet. Solve some problems to see
                    your graph!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProfilePage;

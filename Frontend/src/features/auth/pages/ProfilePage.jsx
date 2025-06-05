import React, { useState, useEffect, useRef } from "react";
import useAuthStore from "../../../store/authStore";
import {
  updateProfilePictureService,
  // Removed: fetchUserSolvedProblemsCount, fetchUserContributions, etc.
} from "@/services/authService";

// Shadcn/UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import { User } from "lucide-react";
import { toast } from "sonner";

function ProfilePage() {
  const { user, updateUserProfile } = useAuthStore();
  const fileInputRef = useRef(null); // Ref to trigger file input click
  const [loading, setLoading] = useState(false); // General loading state for the page
  const [error, setError] = useState(null); // General error state for the page

  // --- Helper to get avatar content (image or initials) ---
  const getAvatarContent = () => {
    if (user?.image) {
      return (
        <AvatarImage src={user.image} alt={`${user.username}'s profile`} />
      );
    } else if (user?.username) {
      const nameParts = user.username.split(" ");
      let initials = "";
      if (nameParts.length > 0) {
        initials += nameParts[0][0]; // First letter of first word
        if (nameParts.length > 1) {
          initials += nameParts[nameParts.length - 1][0]; // First letter of last word
        }
      }
      return <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>;
    }
    return <AvatarFallback>NR</AvatarFallback>; // Generic fallback
  };

  // --- Handle Avatar File Change ---
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Client-side validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (e.g., JPEG, PNG, GIF).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
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

  // --- Loading and Error States for the Page ---
  if (!user && !loading) {
    return (
      <div className="container mx-auto p-8 text-center text-muted-foreground">
        Please log in to view your profile.
      </div>
    );
  }
  if (loading && !user) {
    return (
      <div className="container mx-auto p-8 text-center text-muted-foreground">
        Loading profile...
      </div>
    );
  }
  if (!user) {
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

      {/* Profile Header Card (Avatar, Username, Email, Role) */}
      <Card className="mb-8">
        <CardContent className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Section */}
          <div className="relative group">
            <Avatar className="w-28 h-28 md:w-32 md:h-32 border-2 border-primary">
              {getAvatarContent()}
            </Avatar>
            {/* Overlay to trigger file input on hover/click */}
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
          {/* User Info */}
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

      {/* Profile Tabs Section (only Profile tab active for now) */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          {" "}
          {/* Only one column for one tab */}
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" /> Profile
          </TabsTrigger>
          {/* Removed: Submissions, Problems Solved, Playlists, Contributions Triggers */}
        </TabsList>

        {/* Tab Content: Basic Profile Info (this is the only active one) */}
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
      </Tabs>
    </div>
  );
}

export default ProfilePage;

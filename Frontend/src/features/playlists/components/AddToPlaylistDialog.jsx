import React, { useState, useEffect } from "react";
import useUserPlaylistsStore from "../../../store/useUserPlaylistsStore"; // Adjust path
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import CreatePlaylistDialog from "./CreatePlaylistDialog";

function AddToPlaylistDialog({
  problemId,
  problemTitle,
  isOpen,
  setIsOpen,
  onPlaylistCreated,
}) {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const {
    playlists,
    isLoading,
    getUserPlaylists,
    addProblemToPlaylist,
    isAddingProblem,
  } = useUserPlaylistsStore();

  useEffect(() => {
    // Fetch playlists when the dialog is opened.
    if (isOpen && playlists.length === 0) {
      getUserPlaylists();
    }
  }, [isOpen, getUserPlaylists, playlists.length]);

  const handleAddToSelectedPlaylist = async () => {
    if (!selectedPlaylistId) {
      toast.error("No playlist selected.", {
        description: "Please select a playlist or create a new one.",
      });
      return;
    }
    await addProblemToPlaylist(selectedPlaylistId, problemId, problemTitle);
    setIsOpen(false); // Close the dialog
    setSelectedPlaylistId(""); // Reset selection
  };

  // This function can be called after a new playlist is created via CreatePlaylistDialog
  const handleNewPlaylistCreatedAndAddProblem = (newPlaylist) => {
    if (onPlaylistCreated) {
      onPlaylistCreated(newPlaylist);
    }
    setIsOpen(false); // Close this AddToPlaylistDialog
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add "{problemTitle}" to Playlist</DialogTitle>
          <DialogDescription>
            Select an existing playlist or create a new one.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="playlist-select">Select Playlist</Label>
            {isLoading && (
              <p className="text-xs text-slate-500">Loading playlists...</p>
            )}
            {!isLoading && playlists.length === 0 && (
              <p className="text-xs text-slate-500 py-2">
                No playlists found. Create one!
              </p>
            )}
            {!isLoading && playlists.length > 0 && (
              <Select
                value={selectedPlaylistId}
                onValueChange={setSelectedPlaylistId}
              >
                <SelectTrigger id="playlist-select" className="w-full mt-1">
                  <SelectValue placeholder="Choose a playlist..." />
                </SelectTrigger>
                <SelectContent>
                  {playlists.map((playlist) => (
                    <SelectItem key={playlist.id} value={playlist.id}>
                      {playlist.name} ({playlist.problemCount || 0} problems){" "}
                      {/* Assuming problemCount is available */}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm">Or</span>

            <CreatePlaylistDialog
              onPlaylistCreated={(newlyCreatedPlaylist) => {
                handleNewPlaylistCreatedAndAddProblem(newlyCreatedPlaylist);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleAddToSelectedPlaylist}
            disabled={!selectedPlaylistId || isAddingProblem}
          >
            {isAddingProblem ? "Adding..." : "Add to Selected Playlist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddToPlaylistDialog;

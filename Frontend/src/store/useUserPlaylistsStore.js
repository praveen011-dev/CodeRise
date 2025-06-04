import { create } from "zustand";
import {
  fetchUserPlaylists,
  addProblemToPlaylist,
  createPlaylist as createPlaylistService,
} from "../services/playlistService";
import { toast } from "sonner";

const useUserPlaylistsStore = create((set, get) => ({
  playlists: [],
  isLoading: false,
  isAddingProblem: false,
  error: null,

  // Action to fetch all playlists for the current user
  getUserPlaylists: async () => {
    set({ isLoading: true, error: null });
    try {
      const userPlaylists = await fetchUserPlaylists();
      set({ playlists: userPlaylists || [], isLoading: false });
    } catch (err) {
      console.error("Error fetching user playlists:", err);
      toast.error("Failed to load your playlists", {
        description: err.message,
      });
      set({ isLoading: false, error: err.message, playlists: [] });
    }
  },

  // Action to add a problem to an existing playlist
  addProblemToPlaylist: async (
    playlistId,
    problemId,
    problemTitle = "Problem"
  ) => {
    set({ isAddingProblem: true, error: null });
    try {
      const result = await addProblemToPlaylist(playlistId, problemId);
      toast.success(`"${problemTitle}" added to playlist!`, {
        description: result?.message || "Successfully updated playlist.",
      });

      // Re-fetch the playlists after successfully adding a problem
      await get().getUserPlaylists(); // Call the action to refresh the list

      return result;
    } catch (err) {
      console.error("Error adding problem to playlist:", err);
      toast.error("Failed to add problem to playlist", {
        description: err.message,
      });
      set({ error: err.message });
    } finally {
      set({ isAddingProblem: false });
    }
  },

  // Action to create a new playlist (can also call from CreatePlaylistDialog)
  createNewPlaylist: async (playlistData, problemToAdd = null) => {
    set({ isLoading: true, error: null }); // Use general isLoading or a specific one
    try {
      const newPlaylist = await createPlaylistService(playlistData);
      toast.success(`Playlist "${newPlaylist.name}" created!`);
      get().getUserPlaylists(); // Refresh the list of playlists to include the new one

      if (problemToAdd && problemToAdd.id && newPlaylist.id) {
        // If a problem was intended to be added to this new playlist
        await get().addProblemToPlaylist(
          newPlaylist.id,
          problemToAdd.id,
          problemToAdd.title
        );
      } else {
        // If no problem to add, still refresh the playlist list
        await get().getUserPlaylists();
      }
      return newPlaylist;
    } catch (err) {
      console.error("Error creating new playlist:", err);
      toast.error("Failed to create playlist", { description: err.message });
      set({ error: err.message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useUserPlaylistsStore;

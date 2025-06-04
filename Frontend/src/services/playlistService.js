import apiClient from "../lib/apiClient";

const PLAYLIST_RESOURCE_PATH = "/playlist";

export const createPlaylist = async (playlistData) => {
  return apiClient(`${PLAYLIST_RESOURCE_PATH}/`, "POST", playlistData);
};

export const fetchUserPlaylists = async () =>
  apiClient(PLAYLIST_RESOURCE_PATH, "GET");
export const addProblemToPlaylist = async (playlistId, problemId) => {
  if (!playlistId || !problemId) {
    throw new Error("Playlist ID and Problem ID are required.");
  }

  const payload = {
    problemIds: [problemId],
  };

  return apiClient(`${PLAYLIST_RESOURCE_PATH}/${playlistId}/`, "POST", payload);
};

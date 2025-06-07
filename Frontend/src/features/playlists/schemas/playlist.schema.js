import { z } from "zod";

export const createPlaylistSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Playlist name must be at least 3 characters." })
    .max(100, { message: "Playlist name must be 100 characters or less." }),
  description: z
    .string()
    .max(500, { message: "Description must be 500 characters or less." })
    .optional(), 
});

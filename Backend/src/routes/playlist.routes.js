import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware";

import { getAllListDetails,getPlaylistDetails,createPlaylist,addProblemToPlaylist,deletePlaylist,removeProblemFromPlaylist } from "../controllers/playlist.controller.js";

const router=Router();

router.route("/")
.get(isLoggedIn,getAllListDetails)

router.route("/:playlistId")
.get(isLoggedIn,getPlaylistDetails)

router.route("/create-playlist")
.post(isLoggedIn,createPlaylist)

router.route("/:playlistId/add-problem")
.post(isLoggedIn,addProblemToPlaylist)

router.route("/:playlistId")
.delete(isLoggedIn,deletePlaylist)

router.route("/:playlistId/remove-problem")
.delete(isLoggedIn,removeProblemFromPlaylist)


export default router
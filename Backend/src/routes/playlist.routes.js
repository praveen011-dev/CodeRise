import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

import { getAllListDetails,getPlaylistDetails,createPlaylist,addProblemToPlaylist,deletePlaylist,removeProblemFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";

const router=Router();

router.route("/")
.get(isLoggedIn,getAllListDetails)

router.route("/create-playlist")
.post(isLoggedIn,createPlaylist)

router.route("/:playlistId")
.get(isLoggedIn,getPlaylistDetails)

router.route("/:playlistId/add-problem")
.post(isLoggedIn,addProblemToPlaylist)

router.route("/:playlistId")
.put(isLoggedIn,updatePlaylist)

router.route("/:playlistId")
.delete(isLoggedIn,deletePlaylist)

router.route("/:playlistId/remove-problem")
.delete(isLoggedIn,removeProblemFromPlaylist)




export default router
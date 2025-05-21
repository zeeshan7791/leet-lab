import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  addProblemToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllPlaylistsDetails,
  getPlaylistDetails,
  updatePlaylist,
  removeProblemFromPlaylist,
} from "../controllers/playlist.controller.js";

const playlistRoutes = express.Router();

playlistRoutes.get("/all-playlists", authMiddleware, getAllPlaylistsDetails);
playlistRoutes.post("/create-playlist", authMiddleware, createPlaylist);
playlistRoutes.get("/get-playlist/:playlistId", authMiddleware, getPlaylistDetails);
playlistRoutes.put("/update-playlist/:playlistId", authMiddleware, updatePlaylist);
playlistRoutes.post(
  "/:playlistId/add-problem",
  authMiddleware,
  addProblemToPlaylist
);
playlistRoutes.delete("/:playlistId", authMiddleware, deletePlaylist);
playlistRoutes.delete(
  "/:playlistId/remove-problem",
  authMiddleware,
  removeProblemFromPlaylist
);

export default playlistRoutes;

import { db } from "../libs/db.js";

export const createPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description } = req.body;
    console.log(userId,'userid---------------')
    const existingPlaylist = await db.playlist.findFirst({
  where: { name, userId }
});
 console.log(existingPlaylist,'existing playlist')
if (existingPlaylist) {
  return res.status(400).json({
    success: false,
    error: "You already have a playlist with this name"
  });
}
    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "playlist created successfully",
      playlist,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to create playlist" });
  }
};
export const getAllPlaylistsDetails = async (req, res) => {
  try {
    const playlists = await db.playlist.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });
    if (!playlists || playlists.length === 0) {
      return res.status(404).json({
        success: false,
        error: "playlists not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "playlists fetched successfully",
      playlists,
    });
  } catch (error) {
    return res
      .status(200)
      .json({ success: false, error: "Failed to fetch playlists" });
  }
};
export const getPlaylistDetails = async (req, res) => {
  console.log("hello--")
  const { playlistId } = req.params;
console.log(playlistId,'value in playulist-------diidiiiiiiiiii')
  try {
  const playlist = await db.playlist.findUnique({
  where: {
    id: playlistId,
    userId: req.user.id,
  },
  include: {
    problems: {
      include: {
        problem: {
          include: {
            solvedBy: {
              where: {
                userId: req.user.id
              }
            }
          }
        }
      }
    }
  }
});

    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, error: "playlist not found" });
    }
    return res.status(200).json({
      success: true,
      message: "playlist fetched successfully",
      playlist,
    });
  } catch (error) {
    return res
      .status(200)
      .json({ success: false, error: "Failed to fetch playlist" });
  }
};

export const updatePlaylist = async (req, res) => {
  const { name, description } = req.body;
  const { playlistId } = req.params; // assuming playlistId comes from the route params
const userId=req.user.id
  try {
    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        userId,
      },
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    const updatedPlaylist = await db.playlist.update({
      where: { id: playlistId },
      data: {
        name:name?name:playlist.name,
        description:description?description:playlist.description,
        userId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Playlist updated successfully",
      playlist: updatedPlaylist,
    });

  } catch (error) {
    console.error(error); // optional: log error for debugging
    return res.status(500).json({
      success: false,
      message: "Failed to update playlist",
    });
  }
};

export const addProblemToPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;



  console.log(playlistId,'feont edn----')
  console.log(problemIds,'front problems edn------- ')


  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "invalid or missing problemId" });
    }

    const problemsInPlaylist = await db.problemInPlayList.createMany({
      data: problemIds.map((problemId) => ({
        playlistId,
        problemId,
      })),
    });

    return res.status(200).json({
      success: true,
      message: "Problems added to playlist successfully",
      problemsInPlaylist,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "Failed to add problem in playlist" });
  }
};
export const deletePlaylist = async (req, res) => {
  const { playlistId } = req.params;
  try {
    const removePlaylist = await db.playlist.delete({
      where: {
        id: playlistId,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
      removePlaylist,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "Failed to delete playlist" });
  }
};
export const removeProblemFromPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;
  console.log(problemIds,'value in problem id------')

  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "invalid or missing problemId" });
    }

    const deleteProblemFromPlaylist = await db.problemInPlayList.deleteMany({
      where: {
        playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Problem deleted successfully from playlist",
      deleteProblemFromPlaylist,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        error: "Failed to delete problem from playlist",
      });
  }
};

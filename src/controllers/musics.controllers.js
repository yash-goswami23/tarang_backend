import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fetchSongByArtist, searchSongs } from "../services/song.services.js";
import { ApiError } from "../utils/ApiError.js";

const musics = asyncHandler(async (req, res) => {
  const { artists } = req.body;

  // Validate artists input
  if (!Array.isArray(artists) || artists.length === 0 || !artists) {
    throw new ApiError(400, "Enter Artist Names");
  }

  // Fetch songs for each artist (array of arrays)
  const songLists = await Promise.all(
    artists.map(artist => fetchSongByArtist(artist))
  );
  // console.log(`songs list leangth: ${songLists.length}`);
  
  // Flatten to a single array of songs
  const allSongs = songLists.flat();
// console.log(`allsongs leangth: ${allSongs.length}`);
  
  // Remove duplicate songs based on a unique key (preferably perma_url or id)
  const seen = new Set();
  const uniqueSongs = allSongs.filter(song => {
  const key = song?.url; // 🎯 Use 'url' as unique key
  if (!key || seen.has(key)) return false;
  seen.add(key);
  return true;
});

// console.log(`uniqueSongs leangth: ${uniqueSongs.length}`);
  // Limit to top 10 songs and send response
  return res.status(200).json(
    new ApiResponse(200, uniqueSongs.slice(0, 10), "Successfully fetched music")
  );
});


const searchMusic = asyncHandler(async (req, res)=>{
  const {songName} = req.body;

  if(!songName || songName === "") throw new ApiError(401, "Enter Song Name");

  try {
    const songs = await searchSongs(songName);
    if(songs.length <= 0 || songs === null || songs === "") throw new ApiError(404, "Song Not Found");
    return res
    .status(200)
    .json(new ApiResponse(200, songs, "Successfully Songs Found"));

  } catch (error) {
    throw new ApiError(500, `Internal Server Problem: ${error}`);
  }

});


export { musics, searchMusic};

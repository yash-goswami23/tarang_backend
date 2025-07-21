import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {fetchArtistGroups, saavnArtistSearch} from '../services/artist.services.js';
import { Artist } from "../models/artist.models.js";

const searchArtist = asyncHandler(async (req, res) => {
  const { artist } = req.body;

  if (!artist || artist.trim() === "") {
    throw new ApiError(400, "Enter Search Query"); 
  }

  try {
    const artistData = await saavnArtistSearch(artist.trim());

    if (!artistData || artistData.length === 0) {
      throw new ApiError(404, "Artist not found");
    }

    return res.status(200).json(new ApiResponse(200, artistData, "Successfully done"));

  } catch (error) {
    throw new ApiError(500, error.message || "Internal Server Error");
  }
});



const artists = asyncHandler(async (req, res) => {
  try {
    const categorizedArtists = await fetchArtistGroups();
    // console.log(categorizedArtists);
     const isEmpty = Object.values(categorizedArtists).every(category => category.length === 0);
    if (isEmpty) {
      throw new ApiError(404, 'No artist data found from any category');
    }

    return res
      .status(200)
      .json(new ApiResponse(200, categorizedArtists, "Artists fetched successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong");
  }
});

// const userFavArtist = asyncHandler(async (req, res)=>{
//   const usreArtistList =  req.body; // {"Ikka", "Bali", "Kishore Kumar", "Yo yo honey singh"}
  
// });


export {searchArtist, artists}
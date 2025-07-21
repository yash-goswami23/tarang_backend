import { Artist } from '../models/artist.models.js';
import { artistGroups } from '../utils/artistGroup.js';

const fetchArtistGroups = async () => {
  const results = {};

  for (const [category, artistList] of Object.entries(artistGroups)) {
    const promises = artistList.map(async (name) => {
      const result = await saavnArtistSearch(name.trim());
      return result;
    });

    const data = await Promise.all(promises);

    results[category] = data.filter(item =>
      item && typeof item === 'object' && item.id && item.name
    );
  }

  return results;
};


const saavnSongSearch = "/api/search/artists";

const saavnArtistSearch = async (searchQuery) => {
  try {
    const query = searchQuery.trim().split(" ").join("+");
    const searchUrl = `${process.env.JIO_SAAVN}${saavnSongSearch}?query=${query}&limit=1`;
    // console.log(searchUrl)
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw response.body;
    }

    const data = await response.json();

    // console.log("Parsed Data:", data.data.results);
    // return data.data.results[0];
    const artistData = data.data.results[0]; 
        let imgUrl;

    if (artistData.image[3] && artistData.image[3].url) {
      imgUrl = artistData.image[3].url;
    } else {
      for (const img of artistData.image) {
        if (img.url) {
          imgUrl = img.url;
          break;
        }
      }
    }
   const artistModel = new Artist({
        id: artistData.id,
        name: artistData.name,
        image: imgUrl,
        url: artistData.url
      });
return artistModel;
  } catch (error) {
    throw error;
  }
};




export { fetchArtistGroups, saavnArtistSearch };
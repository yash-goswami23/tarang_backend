
import dotenv from 'dotenv';
dotenv.config();

const saavnSongSearch = "/api/search/songs";

const usedSongUrls = new Set();

const mapApiToMusicModel = (apiSong) => {
  return {
    name: apiSong.name,
    yaer: parseInt(apiSong.year) || null,
    duration: apiSong.duration,
    url: apiSong.url,
    images: apiSong.image?.map(img => img.url) || [],
    downloadUrl: apiSong.downloadUrl?.map(d => d.url) || [],
  };
};

const fetchSongByArtist = async (searchQuery) => {
  try {
    const query = searchQuery.trim().split(" ").join("+");
    const searchUrl = `${process.env.JIO_SAAVN}${saavnSongSearch}?query=${query}&limit=20`;

    const response = await fetch(searchUrl);
    if (!response.ok) throw response.body;

    const data = await response.json();
    const allSongs = data?.data?.results || [];

    // console.log("Total Songs From API:", allSongs.length);

    // ✅ Safe filter with correct key
    const freshSongs = allSongs.filter(song => {
      if (!song || !song.url) return false;
      return !usedSongUrls.has(song.url);
    });

    if (freshSongs.length < 2) {
      // console.warn("Not enough new songs left.");
      return null;
    }

    const shuffled = freshSongs.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 2);

    selected.forEach(song => usedSongUrls.add(song.url));
    let mappedSongs = [];
    selected.forEach((song) => {mappedSongs.push(mapApiToMusicModel(song))});
    // console.log("2 Unique Songs:", selected);    
    // const mappedSongs = selected.map(mapApiToMusicModel);    
// console.log("Mapped Songs Count:", mappedSongs.length);
    // return selected;
    return mappedSongs;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
};


const searchSongs = async (searchQuery)=>{
  try {
    const searchURl = `${process.env.JIO_SAAVN}${saavnSongSearch}?query=${searchQuery}&limit=3`
    const response = await fetch(searchURl);
    if(!response.ok) throw response.body;
    const data = await response.json();
    // const songs = data.data.results;
    // return songs;
  
    const mappedSongs = songs.map(mapApiToMusicModel);
    return mappedSongs;

  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }

}

export {fetchSongByArtist, searchSongs}
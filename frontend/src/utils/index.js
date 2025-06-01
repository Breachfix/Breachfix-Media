import axios from 'axios';

const API  = process.env.NEXT_PUBLIC_API_BASE_URL;  
const API_URL= `${API}/api/v1`; // Backend URL for the API

// Create an Axios instance for the Movies service
const api = axios.create({
  baseURL: `${API_URL}/movies`, // Base URL for movies
});
const episode = axios.create({
  baseURL: `${API_URL}/episodes`, // Base URL for movies
});

const watch = axios.create({
  baseURL: `${API_URL}/watch`, // Base URL for movies
});

const search = axios.create({
  baseURL: `${API_URL}/search`, // Base URL for movies
});


const userid = axios.create({
  baseURL: `${API_URL}/auth`, // Base URL for movies
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // Adjust based on your token logic
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
userid.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // Adjust based on your token logic
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getTrendingMedias = async (type) => {
  try {
    let endpoint = "";

    if (type === "movie") {
      endpoint = `${API_URL}/movies/trending`;
    } else if (type === "tv") {
      endpoint = `${API_URL}/tvShows/trending`;
    } else {
      throw new Error("Unsupported media type");
    }

    const response = await axios.get(endpoint);
    const rawData = response.data || [];

    // Normalize the media structure
    const processed = rawData.map((item) => {
      if (type === "movie") {
        return {
          ...item,
          id: item._id,
          type: "movie",
          thumbnailUrl: item.thumbnail_url_s3 || item.thumbnail_url || "",
          videoUrl: item.video_url_s3 || "",
          HLS: item.HLS || {},
        };
      } else if (type === "tv") {
        const firstSeason = item.seasons?.[0];
        const firstEpisode = firstSeason?.episodes?.[0];

        return {
          ...item,
          id: item._id,
          type: "tv",
          thumbnailUrl: firstEpisode?.thumbnail_url_s3 || "",
          videoUrl: firstEpisode?.video_url_s3 || "",
          HLS: firstEpisode?.HLS || {},
        };
      }
    });

    return processed;
  } catch (error) {
    console.error("❌ Error fetching trending medias:", error);
    return [];
  }
};

// export const getTopratedMedias = async (type) => {
//   try {
//     const res = await fetch(
//       `${BASE_URL}/${type}/top_rated?api_key=${API_KEY}&language=en-US`,
//       {
//         method: "GET",
//       }
//     );

//     const data = await res.json();

//     return data && data.results;
//   } catch (e) {
//     console.log(e);
//   }
// };

// export const getPopularMedias = async (type) => {
//   try {
//     const res = await fetch(
//       `${BASE_URL}/${type}/popular?api_key=${API_KEY}&language=en-US`,
//       {
//         method: "GET",
//       }
//     );

//     const data = await res.json();

//     return data && data.results;
//   } catch (e) {
//     console.log(e);
//   }
// };

/**
 * Fetches media by genre and filters it by type (movie, tv, episode),
 * ensures image URL is included, and normalizes ID field.
 *
 * @param {string} type - "movie", "tv", or "episode"
 * @param {string} genre - Genre name (e.g. "Faith", "Prophecy")
 */
export const getTVorMoviesByGenre = async (type, genre) => {
  try {
    const res = await axios.get(`${API_URL}/genre/${type}/genres/${genre}`);
    const { data } = res;

    if (!data.success) {
      console.error("Failed to fetch genre media:", data.error);
      return [];
    }

    return (data.data || []).map((item) => ({
      ...item,
      id: item._id || item.id,
      thumbnail_url_s3:
        item.thumbnail_url_s3 ||
        item.thumbnail_url ||
        item.posterUrl,
    }));
  } catch (error) {
    console.error("❌ Error in getTVorMoviesByGenre:", error.message);
    return [];
  }
};

export const getGenresByType = async (mediaType) => {
  try {
    const res = await axios.get(`${API_URL}/genre/${mediaType}/genres`);

    if (res.data.success) {
      return res.data.genres; // returns an array like ["Faith", "Healing", ...]
    } else {
      console.error("⚠️ Failed to fetch genres:", res.data.error);
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching genres by type:", error.message);
    return [];
  }
};

export const getTVorMovieVideosByID = async (type, id) => {
  try {
    const res = await fetch(
      `${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}&language=en-US&append_to_response=videos`,
      {
        method: "GET",
      }
    );

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getTVorMovieSearchResults = async (type, query) => {
  try {
    const endpoint =
      type === "movie"
        ? `${API_URL}/movies/search/${query}`
        : `${API_URL}/tvShows/search/${query}`;

    const res = await fetch(endpoint, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch ${type} search results`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error(`🔍 Search error (${type}):`, e.message);
    return [];
  }
};

export const getTVorMovieDetailsByID = async (type, id) => {
  try {
    const res = await axios.get(`${API_URL}/media/${type}/${id}`);
    const data = res.data?.data;

    if (!data) return null;

    // 👇 Enhance data for 'episode' type by fetching parent TV show
    if (type === "episode") {
      const tvShowId = data.tvShowId || data.tvShow?._id;
      if (tvShowId) {
        const tvShowRes = await axios.get(`${API_URL}/media/tvShow/${tvShowId}`);
        const tvShowData = tvShowRes.data?.data;

        return {
          ...data,
          title: `${tvShowData.title} - S${data.seasonNumber}E${data.episodeNumber}`,
          genres: tvShowData.genres,
          release_date: data.releaseDate || tvShowData.releaseDate,
          poster_path: data.thumbnail || tvShowData.poster,
          backdrop_path: data.backdrop || tvShowData.backdrop,
          trailer_url: data.trailerUrl || tvShowData.trailerUrl,
          video_url:
            data.video_url_s3 ||
            data.transcodedVideo ||
            data.HLS?.["1080p"] ||
            data.HLS?.["720p"] ||
            tvShowData.trailerUrl,
        };
      }
    }

    // 👇 Normalize movie and tvShow fields as well
    return {
      ...data,
      video_url:
        data.trailerUrl ||
        data.trailer ||
        data.video_url_s3 ||
        data.transcodedVideo ||
        data.HLS?.["1080p"] ||
        data.HLS?.["720p"],
      poster_path: data.poster || data.thumbnail,
      backdrop_path: data.backdrop,
    };
  } catch (error) {
    console.error("❌ Error fetching media details:", error?.response?.data || error.message);
    return null;
  }
};

export const fetchTrailerFromYouTube = async (title) => {
  try {
    const res = await fetch(`/api/videos/search-trailer?title=${encodeURIComponent(title)}`);
    const data = await res.json();

    if (data.videoKey) return data.videoKey;
    return null;
  } catch (error) {
    console.error("❌ Failed to fetch YouTube trailer:", error);
    return null;
  }
};

export const getSimilarTVorMovies = async (type, id) => {
  try {
    const res = await axios.get(`${API_URL}/media/${type}/${id}/similar`);
    return res.data || [];
  } catch (error) {
    console.error("❌ Error fetching similar content:", error?.response?.data || error.message);
    return [];
  }
};

export const getAllfavorites = async (uid, accountID) => {
  try {
    const res = await fetch(
      `/api/favorites/get-all-favorites?id=${uid}&accountID=${accountID}`,
      {
        method: "GET",
      }
    );

    const data = await res.json();

    return data && data.data;
  } catch (e) {
    console.log(e);
  }
};

export const fetchHeroContent = async () => {
  try {
    const response = await api.get(`/hero-content/random`);

    // Axios responses are always resolved unless status is 4xx/5xx, so no need for response.ok
    const data = response.data;
    console.log("✅ Fetched hero content:", data);
    return data;
  } catch (error) {
    console.error("❌ Error fetching hero content:", {
      message: error.message,
      ...(error.response && {
        status: error.response.status,
        data: error.response.data,
      }),
    });
    throw new Error(error.response?.data?.message || error.message || 'Failed to load hero content');
  }
};

/**
 * Fetch watchable media by type and ID (movie, episode, or tvShow)
 * @param {"movie" | "episode" | "tvShow"} type 
 * @param {string} id 
 * @returns full media object with title, videoUrl, HLS, etc.
 */
export const fetchWatchContent = async (type, id) => {
  try {
    const response = await watch.get(`/${type}/${id}`);
    if (!response.data.success) throw new Error("⚠️ Failed to retrieve video details");

    const content = response.data;
    let videoUrl = null;
    let HLS = {};
    let nextEpisodeId = null;
    let prevEpisodeId = null;

    if (type === "tvShow") {
      const firstEp = content.seasons?.[0]?.episodes?.[0];
      videoUrl =
        content.previewVideoUrl ||
        firstEp?.HLS?.["1080p"] ||
        firstEp?.videoUrl ||
        null;
      HLS = firstEp?.HLS || {};
    } 
    
    else if (type === "movie") {
      videoUrl = content.HLS?.master || content.videoUrl || null;
      HLS = content.HLS || {};
    } 
    
    else if (type === "episode") {
      videoUrl =
        content.HLS?.["1080p"] ||
        content.HLS?.["720p"] ||
        content.HLS?.["480p"] ||
        content.videoUrl || null;
      HLS = content.HLS || {};

      // ✅ Only attempt to flatten if seasons is a valid array
      const allEpisodes = Array.isArray(content.seasons)
        ? content.seasons.flatMap(season => season.episodes || [])
        : [];

      const currentIndex = allEpisodes.findIndex(ep => ep.episodeId === id);

      if (currentIndex !== -1) {
        prevEpisodeId = allEpisodes[currentIndex - 1]?.episodeId || null;
        nextEpisodeId = allEpisodes[currentIndex + 1]?.episodeId || null;
      }
    }

    return {
      id: content.id,
      type: content.type,
      title: content.title,
      description: content.description,
      duration: content.duration || null,
      isFree: content.isFree,
      rating: content.rating,
      views: content.views,
      videoUrl,
      HLS,
      transcodedVideo: content.transcodedVideo || '',
      thumbnailUrl: content.thumbnailUrl || '',
      trailerUrl: content.trailerUrl || '',
      posterUrl: content.posterUrl || '',
      pricing: content.pricing || null,
      seasons: content.seasons || [],
      nextEpisodeId,
      prevEpisodeId,
    };
  } catch (error) {
    console.error("❌ Error fetching watch content:", error);
    throw error;
  }
};

export const getEpisodeContextById = async (episodeId) => {
  try {
    const response = await episode.get(`/${episodeId}/context`);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch episode context:", error);
    return {
      success: false,
      message: "Error fetching episode context",
      episode: null,
      nextEpisodeId: null,
      prevEpisodeId: null,
    };
  }
};

export const getNextPrevMediaByGenre = async (type, genre, currentId) => {
  const mediaList = await getTVorMoviesByGenre(type, genre);
  const filteredList = mediaList.filter((item) => item.id !== currentId);

  if (filteredList.length === 0) return { next: null, prev: null };

  const currentIndex = filteredList.findIndex((m) => m.id === currentId);

  // Fallback: if not found, pick random next/prev
  const next = filteredList[currentIndex + 1] || filteredList[0];
  const prev =
    currentIndex > 0 ? filteredList[currentIndex - 1] : filteredList[filteredList.length - 1];

  return {
    next: next?.id || null,
    prev: prev?.id || null,
  };
};







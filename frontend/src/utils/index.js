import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_BASE_URL;  
const API_URL = `${API}/api/v1`; // Backend URL for the API

// Create an Axios instance for the Movies service
const api = axios.create({
  baseURL: `${API_URL}/movies`, // Base URL for movies
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
const BASE_URL = "https://api.themoviedb.org/3";

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

export const getTopratedMedias = async (type) => {
  try {
    const res = await fetch(
      `${BASE_URL}/${type}/top_rated?api_key=${API_KEY}&language=en-US`,
      {
        method: "GET",
      }
    );

    const data = await res.json();

    return data && data.results;
  } catch (e) {
    console.log(e);
  }
};

export const getPopularMedias = async (type) => {
  try {
    const res = await fetch(
      `${BASE_URL}/${type}/popular?api_key=${API_KEY}&language=en-US`,
      {
        method: "GET",
      }
    );

    const data = await res.json();

    return data && data.results;
  } catch (e) {
    console.log(e);
  }
};

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
    const res = await fetch(
      `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US&append_to_response=videos`,
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

export const getSimilarTVorMovies = async (type, id) => {
  try {
    const res = await fetch(
      `${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}&language=en-US`,
      {
        method: "GET",
      }
    );

    const data = await res.json();

    return data && data.results;
  } catch (e) {
    console.log(e);
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
    console.log(`🎬 Fetching watch content: /watch/${type}/${id}`);
    const response = await watch.get(`/${type}/${id}`);

    if (!response.data.success) {
      throw new Error("⚠️ Failed to retrieve video details");
    }

    const content = response.data;

    // Determine videoUrl and HLS source depending on content type
    let videoUrl = null;
    let HLS = {};

    if (type === "tvShow") {
      videoUrl =
        content.previewVideoUrl ||
        content.seasons?.[0]?.episodes?.[0]?.HLS?.["1080p"] ||
        content.seasons?.[0]?.episodes?.[0]?.HLS?.["720p"] ||
        content.seasons?.[0]?.episodes?.[0]?.HLS?.["480p"] ||
        content.seasons?.[0]?.episodes?.[0]?.videoUrl ||
        null;

      HLS = content.seasons?.[0]?.episodes?.[0]?.HLS || {};
    } else {
      videoUrl =
        content.HLS?.["1080p"] ||
        content.HLS?.["720p"] ||
        content.HLS?.["480p"] ||
        content.videoUrl ||
        null;

      HLS = content.HLS || {};
    }

    if (!videoUrl) {
      console.warn("⚠️ No playable video source found.");
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
      videoUrl, // ✅ final HLS or fallback
      HLS,
      thumbnailUrl: content.thumbnailUrl || '',
      trailerUrl: content.trailerUrl || '',
      posterUrl: content.posterUrl || '',
      pricing: content.pricing || null,
      seasons: content.seasons || [], // for tvShow browsing
    };
  } catch (error) {
    console.error("❌ Error fetching watch content:", error);
    throw error;
  }
};



// //-------------------------------
// const BASE_URL= process.env.NEXT_MOVIES_API_BASE_URL 

// // Get trending movies
// export const getTrendingMedias = async () => {
//   const res = await fetch(`${BASE_URL}/trending`);
//   const data = await res.json();
//   return data;
// };

// // Get top rated movies (uses same controller as trending for now)
// export const getTopratedMedias = async () => {
//   const res = await fetch(`${BASE_URL}/top-rated`);
//   const data = await res.json();
//   return data;
// };

// // Get popular movies (also reuses trending for now)
// export const getPopularMedias = async () => {
//   const res = await fetch(`${BASE_URL}/popular`);
//   const data = await res.json();
//   return data;
// };

// export const gettrandingMedias = async () => {
//   const res = await fetch(`${BASE_URL}/popular`);
//   const data = await res.json();
//   return data;
// };

// // Get movies by category/genre (e.g. Action, Comedy)
// export const getTVorMoviesByGenre = async (type, genre) => {
//   const res = await fetch(`${BASE_URL}/category/${genre}`);
//   const data = await res.json();
//   return data.movies || [];
// };

// // Get movie details by ID
// export const getTVorMovieDetailsByID = async (type, id) => {
//   const res = await fetch(`${BASE_URL}/${id}`);
//   const data = await res.json();
//   return data;
// };

// // Get trailers for a movie
// export const getTVorMovieVideosByID = async (type, id) => {
//   const res = await fetch(`${BASE_URL}/${id}/trailers`);
//   const data = await res.json();
//   return data;
// };

// // Get similar movies (related by genres)
// export const getSimilarTVorMovies = async (type, id) => {
//   const res = await fetch(`${BASE_URL}/${id}/related`);
//   const data = await res.json();
//   return data.relatedMovies || [];
// };

// // Search movies by title
// export const getTVorMovieSearchResults = async (type, query) => {
//   const res = await fetch(`${BASE_URL}/search/${encodeURIComponent(query)}`);
//   const data = await res.json();
//   return data;
// };

// // Fetch all movies (can be used for admin or media hub)
// export const getAllMovies = async (page = 1, limit = 20) => {
//   const res = await fetch(`${BASE_URL}?page=${page}&limit=${limit}`);
//   const data = await res.json();
//   return data.movies || [];
// };

// // Get Hero Content (Featured Movie)
// export const getHeroContent = async () => {
//   const res = await fetch(`${BASE_URL}/hero-content`);
//   const data = await res.json();
//   return data;
// };


// // utils/tvShowAPI.js

// const API = process.env.NEXT_TV_API_BASE_URL;
// const TV_ENDPOINT = `${API}`;

// // ----------------------------
// // Discovery / Search
// // ----------------------------
// export const getTrendingTvShows = async () => {
//   const res = await fetch(`${TV_ENDPOINT}/trending`);
//   const data = await res.json();
//   return data;
// };

// export const getTvShowsByCategory = async (category) => {
//   const res = await fetch(`${TV_ENDPOINT}/category/${category}`);
//   const data = await res.json();
//   return data.movies || data; // In case it's wrapped
// };

// export const searchTvShows = async (query) => {
//   const res = await fetch(`${TV_ENDPOINT}/search/${query}`);
//   const data = await res.json();
//   return data;
// };

// // ----------------------------
// // TV Show CRUD + Details
// // ----------------------------
// export const getAllTvShows = async () => {
//   const res = await fetch(`${TV_ENDPOINT}`);
//   const data = await res.json();
//   return data;
// };

// export const getTvShowById = async (id) => {
//   const res = await fetch(`${TV_ENDPOINT}/${id}`);
//   const data = await res.json();
//   return data;
// };

// export const getTvShowOrEpisodeDetails = async (id) => {
//   const res = await fetch(`${TV_ENDPOINT}/${id}/details`);
//   const data = await res.json();
//   return data;
// };

// export const getSimilarTvShows = async (id) => {
//   const res = await fetch(`${TV_ENDPOINT}/${id}/similar`);
//   const data = await res.json();
//   return data;
// };

// export const getTvShowTrailers = async (id) => {
//   const res = await fetch(`${TV_ENDPOINT}/${id}/trailers`);
//   const data = await res.json();
//   return data.trailerUrl || data;
// };

// // ----------------------------
// // Episode Access / CRUD
// // ----------------------------
// export const getEpisodesBySeason = async (tvShowId, seasonNumber) => {
//   const res = await fetch(`${TV_ENDPOINT}/${tvShowId}/seasons/${seasonNumber}/episodes`);
//   const data = await res.json();
//   return data;
// };

// export const getEpisodeDetails = async (tvShowId, seasonNumber, episodeId) => {
//   const res = await fetch(`${TV_ENDPOINT}/${tvShowId}/seasons/${seasonNumber}/episodes/${episodeId}`);
//   const data = await res.json();
//   return data;
// };

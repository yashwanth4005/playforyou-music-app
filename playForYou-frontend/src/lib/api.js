import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
export const TOKEN_STORAGE_KEY = "playforyou-token";
export const USER_STORAGE_KEY = "playforyou-user";

const client = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
});

client.interceptors.request.use((config) => {
  let token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    token = null;
  }
  return config;
});

client.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === "object" && "data" in response.data && "status" in response.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export function resolveMediaUrl(path) {
  if (!path) {
    return "";
  }
  if (path.startsWith("http")) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
}

export function extractErrorMessage(error, fallback = "Something went wrong.") {
  return error?.response?.data?.message || error?.response?.data || error?.message || fallback;
}

export async function registerUser(payload) {
  const { data } = await client.post("/auth/register", payload);
  return data;
}

export async function loginUser(payload) {
  const { data } = await client.post("/auth/login", payload);
  return data;
}

export async function getHomeFeed() {
  const { data } = await client.get("/songs/home");
  return data;
}

export async function getSongs() {
  const { data } = await client.get("/songs");
  return data;
}

export async function searchSongs(query) {
  const { data } = await client.get("/songs/search", { params: { q: query } });
  return data;
}

export async function getSongDetails(songId) {
  const { data } = await client.get(`/songs/${songId}`);
  return data;
}

export async function toggleSongLike(songId) {
  const { data } = await client.post(`/songs/${songId}/like`);
  return data;
}

export async function getCurrentUser() {
  const { data } = await client.get("/users/me");
  return data;
}

export async function getLibrary() {
  const { data } = await client.get("/users/me/library");
  return data;
}

export async function getProfile() {
  const { data } = await client.get("/users/me/profile");
  return data;
}

export async function updateProfile(payload) {
  const { data } = await client.put("/users/me", payload);
  return data;
}

export async function createPlaylist(payload) {
  const { data } = await client.post("/playlists", payload);
  return data;
}

export async function getPlaylists(userId) {
  const { data } = await client.get(`/playlists/${userId}`);
  return data;
}

export async function addSongToPlaylist(playlistId, songId) {
  const { data } = await client.post(`/playlists/${playlistId}/songs/${songId}`);
  return data;
}

export async function removeSongFromPlaylist(playlistId, songId) {
  const { data } = await client.delete(`/playlists/${playlistId}/songs/${songId}`);
  return data;
}

export async function getAdminDashboard() {
  const { data } = await client.get("/admin/dashboard");
  return data;
}

export async function getAdminSongs() {
  const { data } = await client.get("/admin/songs");
  return data;
}

export async function uploadSong(formData) {
  const { data } = await client.post("/admin/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function updateSong(songId, payload) {
  const { data } = await client.put(`/admin/update/${songId}`, payload);
  return data;
}

export async function deleteSong(songId) {
  const { data } = await client.delete(`/admin/delete/${songId}`);
  return data;
}

export async function getPlayerState() {
  const { data } = await client.get("/player/state");
  return data;
}

export async function loadPlayerSong(songId, queue = []) {
  const queueParam = queue.length ? queue.join(",") : "";
  const { data } = await client.post(`/player/load/${songId}`, null, { params: { queue: queueParam } });
  return data;
}

export async function playRemote() {
  const { data } = await client.post("/player/play");
  return data;
}

export async function pauseRemote() {
  const { data } = await client.post("/player/pause");
  return data;
}

export async function nextRemote() {
  const { data } = await client.post("/player/next");
  return data;
}

export async function previousRemote() {
  const { data } = await client.post("/player/previous");
  return data;
}

export async function seekRemote(time) {
  const { data } = await client.post("/player/seek", null, { params: { time } });
  return data;
}

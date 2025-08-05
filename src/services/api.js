import axios from "axios";

const API_BASE_URL = "http://localhost:1212/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle API response format
// This will now return the full ApiResponse object from the backend
// e.g., { status: 200, success: true, data: [...], message: "..." }
api.interceptors.response.use(
  (response) => {
    return response.data; // Return the full response.data (which is your ApiResponse object)
  },
  (error) => {
    console.error("API Error:", error);
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem("currentUser");
      window.location.href = "/login";
    }
    // Propagate the error, including the backend's error message if available
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
);

// User Service
export const userService = {
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  create: (user) => api.post("/users", user),
  update: (id, user) => api.put(`/users/${id}`, user),
  delete: (id) => api.delete(`/users/${id}`),

  // Authentication (now calling backend API directly)
  login: (credentials) => api.post("/users/login", credentials),
  register: (userData) => api.post("/users/register", userData),
  forgotPassword: (email) => api.post("/users/forgot-password", { email }), // Assuming backend expects { email: "..." }
  changePassword: (passwordData) =>
    api.put("/users/change-password", passwordData),
  updateProfile: (profileData) => api.put("/users/profile", profileData),
  // NEW: Upload avatar
  uploadAvatar: (userId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`/users/${userId}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// Video Service
export const videoService = {
  getAll: () => api.get("/videos"),
  getById: (id) => api.get(`/videos/${id}`),
  create: (video) => api.post("/videos", video),
  update: (id, video) => api.put(`/videos/${id}`, video),
  delete: (id) => api.delete(`/videos/${id}`),

  // Specific endpoints for assignment requirements (assuming these exist)
  getTopVideos: (page = 0, size = 6) =>
    api.get(`/videos/top?page=${page}&size=${size}`),
  incrementViews: (id) => api.post(`/videos/${id}/view`),
  getTopActiveVideos: (page = 0, size = 6) =>
    api.get(`/videos/top-active?page=${page}&size=${size}`),
};

// Favorite Service
export const favoriteService = {
  getAll: () => api.get("/favorites"),
  getById: (id) => api.get(`/favorites/${id}`),
  create: (favorite) => api.post("/favorites", favorite),
  update: (id, favorite) => api.put(`/favorites/${id}`, favorite),
  delete: (id) => api.delete(`/favorites/${id}`),

  // User specific favorites (assuming these exist)
  getUserFavorites: (userId) => api.get(`/favorites/user/${userId}`),
  toggleFavorite: (videoId) => api.post(`/favorites/toggle/${videoId}`),
};

// Share Service
export const shareService = {
  getAll: () => api.get("/shares"),
  getById: (id) => api.get(`/shares/${id}`),
  create: (share) => api.post("/shares", share),
  update: (id, share) => api.put(`/shares/${id}`, share),
  delete: (id) => api.delete(`/shares/${id}`),

  // Email sharing (assuming this exists)
  shareByEmail: (videoId, emails) =>
    api.post(`/shares/email/${videoId}`, { emails }),
};

// View History Service
export const viewHistoryService = {
  getAll: () => api.get("/viewhistories"),
  getById: (id) => api.get(`/viewhistories/${id}`),
  create: (viewHistory) => api.post("/viewhistories", viewHistory),
  update: (id, viewHistory) => api.put(`/viewhistories/${id}`, viewHistory),
  delete: (id) => api.delete(`/viewhistories/${id}`),

  // User specific view history (assuming this exists)
  getUserHistory: (userId) => api.get(`/viewhistories/user/${userId}`),
};

// Report Service (for admin, assuming these exist)
export const reportService = {
  getFavoriteStats: () => api.get("/reports/favorites-stats"),
  getFavoritesByVideo: (videoId) =>
    api.get(`/reports/favorites-by-video/${videoId}`),
  getSharesByVideo: (videoId) => api.get(`/reports/shares-by-video/${videoId}`),
  getGeneralStats: () => api.get("/reports/general-stats"),
};

// Comment Service (NEW)
export const commentService = {
  getCommentsByVideoId: (videoId) => api.get(`/comments/video/${videoId}`),
  addComment: (comment) => api.post("/comments", comment),
  deleteComment: (commentId, userId) =>
    api.delete(`/comments/${commentId}?userId=${userId}`),
};

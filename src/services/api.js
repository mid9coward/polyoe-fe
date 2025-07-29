import axios from "axios"

const API_BASE_URL = "http://localhost:1212/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Response interceptor to handle API response format
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error("API Error:", error)
    throw error
  },
)

export const userService = {
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  create: (user) => api.post("/users", user),
  update: (id, user) => api.put(`/users/${id}`, user),
  delete: (id) => api.delete(`/users/${id}`),
}

export const videoService = {
  getAll: () => api.get("/videos"),
  getById: (id) => api.get(`/videos/${id}`),
  create: (video) => api.post("/videos", video),
  update: (id, video) => api.put(`/videos/${id}`, video),
  delete: (id) => api.delete(`/videos/${id}`),
}

export const favoriteService = {
  getAll: () => api.get("/favorites"),
  getById: (id) => api.get(`/favorites/${id}`),
  create: (favorite) => api.post("/favorites", favorite),
  update: (id, favorite) => api.put(`/favorites/${id}`, favorite),
  delete: (id) => api.delete(`/favorites/${id}`),
}

export const shareService = {
  getAll: () => api.get("/shares"),
  getById: (id) => api.get(`/shares/${id}`),
  create: (share) => api.post("/shares", share),
  update: (id, share) => api.put(`/shares/${id}`, share),
  delete: (id) => api.delete(`/shares/${id}`),
}

export const viewHistoryService = {
  getAll: () => api.get("/viewhistories"),
  getById: (id) => api.get(`/viewhistories/${id}`),
  create: (viewHistory) => api.post("/viewhistories", viewHistory),
  update: (id, viewHistory) => api.put(`/viewhistories/${id}`, viewHistory),
  delete: (id) => api.delete(`/viewhistories/${id}`),
}

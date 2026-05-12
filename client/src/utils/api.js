import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});
// Auth
export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const logout = () => api.post("/auth/logout");
export const getMe = () => api.get("/auth/me");

// Equipment
export const getEquipment = () => api.get("/equipment");
export const getEquipmentById = (id) => api.get(`/equipment/${id}`);
export const createEquipment = (data) => api.post("/equipment", data);
export const updateEquipment = (id, data) => api.patch(`/equipment/${id}`, data);
export const assignEquipment = (id, job_site_id) => api.patch(`/equipment/${id}/assign`, { job_site_id });
export const deleteEquipment = (id) => api.delete(`/equipment/${id}`);
export const getJobSites = () => api.get("/equipment/sites");

// Job Sites
export const getSites = () => api.get("/sites");
export const createSite = (data) => api.post("/sites", data);
export const updateSite = (id, data) => api.patch(`/sites/${id}`, data);
export const deleteSite = (id) => api.delete(`/sites/${id}`);

// Images
export const getImages = (params) => api.get("/images", { params });
export const getImageCategories = () => api.get("/images/categories");
export const uploadImage = (formData) => api.post("/images/upload", formData);
export const deleteImage = (id) => api.delete(`/images/${id}`);

// Status logs
export const getStatusLogs = (params) => api.get("/status", { params });
export const createStatusLog = (data) => api.post("/status", data);
export const updateStatusLog = (id, data) => api.patch(`/status/${id}`, data);
export const deleteStatusLog = (id) => api.delete(`/status/${id}`);

export default api;

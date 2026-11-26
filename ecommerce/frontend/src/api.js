// backend address: set VITE_API_URL when deploying, falls back to local backend
export const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

import { api } from "./api";

export const authService = {
  signup: (payload) => api.post("/auth/signup", payload), // {name, email, phone, password, role}
  login: (payload) => api.post("/auth/login", payload), // {email, password}
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  me: () => api.get("/auth/me"),
};

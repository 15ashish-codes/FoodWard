import { api } from "./api";

export const userService = {
  all: (role) => api.get(role ? `/users?role=${role}` : "/users"),
  pending: () => api.get("/users/pending"),
  get: (id) => api.get(`/users/${id}`),
  verify: (id) => api.post(`/users/${id}/verify`),
  reject: (id) => api.post(`/users/${id}/reject`),
  deactivate: (id) => api.post(`/users/${id}/deactivate`),
  activate: (id) => api.post(`/users/${id}/activate`),
};

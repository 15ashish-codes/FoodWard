import { api } from "./api";

export const donationService = {
  // HOTEL
  create: (payload) => api.post("/donations", payload),
  mine: () => api.get("/donations/mine"),
  active: () => api.get("/donations/active"),
  cancel: (id) => api.del(`/donations/${id}`),

  // ORPHANAGE
  nearby: () => api.get("/donations/nearby"),
  accept: (id) => api.post(`/donations/${id}/accept`),
  accepted: () => api.get("/donations/accepted"),

  // ADMIN
  all: () => api.get("/donations"),

  // shared
  get: (id) => api.get(`/donations/${id}`),
};

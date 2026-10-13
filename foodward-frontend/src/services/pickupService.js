import { api } from "./api";

export const pickupService = {
  available: () => api.get("/pickups/available"),
  claim: (donationId) => api.post(`/pickups/${donationId}/claim`),
  updateStatus: (pickupId, stage) => api.patch(`/pickups/${pickupId}/status`, { stage }),
  mine: () => api.get("/pickups/mine"),
  completed: () => api.get("/pickups/completed"),
};

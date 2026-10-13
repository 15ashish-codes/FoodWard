import { api } from "./api";

export const notificationService = {
  list: () => api.get("/notifications"),
  unreadCount: () => api.get("/notifications/unread-count"),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch("/notifications/read-all"),
};

export const profileService = {
  get: () => api.get("/profile"),
  update: (payload) => api.put("/profile", payload), // {name, phone, address}
};

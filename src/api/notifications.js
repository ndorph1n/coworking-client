import apiClient from "./apiClient";

export const fetchNotifications = async () => {
  const res = await apiClient.get("/notifications");
  return res.data;
};

export const deleteNotification = async (id) => {
  await apiClient.patch(`/notifications/${id}/delete`);
};

export const markAsRead = async (id) => {
  await apiClient.patch(`/notifications/${id}/read`);
};

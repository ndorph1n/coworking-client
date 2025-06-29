import apiClient from "./apiClient";

export const fetchMyBookings = async () => {
  const response = await apiClient.get("/bookings/mine");
  return response.data;
};

export const cancelBooking = async (id) => {
  await apiClient.patch(`/bookings/${id}/cancel`);
};

export const getBookingsByWorkspace = async (workspaceId) => {
  const res = await apiClient.get(`/bookings/workspace/${workspaceId}`);
  return res.data;
};

export const createBooking = async (data) => {
  const res = await apiClient.post("/bookings", data);
  return res.data;
};

export const getAllBookings = async () => {
  const res = await apiClient.get("/bookings");
  return res.data;
};

export const extendBooking = async (id, data) => {
  const res = await apiClient.patch(`/bookings/${id}/extend`, data);
  return res.data;
};

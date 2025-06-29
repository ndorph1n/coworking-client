import apiClient from "./apiClient";

// Получить все рабочие места
export const getAllWorkspaces = async () => {
  const res = await apiClient.get("/workspaces");
  return res.data;
};

// Получить все рабочие места для админа
export const getAllWorkspacesAdmin = async () => {
  const res = await apiClient.get("/workspaces/admin");
  return res.data;
};

// Создать новое рабочее место
export const createWorkspace = async (data) => {
  const res = await apiClient.post("/workspaces", data);
  return res.data;
};

// Обновить рабочее место
export const updateWorkspace = async (id, data) => {
  const res = await apiClient.put(`/workspaces/${id}`, data);
  return res.data;
};

// Удалить рабочее место
export const deleteWorkspace = async (id) => {
  const res = await apiClient.delete(`/workspaces/${id}`);
  return res.data;
};

// Получить рабочее место по ID
export const getWorkspaceById = async (id) => {
  const res = await apiClient.get(`/workspaces/${id}`);
  return res.data;
};

// Получить рабочие места по фильтрам
export const getWorkspaces = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const res = await apiClient.get(`/workspaces?${params}`);
  return res.data;
};

// Мягкое удаление
export const handleActivationWorkspace = async (id) => {
  const res = await apiClient.patch(`/workspaces/${id}/activation`);
  return res.data;
};

// Загрузка фотографий рабочего места
export const uploadWorkspaceImages = async (id, formData) => {
  const res = await apiClient.post(`/workspaces/${id}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

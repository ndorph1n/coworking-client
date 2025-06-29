import apiClient from "./apiClient";

export const uploadLayout = async (file) => {
  const formData = new FormData();
  formData.append("layout", file);

  const res = await apiClient.post("/layout", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const fetchLayout = async () => {
  const res = await apiClient.get("/layout", { responseType: "blob" });
  return res.data;
};

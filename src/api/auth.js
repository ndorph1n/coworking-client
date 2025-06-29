import apiClient from "./apiClient";

export const loginUser = async ({ email, password }) => {
  const res = await apiClient.post("/auth/login", { email, password });

  return res.data; // ожидается { user, token }
};

export const registerUser = async ({
  firstName,
  lastName,
  phone,
  email,
  password,
}) => {
  const res = await apiClient.post("/auth/register", {
    firstName,
    lastName,
    phone,
    email,
    password,
  });
  return res.data;
};

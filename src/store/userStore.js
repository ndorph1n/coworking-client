import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const loadInitialUser = () => {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  if (!token || !isTokenValid() || !userRaw) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }

  try {
    return JSON.parse(userRaw);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const useUserStore = create((set) => ({
  user: loadInitialUser(),

  setUser: (userData) => {
    const { token, ...user } = userData;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({ user });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null });
  },
}));

import { create } from "zustand";

export const useModalMessageStore = create((set) => ({
  messages: [],
  showMessage: (text, type = "info") => {
    const id = Date.now() + Math.random(); // уникальный ID
    const message = { id, text, type };

    set((state) => ({
      messages: [...state.messages, message],
    }));

    // Удаление через 2 секунды
    setTimeout(() => {
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== id),
      }));
    }, 2000);
  },
}));

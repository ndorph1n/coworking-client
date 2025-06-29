import { useModalMessageStore } from "../store/modalMessageStore";
import { useEffect, useState } from "react";

export default function ModalMessage() {
  const { messages } = useModalMessageStore();
  const [localMessages, setLocalMessages] = useState([]);

  useEffect(() => {
    messages.forEach((msg) => {
      if (localMessages.length >= 3) return;
      if (!localMessages.find((m) => m.id === msg.id)) {
        // Сначала добавляем сообщение с translateX(100%) (за экраном справа)
        const newMsg = { ...msg, visible: false };
        setLocalMessages((prev) => [...prev, newMsg]);

        // Через небольшой таймаут (10мс) включаем анимацию появления
        setTimeout(() => {
          setLocalMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, visible: true } : m))
          );
        }, 10);

        // Через 2 секунды — начинаем скрывать (анимация исчезновения)
        setTimeout(() => {
          setLocalMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, visible: false } : m))
          );
        }, 2000);

        // Через 2.5 секунды — удаляем из списка
        setTimeout(() => {
          setLocalMessages((prev) => prev.filter((m) => m.id !== msg.id));
        }, 2500);
      }
    });
  }, [localMessages, messages]);

  const bgColors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div className="fixed top-16 right-4 z-50 pointer-events-none space-y-2">
      {localMessages.map((msg) => (
        <div
          key={msg.id}
          className={`absolute top-0 right-0 w-64 px-4 py-2 text-white rounded shadow transition-all duration-500 ease-in-out
            ${bgColors[msg.type] || "bg-blue-500"}
          `}
          style={{
            transform: `translateX(${msg.visible ? "0" : "100%"})`,
            opacity: msg.visible ? 1 : 0,
          }}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}

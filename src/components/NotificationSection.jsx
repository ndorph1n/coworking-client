import { useEffect, useState } from "react";
import {
  fetchNotifications,
  markAsRead,
  deleteNotification,
} from "../api/notifications";
import { useModalMessageStore } from "../store/modalMessageStore";

export default function NotificationSection() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showMessage } = useModalMessageStore();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch {
        showMessage("Не удалось загрузить уведомления", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [showMessage]);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch {
      showMessage("Ошибка при отметке уведомления как прочитанного", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {
      showMessage("Ошибка при удалении уведомления", "error");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Уведомления</h2>
      {loading ? (
        <p>Загрузка...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">Уведомлений пока нет.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`p-4 bg-white shadow rounded-xl border cursor-pointer ${
                n.read ? "" : "border-blue-500"
              }`}
              onClick={() => handleMarkRead(n._id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-900">{n.title}</div>
                  <div className="text-sm text-gray-600">{n.message}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleDateString("ru-RU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // чтобы не сработал markAsRead
                    handleDelete(n._id);
                  }}
                  className="text-red-500 text-xs hover:underline"
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

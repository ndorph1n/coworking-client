import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  fetchNotifications,
  deleteNotification,
  markAsRead,
} from "../api/notifications";
import { FaBell } from "react-icons/fa";

import { useModalMessageStore } from "../store/modalMessageStore";

export default function NotificationBell() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const bellRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();
  const { showMessage } = useModalMessageStore();

  useEffect(() => {
    let timer = null;

    const pollNotifications = async () => {
      try {
        const data = await fetchNotifications();

        const latest = data.filter((n) => !n.read);
        setNotifications(latest);
        setHasUnread(latest.some((n) => !n.read));
      } catch (err) {
        showMessage("Ошибка загрузки уведомлений", "error");
      }
    };

    // Первый запрос
    pollNotifications();

    // Повторяем каждые 15 секунд
    timer = setInterval(pollNotifications, 15000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setHasUnread(
        (prev) => prev && notifications.some((n) => n._id !== id && !n.read)
      );
    } catch {
      showMessage("Не удалось отметить как прочитанное", "error");
    }
  };

  // const handleDelete = async (id) => {
  //   try {
  //     await deleteNotification(id);
  //     setNotifications((prev) => prev.filter((n) => n._id !== id));
  //   } catch {
  //     showMessage("Не удалось удалить уведомление", "error");
  //   }
  // };

  const handleViewAll = () => {
    setShowDropdown(false);
    if (location.pathname === "/profile") {
      const event = new CustomEvent("switchToNotifications");
      window.dispatchEvent(event);
    } else {
      navigate("/profile", { state: { section: "notifications" } });
    }
  };

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        className="relative align-sub cursor-pointer"
      >
        <FaBell className="text-xl text-gray-700" />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-xl p-4 z-50">
          <h4 className="text-sm font-semibold mb-2">Последние уведомления</h4>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">Уведомлений нет</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {notifications.map((n) => (
                <li
                  key={n._id}
                  className={`border p-2 rounded cursor-pointer ${
                    n.read ? "bg-gray-50" : "bg-blue-50 border-blue-300"
                  }`}
                  onClick={() => handleMarkRead(n._id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{n.title}</div>
                      <div className="text-xs text-gray-600">{n.message}</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        handleMarkRead(n._id);
                        setNotifications((prev) =>
                          prev.filter((noti) => noti._id !== n._id)
                        );
                      }}
                      className="text-red-500 text-xs hover:underline cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={handleViewAll}
            className="block text-blue-600 text-sm mt-4 hover:underline cursor-pointer"
          >
            Посмотреть все
          </button>
        </div>
      )}
    </div>
  );
}

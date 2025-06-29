import { useState, useEffect } from "react";
import BookingSection from "../components/BookingSection";
import UserDataSection from "../components/UserDataSection";
import { useUserStore } from "../store/userStore";
import { useLocation } from "react-router-dom";
import NotificationSection from "../components/NotificationSection";

export default function ProfilePage() {
  const { user } = useUserStore();
  const location = useLocation();
  const initialSection = location.state?.section || "bookings";
  const [section, setSection] = useState(initialSection);

  useEffect(() => {
    const handler = () => {
      setSection("notifications");
    };
    window.addEventListener("switchToNotifications", handler);
    return () => window.removeEventListener("switchToNotifications", handler);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Личный кабинет</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Боковое меню */}
        <aside className="w-full md:w-1/4">
          <div className="flex md:flex-col gap-4">
            <button
              onClick={() => setSection("bookings")}
              className={`w-full text-left px-4 py-2 rounded cursor-pointer ${
                section === "bookings" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Мои бронирования
            </button>
            <button
              onClick={() => setSection("userdata")}
              className={`w-full text-left px-4 py-2 rounded cursor-pointer ${
                section === "userdata" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Мои данные
            </button>
            <button
              onClick={() => setSection("notifications")}
              className={`w-full text-left px-4 py-2 rounded cursor-pointer ${
                section === "notifications"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Уведомления
            </button>
          </div>
        </aside>

        {/* Контентная часть */}
        <section className="flex-grow">
          {section === "bookings" && <BookingSection />}
          {section === "userdata" && <UserDataSection user={user} />}
          {section === "notifications" && <NotificationSection />}
        </section>
      </div>
    </div>
  );
}

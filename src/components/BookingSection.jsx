import { useEffect, useState } from "react";
import { fetchMyBookings, cancelBooking } from "../api/bookings";
import { useModalMessageStore } from "../store/modalMessageStore";

export default function BookingSection() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showMessage } = useModalMessageStore();

  const now = new Date();

  const isPast = (booking) => new Date(booking.date + "T" + booking.endTime) < now;

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
      );
    } catch {
      showMessage("Ошибка при отмене бронирования", "error");
    }
  };

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchMyBookings();
        setBookings(data);
      } catch {
        showMessage("Не удалось загрузить бронирования", "error");
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, [showMessage]);

  const getStatus = (st) => {
    switch (st) {
      case "cancelled":
        return "Отменено";
      case "completed":
        return "Завершено";
      default:
        return "Активно";
    }
  };

  const currentBookings = bookings.filter((b) => b.status === "active");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");
  const pastBookings = bookings.filter((b) => isPast(b));

  const renderCard = (b) => (
    <li key={b._id} className="border p-4 rounded-xl bg-white shadow-sm space-y-2">
      <div className="text-lg font-medium text-gray-800">
        {b.workspace?.name || "Рабочее место"}
      </div>
      <div className="text-sm text-gray-600">
        <strong>Дата:</strong> {new Date(b.date).toLocaleDateString()}
        <br />
        <strong>Время:</strong> {b.startTime} – {b.endTime}
        <br />
        <strong>Статус:</strong> {getStatus(b.status)}
      </div>
      {b.status == "active" && !isPast(b) && (
        <button
          onClick={() => handleCancel(b._id)}
          className="mt-2 px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
        >
          Отменить
        </button>
      )}
    </li>
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Мои бронирования</h2>
      {loading ? (
        <p className="text-gray-500">Загрузка...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-600">У вас пока нет бронирований.</p>
      ) : (
        <>
          {currentBookings.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mb-2 text-blue-700">
                Актуальные
              </h3>
              <ul className="space-y-4 mb-8">{currentBookings.map(renderCard)}</ul>
            </>
          )}
          {pastBookings.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mb-2 text-gray-500">Прошедшие</h3>
              <ul className="space-y-4">{pastBookings.map(renderCard)}</ul>
            </>
          )}
          {cancelledBookings.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mb-2 text-gray-500">
                Отмененные
              </h3>
              <ul className="space-y-4">{cancelledBookings.map(renderCard)}</ul>
            </>
          )}
        </>
      )}
    </div>
  );
}

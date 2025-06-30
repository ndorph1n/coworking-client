import { useEffect, useState, useMemo } from "react";
import { getWorkspaceById } from "../api/workspaces";
import { getBookingsByWorkspace, createBooking } from "../api/bookings";
import { useUserStore } from "../store/userStore";
import { useModalMessageStore } from "../store/modalMessageStore";
import { toMinutes } from "../utils/time";
import BookingTimeline from "./BookingTimeline";
import dayjs from "dayjs";

const hours = Array.from({ length: 15 }, (_, i) => i + 8); // от 08 до 22
const minutes = [0, 15, 30, 45];

const getToday = () => dayjs().format("YYYY-MM-DD");

function TimeSelect({ label, time, onChange, title }) {
  const [hour, minute] = time.split(":").map(Number);

  const handleHourChange = (e) => {
    const newHour = e.target.value;
    onChange(`${newHour}:${String(minute).padStart(2, "0")}`);
  };

  const handleMinuteChange = (e) => {
    const newMinute = e.target.value;
    onChange(`${String(hour).padStart(2, "0")}:${newMinute}`);
  };

  return (
    <div className="flex gap-2 items-center" title={title}>
      <label className="text-sm w-24">{label}</label>
      <select
        value={String(hour).padStart(2, "0")}
        onChange={handleHourChange}
        className="border p-1 rounded"
      >
        {hours.map((h) => (
          <option key={h} value={String(h).padStart(2, "0")}>
            {String(h).padStart(2, "0")}
          </option>
        ))}
      </select>
      <span>:</span>
      <select
        value={String(minute).padStart(2, "0")}
        onChange={handleMinuteChange}
        className="border p-1 rounded"
      >
        {minutes.map((m) => (
          <option key={m} value={String(m).padStart(2, "0")}>
            {String(m).padStart(2, "0")}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function WorkspaceModal({ workspaceId, onClose }) {
  const { user } = useUserStore();
  const { showMessage } = useModalMessageStore();
  const [workspace, setWorkspace] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [form, setForm] = useState({
    date: getToday(),
    startTime: "08:00",
    endTime: "08:00",
    isFlexible: false,
    flexibilityRange: 0,
  });

  const spaceTypes = {
    desk: "Стол",
    meeting_room: "Переговорная",
    office: "Офис",
  };

  const duration = useMemo(() => {
    const toMinutes = (timeStr) => {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };
    const start = toMinutes(form.startTime);
    const end = toMinutes(form.endTime);
    return Math.max(end - start, 0);
  }, [form.startTime, form.endTime]);

  useEffect(() => {
    const fetchData = async () => {
      const ws = await getWorkspaceById(workspaceId);
      setWorkspace(ws);
      const bks = await getBookingsByWorkspace(workspaceId);
      setBookings(bks);
    };
    fetchData();
  }, [workspaceId]);

  useEffect(() => {
    if (form.startTime && form.endTime) {
      const start = toMinutes(form.startTime);
      const end = toMinutes(form.endTime);
      const duration = end - start;

      if (duration < 180 && form.isFlexible) {
        // Автоматическое отключение гибкого бронирования
        setForm((prev) => ({
          ...prev,
          isFlexible: false,
          flexibilityRange: 15,
        }));
      }
    }
  }, [form.startTime, form.endTime, form.isFlexible]);

  const calculateTotalPrice = () => {
    if (!form.startTime || !form.endTime || !workspace) return 0;

    if (duration < 60) return 0;

    const flexMins = form.isFlexible ? form.flexibilityRange : 0;
    const baseMinutes = Math.max(duration - flexMins, 0);
    const flexMinutes = Math.min(flexMins, duration);

    const baseCost = (baseMinutes / 60) * workspace.pricePerHour;
    const flexCost = (flexMinutes / 60) * workspace.pricePerHour * 0.5;

    return Math.round(baseCost + flexCost);
  };

  const totalPrice = useMemo(calculateTotalPrice, [
    form.startTime,
    form.endTime,
    form.isFlexible,
    form.flexibilityRange,
    workspace,
    duration,
  ]);

  const handleBooking = async () => {
    if (!user) {
      showMessage("Для бронирования необходимо авторизоваться.", "error");
      return;
    }

    if (!form.date || !form.startTime || !form.endTime) {
      showMessage("Пожалуйста, заполните все поля.", "error");
      return;
    }

    if (form.startTime >= form.endTime) {
      showMessage("Время начала должно быть раньше окончания.", "error");
      return;
    }

    if (duration < 60) {
      showMessage("Минимальная длительность бронирования — 1 час.", "error");
      return;
    }

    const bookingData = {
      workspace,
      userId: user._id,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      isFlexible: form.isFlexible,
      flexibilityRange: form.isFlexible ? form.flexibilityRange : 0,
      price: totalPrice,
    };

    try {
      await createBooking(bookingData);
      const updated = await getBookingsByWorkspace(workspaceId);
      setBookings(updated);
      showMessage("Бронирование успешно создано!", "success");
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Ошибка при бронировании", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-2">
      <div className="bg-white rounded-md p-6 max-w-xl w-full max-h-[92vh] overflow-y-auto relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-1 right-2 text-gray-500 hover:text-black text-lg cursor-pointer"
        >
          ✕
        </button>

        {!workspace ? (
          <p>Загрузка...</p>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-2">{workspace.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{workspace.description}</p>
            <p className="text-sm">Тип: {spaceTypes[workspace.type]}</p>
            <p className="text-sm">Цена: {workspace.pricePerHour}₽/час</p>
            <p className="text-sm">Вместимость: {workspace.capacity}</p>
            <p className="text-sm mb-2">
              Особенности: {workspace.features?.join(", ") || "нет"}
            </p>

            {workspace.images?.length > 0 && (
              <div className="flex gap-2 mb-4 overflow-x-auto h-[250px] rounded-md overflow-y-hidden">
                {workspace.images.map((img, index) => (
                  <img
                    key={index}
                    src={import.meta.env.VITE_BASE_URL + `${img}`}
                    alt={`Фото ${index + 1}`}
                    className="h-72 rounded"
                  />
                ))}
              </div>
            )}

            {/* Форма бронирования */}
            {user ? (
              <>
                {/* Временная шкала */}
                <div className="mb-4">
                  <h3 className="font-semibold mb-1">Занятое время:</h3>
                  <BookingTimeline bookings={bookings} date={form.date} />
                </div>
                <h3 className="font-semibold mb-2">Новое бронирование:</h3>
                <div className="flex flex-col gap-2 mb-2">
                  <input
                    type="date"
                    value={form.date}
                    min={getToday()}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className="border p-2 rounded"
                    title="Выберите дату бронирования"
                  />

                  <TimeSelect
                    label="Начало"
                    time={form.startTime}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, startTime: value }))
                    }
                    title="Время начала бронирования"
                  />

                  <TimeSelect
                    label="Окончание"
                    time={form.endTime}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, endTime: value }))
                    }
                    title="Время окончания бронирования"
                  />

                  <label
                    className="text-sm flex items-center gap-2 cursor-help"
                    title={
                      duration < 180
                        ? "Опция доступна при длительности бронирования от 3 часов"
                        : "Система сможет изменить данное бронирование в случае возникновения пересечений с другими бронированиями"
                    }
                  >
                    <input
                      type="checkbox"
                      checked={form.isFlexible && duration >= 180}
                      disabled={duration < 180}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          isFlexible: e.target.checked,
                        }))
                      }
                    />
                    Гибкое бронирование{" "}
                    <span className="text-xs text-gray-500">
                      (скидка 50% на гибкий интервал)
                    </span>
                  </label>

                  {form.isFlexible && duration >= 180 && (
                    <div
                      className="flex items-center gap-2"
                      title="Укажите максимальное смещение в минутах (15-60)"
                    >
                      <label className="text-sm w-48">Гибкий интервал (мин): </label>
                      <input
                        type="number"
                        step={15}
                        value={form.flexibilityRange}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            flexibilityRange: Math.max(
                              15,
                              Math.min(60, +e.target.value)
                            ),
                          }))
                        }
                        min={15}
                        max={60}
                        className="border p-2 rounded w-24"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-lg font-medium">Итого: {totalPrice}₽</div>
                  <button
                    onClick={handleBooking}
                    className=" cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    disabled={!form.startTime || !form.endTime}
                  >
                    Забронировать
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={handleBooking}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
              >
                Забронировать
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { getAllBookings, cancelBooking, extendBooking } from "../../api/bookings";

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    query: "",
    date: "",
    workspace: "",
  });
  const [extendTarget, setExtendTarget] = useState(null);
  const [newTimes, setNewTimes] = useState({ startTime: "", endTime: "" });

  const fetchData = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
      setFiltered(data);
    } catch {
      alert("Ошибка загрузки бронирований");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [filters]);

  const handleFilter = () => {
    let result = [...bookings];
    const q = filters.query.toLowerCase();

    if (filters.query) {
      result = result.filter(
        (b) =>
          `${b.user?.firstName} ${b.user?.lastName}`.toLowerCase().includes(q) ||
          b.user?.email?.toLowerCase().includes(q)
      );
    }
    if (filters.date) {
      result = result.filter((b) => b.date?.startsWith(filters.date));
    }
    if (filters.workspace) {
      result = result.filter((b) =>
        b.workspace?.name?.toLowerCase().includes(filters.workspace.toLowerCase())
      );
    }

    result.sort((a, b) => {
      const dateA = `${a.date} ${a.startTime}`;
      const dateB = `${b.date} ${b.startTime}`;
      return new Date(dateA) - new Date(dateB);
    });
    setFiltered(result);
  };

  const handleCancel = async (id) => {
    if (confirm("Вы уверены, что хотите отменить это бронирование?")) {
      try {
        await cancelBooking(id);
        fetchData();
      } catch {
        alert("Не удалось отменить бронирование");
      }
    }
  };

  const handleExtend = async () => {
    if (!newTimes.startTime || !newTimes.endTime) return;

    try {
      await extendBooking(extendTarget, newTimes);
      setExtendTarget(null);
      setNewTimes({ startTime: "", endTime: "" });
      fetchData();
    } catch {
      alert("Не удалось продлить бронирование");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Управление бронированиями</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Поиск по имени или email"
          value={filters.query}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          className="border px-3 py-2 rounded w-64"
        />
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Фильтр по рабочему месту"
          value={filters.workspace}
          onChange={(e) => setFilters({ ...filters, workspace: e.target.value })}
          className="border px-3 py-2 rounded w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Пользователь</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Телефон</th>
              <th className="p-2 border">Рабочее место</th>
              <th className="p-2 border">Дата</th>
              <th className="p-2 border">Время</th>
              <th className="p-2 border">Гибкость</th>
              <th className="p-2 border">Статус</th>
              <th className="p-2 border">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => {
              const isDisabled = b.status !== "active";

              return (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    {b.user?.firstName} {b.user?.lastName}
                  </td>
                  <td className="p-2 border">{b.user?.email}</td>
                  <td className="p-2 border">{b.user?.phone || "—"}</td>
                  <td className="p-2 border">{b.workspace?.name}</td>
                  <td className="p-2 border">{b.date?.split("T")[0]}</td>
                  <td className="p-2 border">
                    {b.startTime} – {b.endTime}
                  </td>
                  <td className="p-2 border">
                    {b.flexibilityRange ? `${b.flexibilityRange} мин` : "—"}
                  </td>
                  <td className="p-2 border">{b.status}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      disabled={isDisabled}
                      onClick={() => handleCancel(b._id)}
                      className={`text-red-600 hover:underline disabled:text-gray-400`}
                    >
                      Отменить
                    </button>
                    <button
                      disabled={isDisabled}
                      onClick={() => {
                        setExtendTarget(b._id);
                        setNewTimes({
                          startTime: b.startTime,
                          endTime: b.endTime,
                        });
                      }}
                      className="text-blue-600 hover:underline disabled:text-gray-400"
                    >
                      Продлить
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {extendTarget && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Продлить бронирование</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Начало</label>
                <input
                  type="time"
                  value={newTimes.startTime}
                  onChange={(e) =>
                    setNewTimes({ ...newTimes, startTime: e.target.value })
                  }
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Окончание</label>
                <input
                  type="time"
                  value={newTimes.endTime}
                  onChange={(e) =>
                    setNewTimes({ ...newTimes, endTime: e.target.value })
                  }
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setExtendTarget(null)}
                className="text-gray-600 hover:underline"
              >
                Отмена
              </button>
              <button
                onClick={handleExtend}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Продлить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

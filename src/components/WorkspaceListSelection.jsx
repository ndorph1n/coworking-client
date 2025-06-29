import { useEffect, useState, useMemo } from "react";
import WorkspaceModal from "./WorkspaceModal";
import { getWorkspaces } from "../api/workspaces";

export default function WorkspaceListSection() {
  const [filters, setFilters] = useState({
    type: "",
    priceMin: "",
    priceMax: "",
    capacityMin: "",
    capacityMax: "",
    features: [],
  });

  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);

  const spaceTypes = {
    desk: "Стол",
    meeting_room: "Переговорная",
    office: "Офис",
  };

  useEffect(() => {
    const fetchData = async () => {
      const filtered = { ...filters };
      Object.keys(filtered).forEach((key) => {
        if (filtered[key] === "" || filtered[key]?.length === 0) {
          delete filtered[key];
        }
      });

      const data = await getWorkspaces(filtered);
      setWorkspaces(data);
    };

    fetchData();
  }, [filters]);

  const handleFeatureToggle = (feature) => {
    setFilters((prev) => {
      const features = prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature];
      return { ...prev, features };
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 my-8 w-full max-w-6xl px-4">
      {/* Фильтры */}
      <div className="md:w-1/4 w-full border rounded p-4 shadow h-fit">
        <h3 className="text-lg font-semibold mb-4">Фильтры</h3>

        <select
          value={filters.type}
          onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
          className="border p-2 rounded w-full mb-3"
        >
          <option value="">Все типы</option>
          <option value="desk">Стол</option>
          <option value="meeting_room">Переговорная</option>
          <option value="office">Офис</option>
        </select>

        <input
          type="number"
          placeholder="Мин. цена"
          value={filters.priceMin}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, priceMin: e.target.value }))
          }
          className="border p-2 rounded w-full mb-3"
        />
        <input
          type="number"
          placeholder="Макс. цена"
          value={filters.priceMax}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, priceMax: e.target.value }))
          }
          className="border p-2 rounded w-full mb-3"
        />
        <input
          type="number"
          placeholder="Мин. вместимость"
          value={filters.capacityMin}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, capacityMin: e.target.value }))
          }
          className="border p-2 rounded w-full mb-3"
        />
        <input
          type="number"
          placeholder="Макс. вместимость"
          value={filters.capacityMax}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, capacityMax: e.target.value }))
          }
          className="border p-2 rounded w-full mb-3"
        />

        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Особенности</p>
          {["Wi-Fi", "Проектор", "Доска для заметок"].map((feature) => (
            <label key={feature} className="block text-sm mb-1">
              <input
                type="checkbox"
                checked={filters.features.includes(feature)}
                onChange={() => handleFeatureToggle(feature)}
                className="mr-1 cursor-pointer"
              />
              {feature}
            </label>
          ))}
        </div>
      </div>

      {/* Список мест */}
      <div className="md:w-3/4 w-full flex flex-col gap-4">
        {workspaces.length === 0 && (
          <p className="text-gray-500">Нет подходящих рабочих мест.</p>
        )}
        {workspaces.map((w) => (
          <div key={w._id} className="border rounded shadow p-4 flex flex-col gap-1">
            <h3 className="text-lg font-bold">{w.name}</h3>
            <p className="text-sm text-gray-600">{w.description}</p>
            <p className="text-sm">Тип: {spaceTypes[w.type]}</p>
            <p className="text-sm">Цена: {w.pricePerHour}₽/час</p>
            <p className="text-sm">Вместимость: {w.capacity}</p>
            <p className="text-sm">Особенности: {w.features?.join(", ") || "нет"}</p>
            <button
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded self-start cursor-pointer"
              onClick={() => setSelectedWorkspaceId(w._id)}
            >
              Подробнее
            </button>
          </div>
        ))}
      </div>

      {/* Модалка */}
      {selectedWorkspaceId && (
        <WorkspaceModal
          workspaceId={selectedWorkspaceId}
          onClose={() => setSelectedWorkspaceId(null)}
        />
      )}
    </div>
  );
}

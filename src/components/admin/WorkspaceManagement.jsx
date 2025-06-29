import { useEffect, useState } from "react";
import {
  getAllWorkspacesAdmin,
  deleteWorkspace,
  handleActivationWorkspace,
} from "../../api/workspaces";
import WorkspaceEditorModal from "./WorkspaceEditorModal";
import PlanEditorModal from "./PlanEditorModal";

export default function WorkspaceManagement() {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getAllWorkspacesAdmin();
      setWorkspaces(data);
    } catch {
      alert("Ошибка при загрузке рабочих мест");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleActivation = async (id, isActive) => {
    console.log("handle");
    if (isActive) {
      if (confirm("Деактивировать это рабочее место?")) {
        await handleActivationWorkspace(id);
        fetchData();
      }
    } else {
      if (confirm("Активировать это рабочее место?")) {
        await handleActivationWorkspace(id);
        fetchData();
      }
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Удалить это рабочее место навсегда?")) {
      await deleteWorkspace(id);
      fetchData();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Управление рабочими местами</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => {
            setSelectedWorkspace(null);
            setIsEditorOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Добавить рабочее место
        </button>

        <button
          onClick={() => setShowPlanModal(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Редактировать размещение на плане
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Название</th>
              <th className="border p-2 text-left">Описание</th>
              <th className="border p-2 text-left">Тип</th>
              <th className="border p-2 text-left">Цена</th>
              <th className="border p-2 text-left">Вместимость</th>
              <th className="border p-2 text-left">Координаты</th>
              <th className="border p-2 text-left">Особенности</th>
              <th className="border p-2 text-left">Фотографии</th>
              <th className="border p-2 text-left">Активно</th>
              <th className="border p-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {workspaces.map((w) => (
              <tr key={w._id}>
                <td className="border p-2">{w.name}</td>
                <td className="border p-2">{w.description || "-"}</td>
                <td className="border p-2">{w.type}</td>
                <td className="border p-2">{w.pricePerHour} ₽</td>
                <td className="border p-2">{w.capacity}</td>
                <td className="border p-2">
                  {w.coordinates?.x}, {w.coordinates?.y}
                </td>
                <td className="border p-2">
                  {(w.features || []).join(", ") || "-"}
                </td>
                <td className="border p-2">
                  {(w.images || []).map((url, idx) => (
                    <a
                      key={idx}
                      href={import.meta.env.VITE_BASE_URL + url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline block"
                    >
                      Фото {idx + 1}
                    </a>
                  )) || "-"}
                </td>
                <td className="border p-2">{w.isActive ? "Да" : "Нет"}</td>
                <td className="border p-2 space-y-1">
                  <button
                    onClick={() => {
                      setSelectedWorkspace(w);
                      setIsEditorOpen(true);
                    }}
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs block w-full"
                  >
                    Редактировать
                  </button>
                  {w.isActive ? (
                    <button
                      onClick={() => handleActivation(w._id, true)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded text-xs block w-full"
                    >
                      Деактивировать
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivation(w._id, false)}
                      className="px-2 py-1 bg-green-600 text-white rounded text-xs block w-full"
                    >
                      Активировать
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(w._id)}
                    className="px-2 py-1 bg-red-600 text-white rounded text-xs block w-full"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модалки */}
      {isEditorOpen && (
        <WorkspaceEditorModal
          workspace={selectedWorkspace}
          onClose={() => setIsEditorOpen(false)}
          onSave={fetchData}
        />
      )}

      {showPlanModal && <PlanEditorModal onClose={() => setShowPlanModal(false)} />}
    </div>
  );
}

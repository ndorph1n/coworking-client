import { useState, useRef } from "react";
import {
  createWorkspace,
  updateWorkspace,
  uploadWorkspaceImages,
} from "../../api/workspaces";

export default function WorkspaceEditorModal({ workspace, onClose, onSave }) {
  const isEdit = Boolean(workspace);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: workspace?.name || "",
    description: workspace?.description || "",
    type: workspace?.type || "desk",
    pricePerHour: workspace?.pricePerHour || 0,
    capacity: workspace?.capacity || 1,
    features: workspace?.features?.join(", ") || "",
  });
  const [images, setImages] = useState([]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      alert("Можно загрузить не более 5 изображений.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setImages(files.slice(0, 5));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...form,
      features: form.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    };

    try {
      let workspaceId;

      if (isEdit) {
        await updateWorkspace(workspace._id, data);
        workspaceId = workspace._id;
      } else {
        const created = await createWorkspace(data);
        workspaceId = created._id;
      }

      // Загружаем изображения, если выбраны
      if (images.length > 0 && workspaceId) {
        const formData = new FormData();
        images.forEach((file) => formData.append("images", file));
        await uploadWorkspaceImages(workspaceId, formData);
      }

      onSave();
      onClose();
    } catch (error) {
      alert("Ошибка при сохранении");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-xl relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-2xl text-gray-600 hover:text-black"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Редактировать" : "Добавить"} рабочее место
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Название</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Описание</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Тип</label>
            <select
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="desk">Стол</option>
              <option value="meeting_room">Переговорка</option>
              <option value="office">Офис</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Цена в час (₽)</label>
            <input
              type="number"
              value={form.pricePerHour}
              onChange={(e) => handleChange("pricePerHour", e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Вместимость</label>
            <input
              type="number"
              value={form.capacity}
              onChange={(e) => handleChange("capacity", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Особенности (через запятую)
            </label>
            <input
              type="text"
              value={form.features}
              onChange={(e) => handleChange("features", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Фотографии (до 5)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isEdit ? "Сохранить изменения" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

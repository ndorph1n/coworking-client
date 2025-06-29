import { useState, useEffect } from "react";
import { uploadLayout, fetchLayout } from "../../api/layout";

export default function LayoutManagement() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchLayout()
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      })
      .catch(() => setPreviewUrl(""));
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      await uploadLayout(file);
      alert("План успешно загружен");
      const blob = await fetchLayout();
      setPreviewUrl(URL.createObjectURL(blob));
      setFile(null);
    } catch {
      alert("Ошибка при загрузке плана");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">План помещения</h2>

      {previewUrl ? (
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-1">Текущий план:</p>
          <img
            src={previewUrl}
            alt="План помещения"
            className="max-w-full max-h-[400px] border rounded"
          />
        </div>
      ) : (
        <p className="text-gray-500 mb-4">План пока не загружен.</p>
      )}

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Загрузить новый план</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 rounded w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Загрузить
        </button>
      </form>
    </div>
  );
}

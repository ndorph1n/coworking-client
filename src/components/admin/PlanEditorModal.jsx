import { useEffect, useState, useRef } from "react";
import { getAllWorkspaces, updateWorkspace } from "../../api/workspaces";
import { fetchLayout } from "../../api/layout";
import { getWorkspaceIconByType } from "../../utils/getWorkspaceIconByType";

export default function PlanEditorModal({ onClose }) {
  const [layoutUrl, setLayoutUrl] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const blob = await fetchLayout();
      const url = URL.createObjectURL(blob);
      setLayoutUrl(url);

      const data = await getAllWorkspaces();
      setWorkspaces(data.filter((w) => w.isActive));
    };
    fetchData();
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (imageRef.current) {
        setImageSize({
          width: imageRef.current.offsetWidth,
          height: imageRef.current.offsetHeight,
        });
      }
    };

    const observer = new ResizeObserver(updateSize);
    if (imageRef.current) observer.observe(imageRef.current);

    return () => observer.disconnect();
  }, [layoutUrl]);

  const handleSave = async () => {
    try {
      await Promise.all(
        workspaces.map((w) => updateWorkspace(w._id, { coordinates: w.coordinates }))
      );
      alert("Координаты сохранены");
      onClose();
    } catch (error) {
      console.error("Ошибка при сохранении координат", error);
      alert("Ошибка при сохранении");
    }
  };

  const startDrag = (e, id) => {
    e.preventDefault();

    const icon = e.currentTarget;
    const imageRect = imageRef.current.getBoundingClientRect();
    const iconRect = icon.getBoundingClientRect();

    const shiftX = e.clientX - iconRect.left;
    const shiftY = e.clientY - iconRect.top;

    const onMouseMove = (moveEvent) => {
      const relX = moveEvent.clientX - imageRect.left - shiftX;
      const relY = moveEvent.clientY - imageRect.top - shiftY;

      const percentX = (relX / imageRect.width) * 100;
      const percentY = (relY / imageRect.height) * 100;

      setWorkspaces((prev) =>
        prev.map((w) =>
          w._id === id ? { ...w, coordinates: { x: percentX, y: percentY } } : w
        )
      );
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded relative w-[95%] max-h-[95vh] shadow-lg flex flex-col overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-gray-600 hover:text-black z-10"
        >
          &times;
        </button>

        <div className="p-4 overflow-auto">
          <h2 className="text-xl font-bold mb-4">Редактирование плана</h2>

          <div
            ref={containerRef}
            className="relative w-full max-w-[1000px] aspect-video border mx-auto"
          >
            {layoutUrl && (
              <img
                ref={imageRef}
                src={layoutUrl}
                alt="План помещения"
                className="w-full h-auto block"
              />
            )}

            {workspaces.map((w) => {
              const pxX = (w.coordinates?.x / 100) * imageSize.width;
              const pxY = (w.coordinates?.y / 100) * imageSize.height;

              return (
                <div
                  key={w._id}
                  className="absolute cursor-move text-blue-700"
                  style={{
                    left: `${pxX}px`,
                    top: `${pxY}px`,
                  }}
                  onMouseDown={(e) => startDrag(e, w._id)}
                  title={w.name}
                >
                  {getWorkspaceIconByType(w.type, 24, "text-blue-700")}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

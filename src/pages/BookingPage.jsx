import { useEffect, useRef, useState } from "react";
import { fetchLayout } from "../api/layout";
import { getAllWorkspaces } from "../api/workspaces";
import { getWorkspaceIconByType } from "../utils/getWorkspaceIconByType";
import WorkspaceModal from "../components/WorkspaceModal";
import ZoomableContainer from "../components/ZoomableContainer";
import WorkspaceListSelection from "../components/WorkspaceListSelection";

export default function BookingPage() {
  const [layoutUrl, setLayoutUrl] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const imageRef = useRef(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);

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
      const img = imageRef.current;
      if (img) {
        setImageSize({
          width: img.offsetWidth,
          height: img.offsetHeight,
        });
      }
    };
    const resizeObserver = new ResizeObserver(updateSize);
    if (imageRef.current) {
      resizeObserver.observe(imageRef.current);
    }
    return () => {
      if (imageRef.current) {
        resizeObserver.disconnect();
      }
    };
  }, [layoutUrl]);

  const handleOpenModal = (id) => {
    setSelectedWorkspaceId(id);
  };

  return (
    <div className="flex flex-col min-h-screen items-center">
      <h1 className="text-2xl font-bold my-4">Выберите рабочее место</h1>

      <div className="rounded-sm w-full max-w-[1120px] border overflow-hidden">
        {layoutUrl && (
          <ZoomableContainer>
            <div className="relative w-full h-auto">
              <img
                ref={imageRef}
                src={layoutUrl}
                alt="План помещения"
                className="w-full h-auto block select-none pointer-events-none"
              />

              {workspaces.map((w) => {
                const pxX = (w.coordinates?.x / 100) * imageSize.width;
                const pxY = (w.coordinates?.y / 100) * imageSize.height;

                return (
                  <div
                    key={w._id}
                    className="absolute text-green-700 hover:scale-110 transition-transform cursor-pointer"
                    style={{
                      left: `${pxX}px`,
                      top: `${pxY}px`,
                    }}
                    title={w.name}
                    onClick={() => handleOpenModal(w._id)}
                  >
                    {getWorkspaceIconByType(w.type, 22, "text-green-700")}
                  </div>
                );
              })}
            </div>
          </ZoomableContainer>
        )}
      </div>

      <WorkspaceListSelection />

      {selectedWorkspaceId && (
        <WorkspaceModal
          workspaceId={selectedWorkspaceId}
          onClose={() => setSelectedWorkspaceId(null)}
        />
      )}
    </div>
  );
}

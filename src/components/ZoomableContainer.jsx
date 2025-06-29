import { useRef, useState, useEffect } from "react";
import { IoIosRefresh } from "react-icons/io";

export default function ZoomableContainer({ children }) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  const [touchStartDistance, setTouchStartDistance] = useState(null);
  const [touchStartMidpoint, setTouchStartMidpoint] = useState(null);
  const [startTranslate, setStartTranslate] = useState(null);

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  const MIN_SCALE = 0.8;
  const MAX_SCALE = 3;

  const clampTranslate = (newTranslate) => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return newTranslate;

    const containerRect = container.getBoundingClientRect();
    const contentWidth = content.offsetWidth * scale;
    const contentHeight = content.offsetHeight * scale;

    const MARGIN = 50;

    const maxOffsetX = Math.max((contentWidth - containerRect.width) / 2, MARGIN);
    const maxOffsetY = Math.max((contentHeight - containerRect.height) / 2, MARGIN);

    return {
      x: clamp(newTranslate.x, -maxOffsetX, maxOffsetX),
      y: clamp(newTranslate.y, -maxOffsetY, maxOffsetY),
    };
  };

  // Масштабирование колесиком
  useEffect(() => {
    const container = containerRef.current;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newScale = clamp(scale + delta, MIN_SCALE, MAX_SCALE);
      setScale(newScale);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [scale]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPosition.x;
    const dy = e.clientY - lastPosition.y;
    const newTranslate = {
      x: translate.x + dx,
      y: translate.y + dy,
    };
    setTranslate(clampTranslate(newTranslate));
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const getDistance = (touches) => {
    const [a, b] = touches;
    return Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY);
  };

  const getMidpoint = (touches) => {
    const [a, b] = touches;
    return {
      x: (a.pageX + b.pageX) / 2,
      y: (a.pageY + b.pageY) / 2,
    };
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      setTouchStartDistance(getDistance(e.touches));
      setTouchStartMidpoint(getMidpoint(e.touches));
      setStartTranslate(translate);
    } else if (e.touches.length === 1) {
      setIsDragging(true);
      setLastPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchStartDistance && touchStartMidpoint) {
      e.preventDefault();
      const newDistance = getDistance(e.touches);
      const scaleChange = newDistance / touchStartDistance;
      const newScale = clamp(scale * scaleChange, MIN_SCALE, MAX_SCALE);
      setScale(newScale);

      const midpoint = getMidpoint(e.touches);
      const dx = midpoint.x - touchStartMidpoint.x;
      const dy = midpoint.y - touchStartMidpoint.y;
      setTranslate(
        clampTranslate({ x: startTranslate.x + dx, y: startTranslate.y + dy })
      );
    } else if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - lastPosition.x;
      const dy = e.touches[0].clientY - lastPosition.y;
      const newTranslate = {
        x: translate.x + dx,
        y: translate.y + dy,
      };
      setTranslate(clampTranslate(newTranslate));
      setLastPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchStartDistance(null);
    setTouchStartMidpoint(null);
  };

  const handleReset = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className="overflow-hidden relative w-full h-full touch-none select-none cursor-grab"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={contentRef}
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: "center center",
          transition: isDragging ? "none" : "transform 0.2s ease",
        }}
      >
        {children}
      </div>

      {/* Reset button */}
      <button
        className="cursor-pointer absolute bottom-2 right-2 bg-blue-50 text-sm px-2 py-1 border transition-all rounded shadow hover:bg-blue-100"
        onClick={handleReset}
      >
        <IoIosRefresh />
      </button>
    </div>
  );
}

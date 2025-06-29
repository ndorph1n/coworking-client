import { useUserStore } from "../store/userStore";

export default function BookingTimeline({ bookings = [], date }) {
  const { user } = useUserStore();
  const startHour = 8;
  const endHour = 22;
  const pixelPerMinute = 1;
  const minutesPerHour = 60;
  const timelineWidth = (endHour - startHour) * minutesPerHour * pixelPerMinute;

  const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const filteredBookings = bookings.filter((b) => b.date.startsWith(date));

  return (
    <div className="w-full overflow-x-auto px-5 border rounded bg-gray-100">
      <div
        className="relative h-12 "
        style={{ width: `${timelineWidth}px`, minWidth: "100%" }}
      >
        {/* Временные метки */}
        {[...Array(endHour - startHour + 1)].map((_, i) => {
          const hour = startHour + i;
          return (
            <div
              key={hour}
              className="absolute top-0 text-[10px] text-gray-500"
              style={{
                left: `${i * 60 * pixelPerMinute}px`,
                transform: "translateX(-50%)",
              }}
            >
              {String(hour).padStart(2, "0")}:00
            </div>
          );
        })}

        {/* Бронирования */}
        {filteredBookings.map((b) => {
          const start = toMinutes(b.startTime);
          const end = toMinutes(b.endTime);
          const duration = end - start;
          const leftOffset = (start - startHour * 60) * pixelPerMinute;
          const width = duration * pixelPerMinute;
          const flexRange = b.isFlexible ? b.flexibilityRange : 0;
          const flexWidth = flexRange * pixelPerMinute;

          const userIsOwner = user && b.user === user._id;
          const bgColor = userIsOwner ? "bg-green-600" : "bg-blue-600";

          const canFlexBefore = b.isFlexible && start > startHour * 60;
          const canFlexAfter = b.isFlexible && end < endHour * 60;

          return (
            <div key={b._id} className="absolute top-5 h-5">
              {/* Основной прямоугольник */}
              <div
                className={`absolute h-full ${bgColor} text-white text-[10px] rounded flex items-center justify-center px-1`}
                style={{
                  left: `${leftOffset}px`,
                  width: `${width}px`,
                  minWidth: "20px",
                }}
                title={`${b.startTime}–${b.endTime}`}
              >
                {b.startTime}–{b.endTime}
              </div>

              {/* Гибкая зона ВНУТРИ блока — слева */}
              {canFlexBefore && (
                <div
                  className="absolute h-5 border border-dashed border-black hover:cursor-help"
                  style={{
                    left: `${leftOffset}px`,
                    width: `${flexWidth}px`,
                  }}
                  title="Слот доступен для бронирования"
                />
              )}

              {/* Гибкая зона ВНУТРИ блока — справа */}
              {canFlexAfter && (
                <div
                  className="absolute h-5 border border-dashed border-black hover:cursor-help"
                  style={{
                    left: `${leftOffset + width - flexWidth}px`,
                    width: `${flexWidth}px`,
                  }}
                  title="Слот доступен для бронирования"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

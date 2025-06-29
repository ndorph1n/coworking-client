export default function AdminSidebar({ section, setSection }) {
  const menu = [
    { key: "users", label: "Управление пользователями" },
    { key: "workspaces", label: "Управление рабочими местами" },
    { key: "bookings", label: "Управление бронированиями" },
    { key: "layout", label: "План помещения" },
  ];

  return (
    <aside className="w-64 bg-white border-r p-4">
      <h2 className="text-xl font-bold mb-4">Админка</h2>
      <ul className="space-y-2">
        {menu.map((item) => (
          <li key={item.key}>
            <button
              onClick={() => setSection(item.key)}
              className={`w-full text-left p-2 rounded ${
                section === item.key
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

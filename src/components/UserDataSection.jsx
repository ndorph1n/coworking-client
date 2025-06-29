import { useState } from "react";
import { updateUserData } from "../api/users";
import { useUserStore } from "../store/userStore";
import { useModalMessageStore } from "../store/modalMessageStore";

export default function UserDataSection({ user }) {
  const { setUser } = useUserStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
    email: user.email || "",
  });
  const { showMessage } = useModalMessageStore();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updated = await updateUserData({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
      });

      // Обновим только допустимые поля
      setUser({
        ...user,
        ...updated,
        token: localStorage.getItem("token"),
      });

      setEditing(false);
      showMessage("Данные успешно обновлены", "success");
    } catch (err) {
      showMessage(
        err?.response?.data?.message || "Ошибка при обновлении данных",
        "error"
      );
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Мои данные</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <label>
          Имя:
          <input
            name="firstName"
            type="text"
            placeholder="Имя"
            value={form.firstName}
            onChange={handleChange}
            readOnly={!editing}
            className={`w-full p-3 border rounded ${
              !editing ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </label>
        {errors.firstName && (
          <p className="text-red-500 text-sm mb-0">{errors.firstName}</p>
        )}
        <label className="mt-4 block mb-0">
          Фамилия:
          <input
            name="lastName"
            type="text"
            placeholder="Фамилия"
            value={form.lastName}
            onChange={handleChange}
            readOnly={!editing}
            className={`w-full p-3 border rounded ${
              !editing ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </label>
        {errors.lastName && (
          <p className="text-red-500 text-sm mb-0">{errors.lastName}</p>
        )}
        <label className="mt-4 block mb-0">
          Номер телефона:
          <input
            name="phone"
            type="tel"
            placeholder="Телефон"
            value={form.phone}
            onChange={handleChange}
            readOnly={!editing}
            className={`w-full p-3 border rounded ${
              !editing ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mb-0">{errors.phone}</p>
          )}
        </label>
        <label className="mt-4 block mb-0">
          Электронная почта:
          <input
            name="email"
            type="email"
            value={form.email}
            readOnly
            className="w-full p-3 border rounded bg-gray-100 cursor-not-allowed"
          />
        </label>

        {editing ? (
          <div className="flex gap-4 mt-3">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition cursor-pointer"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setErrors({});
                setForm({
                  firstName: user.firstName || "",
                  lastName: user.lastName || "",
                  phone: user.phone || "",
                  email: user.email || "",
                });
              }}
              className="text-gray-600 underline"
            >
              Отмена
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="cursor-pointer bg-gray-200 text-gray-800 px-6 py-3 rounded hover:bg-gray-300 transition mt-3"
          >
            Изменить
          </button>
        )}
      </form>
    </div>
  );
}

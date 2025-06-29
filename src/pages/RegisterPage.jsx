import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { useModalMessageStore } from "../store/modalMessageStore";
import { registerUser } from "../api/auth";
import { validate } from "../utils/validate";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });
  const { showMessage } = useModalMessageStore();
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      const userData = await registerUser(form);
      console.log(userData);

      showMessage("Регистрация прошла успешно", "success");
      setUser(userData);
      navigate("/profile");
    } catch (err) {
      showMessage(err?.response?.data?.message || "Ошибка регистрации", "error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-5"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-1">Регистрация</h2>
          <p className="text-sm text-gray-600">
            Уже есть аккаунт?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Войдите
            </Link>
          </p>
        </div>
        <label className="block text-sm font-medium mb-0">
          {" "}
          Имя
          <input
            type="text"
            name="firstName"
            placeholder="Имя"
            className="w-full p-3 border rounded font-normal"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </label>
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-0">{errors.firstName}</p>
        )}
        <label className="block text-sm font-medium mb-0 mt-4">
          {" "}
          Фамилия
          <input
            type="text"
            name="lastName"
            placeholder="Фамилия"
            className="w-full p-3 border rounded font-normal"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </label>
        {errors.lastName && (
          <p className="text-red-500 text-sm mt-0">{errors.lastName}</p>
        )}
        <label className="block text-sm font-medium mb-0 mt-4">
          {" "}
          Телефон
          <input
            type="tel"
            name="phone"
            placeholder="Телефон (необязательно)"
            className="w-full p-3 border rounded font-normal"
            value={form.phone}
            onChange={handleChange}
          />
        </label>
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        <label className="block text-sm font-medium mb-0 mt-4">
          {" "}
          Email
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded font-normal"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        {errors.email && <p className="text-red-500 text-sm mt-0">{errors.email}</p>}
        <label className="block text-sm font-medium mb-0 mt-4">
          Пароль
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            className="w-full p-3 border rounded font-normal"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
        <label className="block text-sm font-medium mb-0 mt-4">
          Повторите пароль
          <input
            type="password"
            name="confirm"
            placeholder="Повторите пароль"
            className="w-full p-3 border rounded font-normal"
            value={form.confirm}
            onChange={handleChange}
            required
          />
        </label>
        {errors.confirm && <p className="text-red-500 text-sm">{errors.confirm}</p>}

        <button
          type="submit"
          className=" mt-5 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}

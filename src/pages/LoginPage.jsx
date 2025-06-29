import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { useModalMessageStore } from "../store/modalMessageStore";
import { loginUser } from "../api/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showMessage } = useModalMessageStore();
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser({ email, password });
      setUser(userData);
      navigate("/profile");
    } catch (err) {
      showMessage(err?.response?.data?.message || "Ошибка входа", "error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Вход в систему</h2>
        <label className=" block mb-2 text-sm font-medium">
          {" "}
          Email
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded font-normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className=" block text-sm font-medium">
          {" "}
          Пароль
          <input
            type="password"
            placeholder="Пароль"
            className="w-full p-3 border rounded font-normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className="cursor-pointer w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Войти
        </button>
        <p className="text-sm text-gray-600 text-right">
          Нет аккаунта?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Зарегистрируйтесь
          </Link>
        </p>
      </form>
    </div>
  );
}

import { NavLink, Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import NotificationBell from "./NotificationBell";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const { user, logout } = useUserStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          CoworkingApp
        </Link>
        <nav className="hidden md:flex md:gap-3 items-center lg:gap-6 text-gray-700">
          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className="text-orange-600 font-semibold hover:underline"
            >
              Администрирование
            </NavLink>
          )}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "font-semibold underline" : undefined
            }
          >
            О нас
          </NavLink>
          <NavLink
            to="/contacts"
            className={({ isActive }) =>
              isActive ? "font-semibold underline" : undefined
            }
          >
            Контакты
          </NavLink>
          <Link
            to="/booking"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg"
          >
            Забронировать
          </Link>
          {user ? (
            <>
              <NotificationBell />
              <NavLink
                to="/profile"
                className="text-blue-600 font-medium cursor-pointer"
              >
                {user.firstName || "Профиль"}
              </NavLink>
              <button
                onClick={handleLogout}
                className=" text-red-600 hover:underline cursor-pointer font-medium align-middle"
              >
                Выйти
              </button>
            </>
          ) : (
            <NavLink to="/login">Вход/Регистрация</NavLink>
          )}
        </nav>
        {/* Мобильный бургер */}
        <div className="md:hidden flex items-center gap-3">
          {user && <NotificationBell />}
          <button onClick={() => setMenuOpen((prev) => !prev)}>
            {menuOpen ? (
              <FaTimes className="text-xl" />
            ) : (
              <FaBars className="text-xl" />
            )}
          </button>
        </div>
        {/* Выпадающее мобильное меню */}
        <div
          ref={menuRef}
          className={`absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-start px-6 py-4 gap-4 md:hidden transform transition-all duration-300 ease-out ${
            menuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className="text-orange-600 font-semibold hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              Администрирование
            </NavLink>
          )}
          <Link
            to="/booking"
            className="hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            Забронировать
          </Link>
          <Link
            to="/about"
            className="hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            О нас
          </Link>
          <Link
            to="/contacts"
            className="hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            Контакты
          </Link>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                Личный кабинет
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="text-red-500 text-sm cursor-pointer font-medium"
              >
                Выйти
              </button>
            </>
          ) : (
            <div className="flex gap-4 justify-end w-full items-center">
              <Link
                to="/login"
                className=" bg-blue-600 p-2 w-35 text-center text-white font-bold cursor-pointer"
                onClick={() => setMenuOpen(false)}
              >
                Вход
              </Link>
              <Link
                to="/register"
                className=" -order-1 cursor-pointer"
                onClick={() => setMenuOpen(false)}
              >
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

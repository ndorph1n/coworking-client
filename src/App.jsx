import { Routes, Route } from "react-router-dom";

import ModalMessage from "./components/ModalMessage";

// Компоненты страниц
import AppWrapper from "./components/AppWrapper";

// Компоненты маршрутов
import ProtectedRoute from "./router/ProtectedRoute";
import AdminRoute from "./router/AdminRoute";

// Страницы приложения
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AppWrapper />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contacts" element={<ContactPage />} />

          {/* 🔐 Приватные роуты */}
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Админские роуты */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
      <ModalMessage />
    </>
  );
}

import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

export default function AdminRoute({ children }) {
  const { user } = useUserStore();

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

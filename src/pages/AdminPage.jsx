import { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import UserManagement from "../components/admin/UserManagement";
import WorkspaceManagement from "../components/admin/WorkspaceManagement";
import BookingManagement from "../components/admin/BookingManagement";
import LayoutManagement from "../components/admin/LayoutManagement";

export default function AdminPage() {
  const [section, setSection] = useState("users");

  const renderSection = () => {
    switch (section) {
      case "users":
        return <UserManagement />;
      case "workspaces":
        return <WorkspaceManagement />;
      case "bookings":
        return <BookingManagement />;
      case "layout":
        return <LayoutManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar section={section} setSection={setSection} />
      <main className="flex-1 p-6">{renderSection()}</main>
    </div>
  );
}

import { useEffect, useState } from "react";
import { getAllUsers, updateUser, deleteUser } from "../../api/users";
import UserEditorModal from "./UserEditorModal";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      alert("Ошибка загрузки пользователей");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
  };

  const handleDelete = async (id) => {
    if (confirm("Удалить этого пользователя?")) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch {
        alert("Не удалось удалить пользователя");
      }
    }
  };

  const handleSave = async (updatedUser) => {
    try {
      await updateUser(updatedUser._id, updatedUser);
      setSelectedUser(null);
      fetchUsers();
    } catch {
      alert("Ошибка сохранения изменений");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Управление пользователями</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Имя</th>
            <th className="p-2 border">Фамилия</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Телефон</th>
            <th className="p-2 border">Роль</th>
            <th className="p-2 border">Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="hover:bg-gray-50">
              <td className="p-2 border">{u.firstName}</td>
              <td className="p-2 border">{u.lastName}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.phone || "—"}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleEdit(u)}
                  className="text-blue-600 hover:underline"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(u._id)}
                  className="text-red-600 hover:underline"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <UserEditorModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

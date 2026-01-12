import React, { useEffect, useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { useStore } from "../../context/StoreContext";

const AdminUsers = () => {
  const { adminFetchUsers, adminUpdateUser, loading } = useStore();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const load = async () => {
    const { data, error: err } = await adminFetchUsers();
    if (err) setError(err);
    else {
      setError(null);
      setUsers(data || []);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleActive = async (userId, isActive) => {
    const { error: err } = await adminUpdateUser(userId, { isActive });
    if (err) setError(err);
    else load();
  };

  const changeRole = async (userId, role) => {
    const { error: err } = await adminUpdateUser(userId, { role });
    if (err) setError(err);
    else load();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-dark">Users</h2>
      </div>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {loading.users ? (
        <p className="text-dark-light">Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Active</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b">
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u._id, e.target.value)}
                      className="border-2 border-gray-200 rounded-lg px-3 py-2"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">{u.isActive ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => toggleActive(u._id, true)}
                      className="inline-flex items-center px-3 py-1 rounded-lg bg-green-100 hover:bg-green-200 text-green-700"
                    >
                      <AiOutlineCheck /> Enable
                    </button>
                    <button
                      onClick={() => toggleActive(u._id, false)}
                      className="inline-flex items-center px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700"
                    >
                      <AiOutlineClose /> Disable
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

import React, { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import Loader from "../../components/Loader";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters + pagination
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      let url = `http://localhost:8080/api/users?page=${currentPage}&limit=6`;

      const params = [];
      if (roleFilter !== "all") params.push(`role=${roleFilter}`);
      if (statusFilter !== "all") params.push(`status=${statusFilter}`);
      if (search.trim()) params.push(`search=${search.trim()}`);
      if (params.length) url += `&${params.join("&")}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();

      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8080/api/users/${userId}/toggle`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isActive: data.user.isActive } : u
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter, statusFilter, search, currentPage]);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Users</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border bg-white w-full md:w-fit border-gray-200 rounded px-3 py-2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page
          }}
        />
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border bg-white border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admins</option>
          <option value="user">Users</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border bg-white border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <section className="bg-white rounded-lg overflow-x-auto">
        {loading ? (
          <Loader />
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-orange-100 text-orange-800 font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className="hover:bg-orange-50 transition cursor-default"
                >
                  <td className="px-6 py-3 text-gray-700">
                    {(currentPage - 1) * 5 + index + 1}
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-3 text-gray-700">{user.email}</td>
                  <td className="px-6 py-3 capitalize">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                        }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {user.isActive ? (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => handleToggle(user._id)}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium shadow-sm transition ${!user.isActive
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                    >
                      {!user.isActive ? <FaToggleOff /> : <FaToggleOn />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border hover:bg-orange-100 border-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border border-gray-200 rounded ${currentPage === i + 1
                  ? "bg-orange-500 text-white"
                  : "hover:bg-orange-100"
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border hover:bg-orange-100 border-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </AdminLayout>
  );
}

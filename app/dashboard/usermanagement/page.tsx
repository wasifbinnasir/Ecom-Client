"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Edit3,
  Save,
  X,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../services/userApi";

const roleOptions = [
  { value: "user", label: "User", color: "bg-gray-500" },
  { value: "admin", label: "Admin", color: "bg-blue-500" },
  { value: "super_admin", label: "Super Admin", color: "bg-purple-500" },
];

export default function UsersPage() {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const handleRoleUpdate = async (id: string) => {
    if (!selectedRole) return;
    try {
      // ✅ Always send array
      await updateUser({ id, user: { roles: [selectedRole] } }).unwrap();
      setEditingUserId(null);
    } catch (err) {
      console.log("Failed to update role:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl p-6 h-20"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-red-600 font-semibold">Failed to load users.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">
            Manage registered users and their roles.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center px-6 py-3 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-all duration-200"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </Link>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {users?.map((user) => {
          const currentRole = Array.isArray(user.roles)
            ? user.roles[0]
            : String(user.roles ?? "");

          return (
            <div
              key={user._id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4"
            >
              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-bold text-gray-800">
                    {user.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {user.email}
                </div>
              </div>

              {/* Role Management */}
              <div className="flex items-center gap-4">
                {editingUserId === user._id ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedRole || ""}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="p-2 border rounded-lg"
                    >
                      <option value="" disabled>
                        Select role
                      </option>
                      {roleOptions.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleRoleUpdate(user._id)}
                      disabled={isUpdating}
                      className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={() => setEditingUserId(null)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        roleOptions.find((r) => r.value === currentRole)
                          ?.color || "bg-gray-300"
                      } text-white`}
                    >
                      {currentRole}
                    </span>
                    {currentRole !== "super_admin" && (
                      <>
                        <button
                          onClick={() => {
                            setEditingUserId(user._id);
                            setSelectedRole(currentRole);
                          }}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

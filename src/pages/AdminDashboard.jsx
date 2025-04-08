import { useState, useEffect, useContext } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaSpinner,
  FaEdit,
  FaSave,
  FaTimes,
  FaUserShield,
} from "react-icons/fa";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [tempBalance, setTempBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser, logout, updateBalance } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (currentUser.role !== "admin") {
      navigate("/user/dashboard");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.role === "admin") {
      fetchUsers();
    }
  }, [currentUser]);

  const handleEdit = (user) => {
    setEditingId(user.id);
    setTempBalance(user.balance || 0);
  };

  const handleSave = async (userId) => {
    try {
      await updateBalance(userId, tempBalance);
      setUsers(
        users.map((user) =>
          user.id === userId
            ? { ...user, balance: parseFloat(tempBalance) }
            : user
        )
      );
      setEditingId(null);
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">
              Admin Dashboard
            </h1>
            <p className="text-blue-800">Logged in as: {currentUser?.email}</p>
          </div>
          <button
            onClick={() => logout()}
            className="mt-4 md:mt-0 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-2 text-sm text-blue-800">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-right">Balance ($)</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role === "admin" && (
                          <FaUserShield className="mr-1" />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {editingId === user.id ? (
                        <input
                          type="number"
                          value={tempBalance}
                          onChange={(e) => setTempBalance(e.target.value)}
                          className="w-24 px-2 py-1 border border-blue-300 rounded"
                          step="0.01"
                          min="0"
                        />
                      ) : (
                        user.balance?.toFixed(2) || "0.00"
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {editingId === user.id ? (
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleSave(user.id)}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="Save"
                          >
                            <FaSave />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Cancel"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(user)}
                          disabled={user.id === currentUser?.uid}
                          className={`text-blue-600 hover:text-blue-800 p-1 ${
                            user.id === currentUser?.uid
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          title="Edit Balance"
                        >
                          <FaEdit />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

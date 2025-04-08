import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaExchangeAlt,
  FaSignOutAlt,
  FaEnvelope,
} from "react-icons/fa";

export default function UserDashboard() {
  const { currentUser, logout, updateBalance } = useAuth();
  const [amount, setAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [activeTab, setActiveTab] = useState("deposit");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleTransaction = async (type) => {
    setError("");
    setSuccess("");

    if (!amount || isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      const numAmount = parseFloat(amount);
      let newBalance = currentUser.balance;

      if (type === "deposit") {
        newBalance += numAmount;
      } else if (type === "withdraw" || type === "transfer") {
        if (numAmount > currentUser.balance) {
          setError("Insufficient funds");
          return;
        }
        newBalance -= numAmount;
      }

      if (type === "transfer") {
        if (!recipientEmail.includes("@")) {
          setError("Please enter a valid recipient email");
          return;
        }
      }

      await updateBalance(currentUser.uid, newBalance);

      setSuccess(
        type === "transfer"
          ? `$${numAmount.toFixed(2)} sent to ${recipientEmail}`
          : `$${numAmount.toFixed(2)} ${type} successful!`
      );

      setAmount("");
      setRecipientEmail("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(`Transaction failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">
            Welcome, {currentUser?.name}
          </h1>
          <button
            onClick={logout}
            className="text-white hover:text-blue-200 flex items-center"
          >
            <FaSignOutAlt className="mr-1" /> Logout
          </button>
        </div>

        <div className="p-6">
          <div className="bg-blue-100 p-4 rounded-lg mb-6 border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-800 mb-1">
              Account Balance
            </h2>
            <p className="text-3xl font-bold text-blue-600">
              ${currentUser?.balance?.toFixed(2) || "0.00"}
            </p>
          </div>

          <div className="flex border-b border-blue-200 mb-4">
            {["deposit", "withdraw", "transfer"].map((tab) => (
              <button
                key={tab}
                className={`py-2 px-4 font-medium flex items-center ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-blue-400 hover:text-blue-600"
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  setError("");
                  setSuccess("");
                }}
              >
                {tab === "deposit" && <FaArrowDown className="mr-2" />}
                {tab === "withdraw" && <FaArrowUp className="mr-2" />}
                {tab === "transfer" && <FaExchangeAlt className="mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg border border-green-200 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {success}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Amount ($)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaMoneyBillWave className="text-blue-400" />
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                />
              </div>
            </div>

            {activeTab === "transfer" && (
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Recipient Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaEnvelope className="text-blue-400" />
                  </div>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="recipient@email.com"
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => handleTransaction(activeTab)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center"
            >
              {activeTab === "deposit" && <FaArrowDown className="mr-2" />}
              {activeTab === "withdraw" && <FaArrowUp className="mr-2" />}
              {activeTab === "transfer" && <FaExchangeAlt className="mr-2" />}
              {activeTab === "transfer"
                ? "Send Money"
                : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
          </div>
        </div>

        <div className="bg-blue-50 p-4 border-t border-blue-200">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            Account Details
          </h2>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium text-blue-700">Email:</span>{" "}
              {currentUser?.email}
            </p>
            <p>
              <span className="font-medium text-blue-700">Account Type:</span>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  currentUser?.role === "admin"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {currentUser?.role === "admin"
                  ? "Administrator"
                  : "Standard User"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

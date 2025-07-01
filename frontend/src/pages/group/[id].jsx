import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#E91E63"];

const GroupDetails = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("userData"));

  // Fetch group data
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/groups/${id}`
        );
        setGroup(data);
      } catch (err) {
        console.error("Failed to fetch group:", err);
      }
    };
    fetchGroup();
  }, [id]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/users`);
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Replace user IDs with full user objects
  const getEnrichedExpenses = () => {
    if (!group || !users.length) return [];
    return (group.expenses || []).map((exp) => {
      const fullUser = users.find(
        (u) =>
          u._id === (typeof exp.user === "string" ? exp.user : exp.user._id)
      );
      return { ...exp, user: fullUser || exp.user };
    });
  };

  const handleAddExpense = async () => {
    if (!amount || !selectedUser) return;
    try {
      const { data } = await axios.post(
        `${API_URL}/api/groups/${id}/expenses`,
        {
          user: selectedUser,
          amount: parseFloat(amount),
          remarks: remarks.trim(),
        }
      );

      const user = users.find((u) => u._id === selectedUser);

      setGroup((prev) => ({
        ...prev,
        expenses: [...(prev.expenses || []), { ...data, user }],
      }));

      setShowModal(false);
      setAmount("");
      setSelectedUser("");
      setRemarks("");
    } catch (err) {
      console.error("Failed to add expense:", err);
    }
  };

  if (!group || !users.length) {
    return <div className="text-white text-center mt-20">Loading group...</div>;
  }

  const rawExpenses = getEnrichedExpenses();

  const expensesMap = {};

  rawExpenses.forEach((exp) => {
    const uid = exp.user._id;
    if (!expensesMap[uid]) {
      expensesMap[uid] = {
        user: exp.user,
        amount: 0,
      };
    }
    expensesMap[uid].amount += exp.amount;
  });

  const expenses = Object.values(expensesMap);

  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen px-6 py-8 bg-black text-white">
      <button
        onClick={() => navigate(-1)}
        className="top-6 left-6 text-white hover:text-gray-400 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h1 className="text-2xl font-bold mb-4">{group.name}</h1>
      <h2 className="text-lg text-gray-300 mb-6">Total Spent: ₹{total}</h2>

      <div className="flex flex-col items-center">
        <PieChart width={320} height={320}>
          <Pie
            data={expenses}
            dataKey="amount"
            nameKey="user"
            cx="50%"
            cy="50%"
            outerRadius={100}
          >
            {expenses.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend
            formatter={(value, entry) =>
              `@${entry.payload.user?.name || entry.payload.user}`
            }
          />
        </PieChart>

        <div className="mt-6 w-full space-y-2">
          {rawExpenses.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between border-b border-white/20 pb-2 text-sm"
            >
              <div>
                <span className="text-white font-medium">
                  {item.user?.name || item.user}
                </span>
                {item.remarks && (
                  <div className="text-white text-md">{item.remarks}</div>
                )}
              </div>
              <span className="text-indigo-300 font-bold">₹{item.amount}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mt-6 bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-200"
        >
          + Add Expense
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 text-black w-96 space-y-4">
            <h2 className="text-xl font-bold mb-2">Add New Expense</h2>

            <div>
              <label className="block text-sm font-medium mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Remarks</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g. Dinner, cab, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Paid By</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select user</option>
                {group.members
                  .filter((memberId) => memberId !== currentUser._id)
                  .map((memberId) => {
                    const user = users.find(
                      (u) => u._id === (memberId._id || memberId)
                    );
                    return (
                      <option key={user?._id} value={user?._id}>
                        {user?.name}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                className="px-5 py-2 rounded bg-black text-white hover:bg-gray-900"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;

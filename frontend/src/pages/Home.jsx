import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import Footer from "../components/Footer";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

const Home = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [groupSummary, setGroupSummary] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("userData"));
    if (!localUser?._id) return;

    setUser(localUser);

    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/groups/user/${localUser._id}`);
        const groupData = res.data;

        setGroups(groupData);

        // Calculate total spent by current user
        let total = 0;
        const chartData = [];

        groupData.forEach((group) => {
          let userSpent = 0;

          group.expenses.forEach((exp) => {
            if (exp.user === localUser._id) {
              userSpent += exp.amount;
            }
          });

          if (userSpent > 0) {
            chartData.push({ name: group.name, value: userSpent });
            total += userSpent;
          }
        });
        setTotalExpense(total);
        setGroupSummary(chartData);
      } catch (err) {
        console.error("Failed to fetch group expenses", err);
      }
    };

    fetchData();
  }, []);

  if (!user) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="min-h-screen px-6 py-8 bg-black text-white">
      <h1 className="text-2xl font-semibold mb-6">
        Welcome <span className="underline">{user.name}</span>!
      </h1>

      {/* Total Expense Summary */}
      <div className="bg-neutral-900 p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-300">This Month's Total Expenses</h2>
        <p className="text-3xl font-bold text-white">₹{totalExpense}</p>
      </div>

      {/* Pie Chart Summary */}
      <div className="bg-neutral-900 p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-300">Your Contributions by Group</h2>

        {groupSummary.length === 0 ? (
          <p className="text-gray-500">No contributions yet.</p>
        ) : (
          <>
            <div className="w-full h-60">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={groupSummary}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}

                  >
                    {groupSummary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Home;

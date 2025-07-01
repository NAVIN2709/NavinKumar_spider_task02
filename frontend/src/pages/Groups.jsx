import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddGroup from '../components/AddGroup';
import Footer from "../components/Footer";

const Groups = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("userData"));

  // Fetch groups where current user is a member
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/groups/user/${currentUser._id}`);
        setGroups(data);
      } catch (err) {
        console.error("Failed to fetch groups:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [currentUser._id]);

  const calculateTotal = (group) => {
    return group.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  const handleCreateGroup = (newGroup) => {
    setGroups((prev) => [...prev, newGroup]);
  };

  return (
    <div className="min-h-screen px-6 py-8 bg-black text-white relative">
      <h1 className="text-2xl font-semibold mb-6">Your Groups</h1>

      {loading ? (
        <p className="text-gray-400">Loading groups...</p>
      ) : groups.length === 0 ? (
        <p className="text-gray-400">You haven't joined or created any groups yet.</p>
      ) : (
        <div className="space-y-4 mb-16">
          {groups.map((group) => (
            <div
              key={group._id}
              className="bg-neutral-900 p-5 rounded-xl shadow flex justify-between items-center cursor-pointer hover:bg-neutral-800 transition"
              onClick={() => navigate(`/group/${group._id}`)}
            >
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{group.name}</h2>
                  <p className="text-gray-400 text-sm">{group.members.length} members</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">Total</p>
                <p className="text-white font-bold text-lg">₹{calculateTotal(group)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Group Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-6 bg-white text-black font-semibold px-5 py-3 rounded-full shadow hover:bg-gray-200 transition"
      >
        + Create Group
      </button>

      {/* Modal */}
      <AddGroup
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateGroup}
      />
      <Footer />
    </div>
  );
};

export default Groups;

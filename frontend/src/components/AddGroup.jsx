import React, { useEffect, useState } from "react";
import axios from "axios";

const AddGroup = ({ isOpen, onClose, onCreate }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [name, setName] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const { data: currentUserData } = await axios.get(
          `${API_URL}/api/users/${currentUser._id}`
        );
        setAllUsers(currentUserData.friends || []);
      } catch (err) {
        console.error("Failed to fetch friends:", err);
      }
    };

    if (isOpen) fetchFriends();
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!name || selectedUsers.length === 0) return;
    setLoading(true);

    try {
      selectedUsers.push(currentUser._id);

      const payload = {
        name,
        creator: currentUser._id,
        members: selectedUsers,
      };

      const { data: newGroup } = await axios.post(
        `${API_URL}/api/groups`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      onCreate(newGroup);
      setName("");
      setSelectedUsers([]);
      setSearch("");
      onClose();
    } catch (err) {
      console.error("Error creating group:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = (userId) => {
    if (!selectedUsers.includes(userId)) {
      setSelectedUsers((prev) => [...prev, userId]);
    }
    setSearch("");
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((id) => id !== userId));
  };

  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) &&
      !selectedUsers.includes(user._id)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white text-black rounded-2xl p-6 w-11/12 max-w-lg shadow-xl space-y-6 relative">
        <h2 className="text-2xl font-bold">Create a New Group</h2>

        {/* Group Name */}
        <div>
          <label className="block font-semibold text-sm mb-1">Group Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter group name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Member Search */}
        <div>
          <label className="block font-semibold text-sm mb-1">
            Add Members
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          {search && filteredUsers.length > 0 && (
            <div className="bg-white border border-gray-300 mt-1 rounded-lg shadow max-h-40 overflow-y-auto text-sm">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleAddUser(user._id)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {user.name}{" "}
                  <span className="text-gray-500">
                    @{user.username || user.email}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Members */}
        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((id) => {
              const user = allUsers.find((u) => u._id === id);
              return (
                <span
                  key={id}
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {user?.name}
                  <button
                    onClick={() => handleRemoveUser(id)}
                    className="text-indigo-800 hover:text-red-500"
                  >
                    &times;
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium rounded-full bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 text-sm font-semibold rounded-full bg-black text-white hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGroup;

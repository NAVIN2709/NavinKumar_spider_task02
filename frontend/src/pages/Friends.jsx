import React, { useState, useEffect } from 'react';
import Footer from "../components/Footer";
import axios from 'axios'; 

const FindFriends = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const localUser = JSON.parse(localStorage.getItem("userData"));
      if (!localUser?._id) return;
      setUserData(localUser);

      try {
        const resUser = await axios.get(`${API_URL}/api/users/${localUser._id}`);
        setSentRequests(resUser.data.sentRequests || []);
        setFriends(resUser.data.friends || []);
        setFriendRequests(resUser.data.friendRequests || []);

        const res = await axios.get(`${API_URL}/api/users`);
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSendRequest = async (targetId) => {
    try {
      await axios.put(`${API_URL}/api/users/${userData._id}/send-request`, { targetId });
      setSentRequests(prev => [...prev, targetId]);
    } catch (err) {
      console.error("Error sending friend request:", err);
    }
  };

  const handleAccept = async (requesterId) => {
    try {
      await axios.put(`${API_URL}/api/users/${userData._id}/accept-request`, { requesterId });
      setFriends(prev => [...prev, requesterId]);
      setFriendRequests(prev => prev.filter(id => id !== requesterId));
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  const handleReject = async (requesterId) => {
    try {
      await axios.put(`${API_URL}/api/users/${userData._id}/remove-request`, { requesterId });
      setFriendRequests(prev => prev.filter(id => id !== requesterId));
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  const filteredUsers = users.filter(
  (user) =>
    user._id !== userData?._id &&
    (user.name.toLowerCase().includes(search.toLowerCase()) ||
     user.email.toLowerCase().includes(search.toLowerCase()))
);


  return (
    <div className="min-h-screen px-6 py-8 bg-black text-white relative">
      {/* 🔔 Notification button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed top-5 right-6 bg-white text-black font-bold px-4 py-2 rounded-full hover:bg-gray-200 z-50"
      >
        🔔 {friendRequests.length}
      </button>

      <h1 className="text-2xl font-semibold mb-4">Find Friends</h1>

      <input
        type="text"
        placeholder="Search by name or email"
        className="w-full px-4 py-3 mb-6 rounded-xl bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-gray-400">No users found.</p>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => {
            const isFriend = friends.some(friend => friend._id === user._id);
            const isRequested = sentRequests.includes(user._id);

            return (
              <div
                key={user._id}
                className="bg-neutral-900 p-4 rounded-xl shadow flex justify-between items-center"
              >
                <div className="flex items-center">
                  <img
                    src={user.photoURL}
                    className="w-12 h-12 rounded-full mr-3"
                    alt="avatar"
                  />
                  <div>
                    <h2 className="text-lg font-medium">{user.name}</h2>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                </div>

                <button
                  disabled={isFriend || isRequested}
                  onClick={() => handleSendRequest(user._id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    isFriend
                      ? "bg-green-600 text-white cursor-not-allowed"
                      : isRequested
                      ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  {isFriend ? "Friend" : isRequested ? "Requested" : "Add"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 🔽 Modal for friend requests */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white text-black w-full max-w-md rounded-xl shadow-xl p-6 space-y-4 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-600 hover:text-red-600 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">Friend Requests</h2>
            {friendRequests.length === 0 ? (
              <p className="text-gray-500">No pending requests</p>
            ) : (
              friendRequests.map((requester) => {
                return (
                  <div key={requester._id} className="flex justify-between items-center p-2 bg-gray-100 rounded-lg">
                    <div>
                      <p className="font-semibold">{requester?.name}</p>
                      <p className="text-sm text-gray-600">{requester?.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(requester._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(requester._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default FindFriends;

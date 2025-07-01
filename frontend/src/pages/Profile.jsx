import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UpdateProfile from "../components/UpdateProfile";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [userData, setUserData] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // 👇 Get user from localStorage and fetch full MongoDB user
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("userData")); // or whatever key you used
    if (!localUser?._id) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/users/${localUser._id}`
        );
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async (updatedFields) => {
    try {
      const res = await fetch(
        `${API_URL}/api/users/${userData._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFields),
        }
      );

      const updated = await res.json();
      setUserData(updated);
      localStorage.setItem("userData", JSON.stringify(updated));
      setShowUpdateModal(false);
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };
  const handleRemoveFriend = async (friendId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/users/${userData._id}/remove-friend`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ friendId }),
        }
      );

      const updated = await res.json();
      setUserData(updated);
      localStorage.setItem("userData", JSON.stringify(updated));
    } catch (err) {
      console.error("Error removing friend:", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("userData");
    navigate("/login");
  };

  if (!userData)
    return (
      <div className="text-white text-center mt-20">Loading profile...</div>
    );

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8 relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-white hover:text-gray-400 transition"
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

      <div className="flex flex-col items-center mt-12">
        <img
          src={userData.photoURL || "https://i.pravatar.cc/150?img=1"}
          alt="Profile"
          className="w-28 h-28 rounded-full border-4 border-white shadow mb-4"
        />
        <h1 className="text-2xl font-bold mb-1">{userData.name}</h1>
      </div>

      <div className="flex flex-col gap-6 items-center mt-6">
        <button
          onClick={() => setShowUpdateModal(true)}
          className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
        >
          Edit Profile
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600 transition"
        >
          Logout
        </button>

        {/* 👥 Friends List */}
        <div className="w-full max-w-md mt-8">
          <h2 className="text-xl font-bold mb-4 text-center">Friends</h2>
          {userData.friends?.length > 0 ? (
            <ul className="space-y-3">
              {userData.friends.map((friend) => (
                <li
                  key={friend._id}
                  className="flex items-center justify-between bg-white/10 p-4 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-white">{friend.name}</p>
                    <p className="text-sm text-gray-400">
                      @{friend.email}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveFriend(friend._id)}
                    className="text-sm bg-red-500 px-3 py-1 rounded-full hover:bg-red-600"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-center">No friends added yet.</p>
          )}
        </div>
      </div>

      <UpdateProfile
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onUpdate={handleUpdateProfile}
        user={userData}
      />
      <Footer />
    </div>
  );
};

export default Profile;

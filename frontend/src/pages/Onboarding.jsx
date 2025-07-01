import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const avatarImages = [
  "https://i.pravatar.cc/300?img=1",
  "https://i.pravatar.cc/300?img=5",
  "https://i.pravatar.cc/300?img=11",
  "https://i.pravatar.cc/300?img=15",
];

const Onboarding = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    if (index < avatarImages.length - 1) setIndex(index + 1);
  };

  const handleBack = () => {
    if (index > 0) setIndex(index - 1);
  };

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (!user || !user._id) return console.error("User not found in localStorage");

    try {
      const res = await fetch(`${API_URL}/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoURL: avatarImages[index] }),
      });

      const updated = await res.json();
      localStorage.setItem("userData", JSON.stringify(updated));
      navigate("/");
    } catch (err) {
      console.error("Failed to save avatar:", err);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-tr from-[#111827] via-[#1f2937] to-[#111827] text-white flex flex-col items-center justify-center px-6 relative">
      {/* App Logo */}
      <img src="/logo.png" alt="Logo" className="w-24 h-24 mb-6 drop-shadow-xl" />

      {/* Avatar Image */}
      <div className="w-44 h-44 rounded-full border-4 border-white shadow-lg overflow-hidden mb-6 transition-transform duration-200 hover:scale-105">
        <img
          src={avatarImages[index]}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleBack}
          disabled={index === 0}
          className="bg-gray-100 text-black px-5 py-2 rounded-full font-semibold shadow-md hover:bg-gray-300 transition disabled:opacity-40"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={index === avatarImages.length - 1}
          className="bg-gray-100 text-black px-5 py-2 rounded-full font-semibold shadow-md hover:bg-gray-300 transition disabled:opacity-40"
        >
          Next →
        </button>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-xl transition"
      >
        Save Avatar & Continue
      </button>
    </div>
  );
};

export default Onboarding;

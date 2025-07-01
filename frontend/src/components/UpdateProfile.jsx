import React, { useState } from 'react';

const UpdateProfile = ({ isOpen, onClose, onUpdate, user }) => {
  const [name, setName] = useState(user.name);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!name) return;
    onUpdate({ name, profilePicture });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white p-6 rounded-xl w-11/12 max-w-md text-black shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

        {/* Profile Picture Preview */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={profilePicture}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full mb-2 object-cover border border-gray-300"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm"
          />
        </div>

        {/* Name */}
        <input
          className="w-full mb-3 p-2 border border-gray-300 rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;

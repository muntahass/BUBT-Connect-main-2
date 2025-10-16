import React, { useState } from 'react';
import { dummyUserData } from '../assets/assets';
import { X, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfileModal = ({ setShowEdit }) => {
  const user = dummyUserData;

  const [editForm, setEditForm] = useState({
    username: user.username,
    bio: user.bio,
    location: user.location,
    profile_picture: null,
    cover_photo: null,
    full_name: user.full_name,
    graduation_year: user.graduation_year || '',
    current_work: user.current_work || '',
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) =>
      formData.append(key, value)
    );

    console.log('✅ Profile saved:', Object.fromEntries(formData));

    toast.success('Profile updated successfully 🎉', {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
      iconTheme: {
        primary: '#07df61ff',
        secondary: '#fff',
      },
    });

    // Close modal after short delay
    setTimeout(() => setShowEdit(false), 4200);
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={() => setShowEdit(false)} // 
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 sm:mx-auto flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
          <h1 className="text-xl font-semibold text-gray-800">Edit Profile</h1>
          <button
            onClick={() => setShowEdit(false)} // 
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <form
          className="flex-1 overflow-y-auto p-6 space-y-5"
          onSubmit={handleSaveProfile}
        >
          {/* Cover Photo */}
          <div className="relative group w-full h-40 sm:h-48 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={
                editForm.cover_photo
                  ? URL.createObjectURL(editForm.cover_photo)
                  : user.cover_photo
              }
              alt="Cover"
              className="object-cover w-full h-full"
            />
            <label
              htmlFor="cover_photo"
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer transition"
            >
              <Camera className="text-white" size={24} />
              <input
                type="file"
                id="cover_photo"
                accept="image/*"
                hidden
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    cover_photo: e.target.files[0],
                  })
                }
              />
            </label>
          </div>

          {/* Profile Picture */}
          <div className="flex flex-col items-center -mt-14">
            <div className="relative group">
              <img
                src={
                  editForm.profile_picture
                    ? URL.createObjectURL(editForm.profile_picture)
                    : user.profile_picture
                }
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow"
              />
              <label
                htmlFor="profile_picture"
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition"
              >
                <Camera className="text-white" size={22} />
                <input
                  type="file"
                  id="profile_picture"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      profile_picture: e.target.files[0],
                    })
                  }
                />
              </label>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={editForm.full_name}
              onChange={(e) =>
                setEditForm({ ...editForm, full_name: e.target.value })
              }
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={editForm.username}
              onChange={(e) =>
                setEditForm({ ...editForm, username: e.target.value })
              }
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={editForm.bio}
              onChange={(e) =>
                setEditForm({ ...editForm, bio: e.target.value })
              }
              rows="3"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={editForm.location}
              onChange={(e) =>
                setEditForm({ ...editForm, location: e.target.value })
              }
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Graduation Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Graduation Year
            </label>
            <input
              type="number"
              value={editForm.graduation_year}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  graduation_year: e.target.value,
                })
              }
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Current Work */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Work
            </label>
            <input
              type="text"
              value={editForm.current_work}
              onChange={(e) =>
                setEditForm({ ...editForm, current_work: e.target.value })
              }
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </form>

        {/* Footer Buttons (Sticky) */}
        <div className="border-t flex justify-end gap-3 p-4 bg-white sticky bottom-0">
          <button
            type="button"
            onClick={() => setShowEdit(false)} // ✅ Fixed Cancel
            className="px-5 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveProfile}
            className="px-5 py-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 shadow active:scale-95 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

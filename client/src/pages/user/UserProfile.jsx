import React from "react";
import UserLayout from "../../layout/UserLayout";
import { LuCalendar, LuMail, LuPhone } from "react-icons/lu";
import { FiEdit2 } from "react-icons/fi";

export default function UserProfile() {
  const [editProfile, setEditProfile] = React.useState(false);

   // Example user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    joined: "January 1, 2020",
    membership: "Premium Member",
  };

  const getInitials = (fullName) =>
    fullName
      .split(" ")
      .map((word) => word[0]?.toUpperCase())
      .join("");

  return (
    <UserLayout>
      {/* Page Heading */}
      <h1 className="text-xl font-bold mb-2">Welcome to Your Profile</h1>
      <p className="text-gray-600 mb-6">
        Manage your account settings, view activity, and update your profile
        information.
      </p>

      <div className="w-full flex flex-col border-t border-gray-200 md:flex-row gap-6">
        {/* Profile Card */}
        <div className="w-full md:w-1/2 pt-4">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

          <div className="max-w-sm overflow-hidden bg-white rounded-2xl border border-gray-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-indigo-500 p-6 text-white flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-4 border-white bg-white text-orange-600 flex items-center justify-center text-2xl font-bold shadow-md">
                {getInitials(user.name)}
              </div>
              <h2 className="mt-3 text-lg font-semibold">{user.name}</h2>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4 text-gray-700">
              <div className="flex items-center space-x-3">
                <LuMail className="w-5 h-5 text-green-500" />
                <p>{user.email}</p>
              </div>
              <div className="flex items-center space-x-3">
                <LuPhone className="w-5 h-5 text-purple-500" />
                <p>{user.phone}</p>
              </div>
              <div className="flex items-center space-x-3">
                <LuCalendar className="w-5 h-5 text-orange-500" />
                <p>Joined: {user.joined}</p>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setEditProfile(!editProfile)}
            className="mt-6 flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-md transition-colors"
          >
            <FiEdit2 className="w-4 h-4" /> Edit Profile
          </button>
        </div>

        {/* Edit Form */}
        {editProfile && (
          <div className="w-full md:w-1/2 border-t md:border-t-0 border-gray-200 pt-4 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full px-3 py-2 border border-gray-200 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="w-full px-3 py-2 border border-gray-200 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mobile
                </label>
                <input
                  type="tel"
                  defaultValue={user.phone}
                  className="w-full px-3 py-2 border border-gray-200 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditProfile(false)}
                  className="px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-md transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

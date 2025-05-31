import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import Layout from "../layout/Layout";
import { Link, useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  console.log(authUser, "autuuser----------");
  const navigation = useNavigate();
  return (
  <div className="min-h-screen w-full bg-gradient-to-br from-[#605DFF]/10 via-white to-[#605DFF]/20 flex flex-col items-center">
  {/* Navbar */}
  <Layout />

  {/* Profile Card */}
  <div className="mt-10 bg-white/90 backdrop-blur-md border border-[#605DFF]/30 shadow-lg rounded-3xl p-8 max-w-md w-full text-center transition-all duration-300 hover:shadow-2xl">
    <div className="flex flex-col items-center">
      {/* Profile Image */}
      <img
        className="w-28 h-28 rounded-full object-cover border-4 border-[#605DFF] shadow-md"
        src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
        alt="User Profile"
      />

      {/* Name */}
      <h2 className="mt-4 text-3xl font-bold text-[#605DFF]">{authUser?.name}</h2>

      {/* Email */}
      <p className="text-gray-600 text-sm mt-1">{authUser?.email}</p>

      {/* Edit Button */}
      <button
        onClick={() => navigation(`/update-profile/${authUser?.id}`)}
        className="mt-6 px-6 py-2 bg-[#423ffc] hover:bg-[#3a23c2] text-white rounded-full font-medium transition duration-200"
      >
        Edit Profile
      </button>
    </div>
  </div>
</div>


  );
};

export default ProfilePage;

import React from 'react'
import { useAuthStore } from '../store/useAuthStore';
import Layout from '../layout/Layout';

const ProfilePage = () => {
      const { authUser } = useAuthStore();
      console.log(authUser,"autuuser----------")
    
  return (
    <div className='flex flex-col w-full items-center h-screen'>
     <Layout/>

        <div className="border-2 border-gray-200 p-6 rounded-2xl max-w-md w-full text-center">
  <div className="flex flex-col items-center">

    {/* Profile Image */}
    <img
      className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500"
      src={
                    authUser?.image ||
                    "https://avatar.iran.liara.run/public/boy"
                  }
      alt="User Profile"
    />
    {/* Name */}
    <h2 className="mt-4 text-2xl font-semibold text-gray-800">{authUser?.name}</h2>
    {/* Email */}
    <p className="text-gray-500 text-sm mt-1">{authUser?.email}</p>
    {/* Optional: Edit Button */}
    <button className="mt-6 px-4 cursor-pointer py-2 bg-indigo-600 hover:bg-primary text-white rounded-lg transition duration-200">
      Edit Profile
    </button>
  </div>
</div>

    </div>
  )
}

export default ProfilePage
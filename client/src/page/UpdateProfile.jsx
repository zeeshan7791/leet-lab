import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../layout/Layout";
import {
  Code,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { z } from "zod";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const signUpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  name: z.string().min(3, "Name must be atleast of 3 characters"),
});
const UpdateProfile = () => {
    const[loading,setIsLoading]=useState(false)
   const navigation=useNavigate()
    
  const { authUser,updateProfile,isUpdateUserLoading,checkAuth } = useAuthStore();
const {id}=useParams()
    const {
        register,
        handleSubmit,
        formState:{errors},
      } = useForm({
        resolver:zodResolver(signUpSchema)
      })
    
    
   const onSubmit = async (data)=>{
          console.log(data,'data----- in pupdate-===========')
      try {
      await updateProfile(id,data)
      checkAuth()
      navigation('/')
      
    } catch (error) {
      console.error("profile updation failed" , error)
    }
      }
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#422AD5]/10 via-white to-[#422AD5]/20 flex flex-col items-center px-4 py-10">
  <Layout />

  <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-3xl p-8 w-full max-w-lg mt-10">
    <h2 className="text-2xl font-bold text-[#422AD5] text-center mb-6">Update Profile</h2>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium text-[#422AD5]">Name</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Code className="h-5 w-5 text-[#422AD5]/50" />
          </div>
          <input
            type="text"
            {...register("name")}
            defaultValue={authUser?.name}
            placeholder="John Doe"
            className={`input input-bordered w-full pl-10 rounded-xl ${
              errors.name ? "input-error" : ""
            }`}
          />
        </div>
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium text-[#422AD5]">Email</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-[#422AD5]/50" />
          </div>
          <input
            type="email"
            {...register("email")}
            defaultValue={authUser?.email}
            placeholder="you@example.com"
            className={`input input-bordered w-full pl-10 rounded-xl ${
              errors.email ? "input-error" : ""
            }`}
          />
        </div>
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn w-full bg-[#423ffc] hover:bg-[#3a23c2] text-white font-medium rounded-xl"
        disabled={isUpdateUserLoading}
      >
        {isUpdateUserLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading...
          </>
        ) : (
          "Update Profile"
        )}
      </button>
    </form>
  </div>
</div>

  )
}

export default UpdateProfile
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Code, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

import { z } from "zod";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be atleast of 6 characters"),
});
const ResetPassword = () => {
  const { isResetPassword, resetPassword } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {token}=useParams()

  const navigation=useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

 const onSubmit = async (password)=>{
    try {
      await resetPassword(password,token)
      navigation("/login")
      
    } catch (error) {
      console.error("reset-password failed" , error)
    }
  }

  return (
    <>
     <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#422AD5]/10 via-white to-[#422AD5]/20 px-4">
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl w-full max-w-md"
  >
    <h2 className="text-2xl font-bold text-[#422AD5] mb-6 text-center">Update Password</h2>

    {/* Password Field */}
    <div className="form-control w-full">
      <label className="label mb-1">
        <span className="label-text font-medium text-[#422AD5]">New Password</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-5 w-5 text-[#422AD5]/50" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          {...register("newPassword")}
          className={`input input-bordered w-full pl-10 pr-10 rounded-xl ${
            errors.password ? "input-error" : ""
          }`}
          placeholder="••••••••"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-[#422AD5]/50" />
          ) : (
            <Eye className="h-5 w-5 text-[#422AD5]/50" />
          )}
        </button>
      </div>
      {errors.password && (
        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
      )}
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="btn mt-6 w-full bg-[#423ffc] hover:bg-[#3a23c2] text-white font-semibold rounded-xl transition"
      disabled={isResetPassword}
    >
      {isResetPassword ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading...
        </>
      ) : (
        "Change Password"
      )}
    </button>
  </form>
</div>

    </>
  );
};

export default ResetPassword;

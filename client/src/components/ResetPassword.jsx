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
      <div className="h-screen flex items-center ">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Password */}
          <div className="form-control w-96">
            <label className="label">
              <span className="label-text font-medium mb-2">Update password</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-base-content/40" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                {...register("newPassword")}
                className={`input input-bordered w-full pl-10 mb-4 ${
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
                  <EyeOff className="h-5 w-5 text-base-content mb-2" />
                ) : (
                  <Eye className="h-5 w-5 text-base-content mb-2" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isResetPassword}
          >
            {isResetPassword ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
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

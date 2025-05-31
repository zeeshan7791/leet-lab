import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useParams } from "react-router-dom";
import { Code, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

import { z } from "zod";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const forgotPasswordSchema = z.object({
   email:z.string().email("Enter a valid email"),

});
const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
    const {forgotPassword , isforgotPassword} = useAuthStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });
 const onSubmit = async (data)=>{
  console.log(data,'email is-----')
    try {
      await forgotPassword(data)
      
    } catch (error) {
      console.error("forgot-password failed" , error)
    }
  };
  return (
    <>
   <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#422AD5]/10 via-white to-[#422AD5]/30 px-4">
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl w-full max-w-md"
  >

    {/* Email Field */}
    <div className="form-control w-full">
     
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mail className="h-5 w-5 text-[#422AD5]/50" />
        </div>
        <input
          type="email"
          {...register("email")}
          className={`input input-bordered w-full pl-10 rounded-xl ${
            errors.email ? "input-error" : ""
          }`}
          placeholder="you@example.com"
        />
      </div>
      {errors.email && (
        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
      )}
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={isforgotPassword}
      className="btn mt-6 w-full bg-[#423ffc] hover:bg-[#3a23c2] text-white font-semibold rounded-xl transition"
    >
      {isforgotPassword ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading...
        </>
      ) : (
        "Use your email"
      )}
    </button>
  </form>
</div>

    </>
  );
};

export default ForgotPassword;

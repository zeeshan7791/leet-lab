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
      <div className="h-screen flex items-center ">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* email */}
           <div className="form-control w-96 ">
                        <label className="label">
                          <span className="label-text font-medium mb-2">Email</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-base-content/40" />
                          </div>
                          <input
                            type="email"
                            {...register("email")}
                            className={`input input-bordered w-full pl-10 ${
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
            className="btn btn-primary w-full mt-2"
            disabled={isforgotPassword}
          >
            {isforgotPassword ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Verify your email"
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;

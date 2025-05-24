import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
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

const signUpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be atleast of 6 characters"),
  name: z.string().min(3, "Name must be atleast of 3 characters"),
});
const UpdateProfile = () => {
    const[loading,setIsLoading]=useState(false)
  const { authUser } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState:{errors},
      } = useForm({
        resolver:zodResolver(signUpSchema)
      })
    
    
        const onSubmit = async (data)=>{
       try {
        await signup(data)
        console.log("signup data" , data)
       } catch (error) {
         console.error("SignUp failed:", error);
       }
      }
  return (
     <div className="flex flex-col w-full items-center h-screen">
      <Layout/>
    <div>  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
                {/* name */}
                <div className="form-control  w-88">
         
                  <label className="label">
                    <span className="label-text font-medium">Name</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Code className="h-5 w-5 text-base-content/40" />
                    </div>
                    <input
                      type="text"
                      {...register("name")}
                      className={`input input-bordered w-full pl-10 ${
                        errors.name ? "input-error" : ""
                      }`}
                      defaultValue={authUser?.name}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}              
                </div>
    
                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
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
                      defaultValue={authUser?.email}

                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
    
                {/* Password */}
                {/* <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-base-content/40" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className={`input input-bordered w-full pl-10 ${
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
                        <EyeOff className="h-5 w-5 text-base-content/40" />
                      ) : (
                        <Eye className="h-5 w-5 text-base-content/40" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>
     */}
                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                 disabled={loading}
                >
                   {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
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
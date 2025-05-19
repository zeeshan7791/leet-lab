import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  Loader2,
} from "lucide-react";
const playlistSchema = z.object({
  name: z.string().min(6, "Name must be atleast of 4 characters"),
  description:z.string()
});

const PlaylistPage = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(playlistSchema),
  });
  const onSubmit = async (data) => {
 
console.log(data,'value in data--------')
    try {
      setLoading(true);
      const res = await axiosInstance.post("/playlist/create-playlist", {
       name: data.name,
       description:data.description
      });
      toast.success(res.data.message);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-screen w-full  ">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Name</span>
              </label>
              <div className="relative">
                <input
                  type="name"
                  {...register("name")}
                  className={`input input-bordered w-full pl-10 ${
                    errors.name ? "input-error" : ""
                  }`}
                  placeholder="name"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">description</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("description")}
                  className={`input input-bordered w-full pl-10 ${
                    errors.description ? "input-error" : ""
                  }`}
                  placeholder="description"
                />
              </div>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full">
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;

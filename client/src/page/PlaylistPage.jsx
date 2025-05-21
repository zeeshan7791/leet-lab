import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, PencilIcon, Trash, TrashIcon, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Loader2, Loader } from "lucide-react";
import PlaylistTable from "../components/PlaylistTable";
import { usePlaylistStore } from "../store/usePlaylistStore";
const playlistSchema = z.object({
  name: z.string().min(4, "Name must be atleast of 4 characters"),
  description: z.string(),
});
const PlaylistPage = () => {
  const [loading, setLoading] = useState(false);
    const {playlist,getAllPlaylists}=usePlaylistStore()
console.log(playlist,'value in edit---------')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(playlistSchema),
  });

  const onSubmit = async (data) => {
    console.log(data, "value in data--------");
    try {
      setLoading(true);
      if(playlist.id){
        console.log("hitt the update----------")
       const res = await axiosInstance.put(`/playlist/update-playlist/${playlist.id}`, {
        name: data.name,
        description: data.description,
      });
       toast.success(res.data.message)
      }
      else{
      const res = await axiosInstance.post("/playlist/create-playlist", {
        name: data.name,
        description: data.description,
      });
       toast.success(res.data.message)
    }
getAllPlaylists()
     ;
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error); // Show the custom backend error
        console.log(error.response.data.error)
      } else {
        toast.error(error.message);
      }
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
                  defaultValue={playlist?.name}
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
                <span className="label-text font-medium">Description</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  defaultValue={playlist?.description}
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
              ) :!playlist? (
                "Create"
              ):(
                "Update"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* table----------- */}
      <h2 className="text-center text-2xl font-bold">All Playlists</h2>
      <PlaylistTable  />
    </div>
  );
};

export default PlaylistPage;

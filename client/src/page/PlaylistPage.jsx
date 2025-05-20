import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, PencilIcon, Trash, TrashIcon, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  Loader2,Loader
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";
const playlistSchema = z.object({
  name: z.string().min(4, "Name must be atleast of 4 characters"),
  description:z.string()
});

const PlaylistPage = () => {


  const [loading, setLoading] = useState(false);
  const [allPlaylists, setAllPlaylists] = useState([]);

    const { authUser } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(playlistSchema),
  });

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("http://localhost:8080/api/v1/playlist");
      console.log(res.data.playlists,'value in playlists-------')
      setAllPlaylists(res.data.playlists);
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error); // Show custom backend error
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
  
  fetchPlaylists();
}, []);
  const onSubmit = async (data) => {
 
console.log(data,'value in data--------')
    try {
      setLoading(true);
      const res = await axiosInstance.post("/playlist/create-playlist", {
       name: data.name,
       description:data.description
      });
     fetchPlaylists()
      toast.success(res.data.message);
      setLoading(false);
    } catch (error) {
     
       if (error.response && error.response.data && error.response.data.error) {
    toast.error(error.response.data.error); // Show the custom backend error
  } else {
    toast.error(error.message);
  }
    } finally {
      setLoading(false);
    }
  };
 


 if(!allPlaylists){
    return (
      <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin"/>
      </div>
    )
  }

  // let allPlaylists=[{
  //   id:1,
  //   name:"Loops",
  //   description:"this is for loops"
  // },{
  //   id:2,
  //   name:"Conditions",
  //   description:"this is for Condition"
  // },{
  //   id:3,
  //   name:"Objects",
  //   description:"this is for Objects"
  // },{
  //   id:4,
  //   name:"Functions",
  //   description:"this is for functions"
  // }]

  const handleDeletePlaylist=async(id)=>{
    try {
        setLoading(true);
      const res = await axiosInstance.delete(`/playlist/${id}`);
   
      toast.success(res.data.message);
         fetchPlaylists()
      setLoading(false);
      
    } catch (error) {
     
       if (error.response && error.response.data && error.response.data.error) {
    toast.error(error.response.data.error); // Show the custom backend error
  } else {
    toast.error(error.message);
  }
    } finally {
      setLoading(false);
    }
  }
  const handleAddToPlaylist=()=>{}
  const handleEditProblem=()=>{}
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
                <span className="label-text font-medium">Description</span>
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

      {/* table----------- */}
      <h2 className="text-center text-2xl font-bold">All Playlists</h2>
        <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="table table-zebra table-lg bg-base-200 text-base-content">
          <thead className="bg-base-200">
            <tr>
           
              <th>Name</th>
              <th>Description</th>

              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
{
    allPlaylists.length > 0 ? (
          allPlaylists.map((playlist,idx)=>{
            

               return (
                  <tr key={playlist.id}>
                    <td>
                      <Link to={`/playlist/${playlist.id}`} className="font-semibold hover:underline">
                        {playlist.name}
                      </Link>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                     
                          <span
                            className=" text-xl "
                          >
                            {playlist.description}
                          </span>
                      
                      </div>
                    </td>
                  
                    <td>
                      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                        {authUser?.role === "ADMIN" && (
                          <div className="flex gap-2" key={playlist.id}>
                            <button
                              onClick={() => handleDeletePlaylist(playlist.id)}
                              className="btn btn-sm btn-error"
                            >
                              <TrashIcon className="w-4 h-4 text-white" />
                            </button>
                            <button onClick={()=>handleEditProblem(playlist.id)} className="btn btn-sm btn-warning">
                              <PencilIcon className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        )}
                          <button
                                                  className="btn btn-sm btn-outline flex gap-2 items-center"
                                                
                                                   onClick={()=>openModal(playlist.id)}
                                                >
                                                  <Bookmark className="w-4 h-4" />
                                                  <span className="hidden sm:inline">Save to Playlist</span>
                                                </button>
                       
                      </div>
                    </td>
                  </tr>
                );

          })
    ) : ( <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No Playlist found.
                </td>
              </tr>)
}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlaylistPage;

import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const usePlaylistStore=create((set)=>({
    playlists:[],
    playlist:null,
    isPlaylistsLoading:false,
    isPlaylistLoading:false,
    isDeletePlaylistLoading:false,
    isProblemLoading:false,
  
getAllPlaylists:async(id)=>{
   try {
      set({isPlaylistsLoading:true});
      const res = await axiosInstance.get("/playlist/all-playlists");
       const isfilteredPlayLists=res.data.playlists.filter((playlist)=>playlist.id!==id)
      set({isPlaylistsLoading:false});
      set({playlists:isfilteredPlayLists});
    } catch (error) {
      console.log(error)
     set({isPlaylistsLoading:false});
      // if (error.response?.data?.error) {
      //   toast.error(error.response.data.error); // Show custom backend error
      // } else {
      //   toast.error("Something went wrong.");
      // }
    } finally {
      set({isPlaylistsLoading:false});
    }

   
},
getPlaylistById:async(id)=>{
  console.log(id,"id in store=========")
    try {
      set({isPlaylistLoading:true});
      const res = await axiosInstance.get(`/playlist/get-playlist/${id}`);
    
      set({playlist:res.data.playlist});
      set({isPlaylistLoading:false});

    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error); // Show custom backend error
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      set({isPlaylistLoading:false});
    }
},
deletePlaylist:async(id)=>{
    try {
    set({isDeletePlaylistLoading:true})
    const res = await axiosInstance.delete(`/playlist/${id}`);
     toast.success(res.data.message)
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error); // Show custom backend error
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      set({isDeletePlaylistLoading:false});
    }
},
 deleteProblemFromPlaylist:async(id,playlist)=>{
  console.log(id,'deleteProblemFromPlaylist=======')
     set({ isProblemLoading: true });
      try {
         const res = await axiosInstance.post(`/playlist/${playlist.id}/remove-problem`,{
            problemIds:[id]
         })
       set({ isProblemLoading: false });

         toast.success(res.data.message)
       
      } catch (error) {
        console.log(error)
      }
      finally{
           set({ isProblemLoading: false });

      }
  
    }

}))
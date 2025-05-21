import React, { useEffect } from 'react'
import { usePlaylistStore } from '../store/usePlaylistStore'
import { Bookmark, PencilIcon, Trash, TrashIcon,Loader} from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const PlaylistTable = () => {
    const {playlists,playlist,getAllPlaylists,isPlaylistsLoading,deletePlaylist,isDeletePlaylistLoading,getPlaylistById}=usePlaylistStore()
  const { authUser } = useAuthStore();
  useEffect(() => {
  getAllPlaylists();

}, [getAllPlaylists]);


 const handleDeletePlaylist=async(id)=>{
 deletePlaylist(id)
  getAllPlaylists(id)
  }



  const handleEditProblem = (id) => {
    console.log(id,'value in id----')
    getPlaylistById(id)
  };

 if(isPlaylistsLoading||isDeletePlaylistLoading){
    return (
      <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin"/>
      </div>
    )
  }

    return (
    <>
    <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="table table-zebra table-lg bg-base-200 text-base-content">
          <thead className="bg-base-200">
            <tr>
           
              <th>Name</th>
              <th>Description</th>
  <th>problems</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
{
    playlists.length > 0 ? (
          playlists.map((playlist,idx)=>{
            

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
                  {
  playlist?.problems?.length > 0 ? (
    playlist.problems.map((problem, index) => (
      <span key={index}>{problem.name}</span>
    ))
  ) : (
    <span>No problems in this playlist.</span>
  )
}
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
      </div></>
  )
}

export default PlaylistTable
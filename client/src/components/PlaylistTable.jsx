import React, { useEffect } from 'react'
import { usePlaylistStore } from '../store/usePlaylistStore'
import { Bookmark, PencilIcon, Trash, TrashIcon,Loader} from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useState } from 'react';
import { useMemo } from 'react';

const PlaylistTable = () => {
    const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

    const {playlists,getAllPlaylists,isPlaylistsLoading,deletePlaylist,isDeletePlaylistLoading,}=usePlaylistStore()
  const { authUser } = useAuthStore();
  const navigation=useNavigate()
  useEffect(() => {
  getAllPlaylists();

}, [getAllPlaylists]);


  let filteredPlaylist = useMemo(()=>{
    return (playlists || [])
    .filter((playlist)=> playlist.name.toLowerCase().includes(search.toLowerCase()))
  },[playlists , search])

// pagination
 const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredPlaylist.length / itemsPerPage);
  const paginatedPlaylists = useMemo(() => {
    return filteredPlaylist.slice(
      (currentPage - 1) * itemsPerPage, // 1 * 5 = 5 ( starting index = 0)
      currentPage * itemsPerPage // 1 * 5  = (0 , 10)
    );
  }, [filteredPlaylist, currentPage]);




 const handleDeletePlaylist=async(id)=>{
 deletePlaylist(id)
  getAllPlaylists(id)
  }


  


  const handleEditProblem = (id) => {
   navigation(`/update-playlist/${id}`)
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
     <div className="flex flex-wrap justify-end  items-center m-6 gap-4 ">
        <input
          type="text"
          placeholder="Search by name"
          className="input input-bordered  w-full md:w-1/4  bg-base-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
      </div>
      
    <div className="overflow-x-auto  m-auto rounded-xl shadow-md">
        <table className="table table-zebra table-lg bg-base-200 text-base-content">
          <thead className="bg-base-200">
            <tr>
           
              <th>Name</th>
              <th>Description</th>
              <th>No of Problems</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
{
    paginatedPlaylists.length > 0 ? (
          paginatedPlaylists.map((playlist,idx)=>{
            

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
                      <div className="flex flex-wrap gap-1">
                     
                          <span
                            className=" text-xl "
                          >
                            {playlist.problems.length}
                          </span>
                      
                      </div>
                    </td>
                     
                  {/* <td>
                  {
  playlist?.problems?.length > 0 ? (
    playlist.problems.map((problem, index) => (
      <span key={index}>{problem.name}</span>
    ))
  ) : (
    <span>No problems in this playlist.</span>
  )
}
                  </td> */}
                  
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
       <div className="flex justify-center mt-6 gap-2">
<button
className="btn btn-sm"
disabled={currentPage === 1}
onClick={()=>setCurrentPage((prev)=>prev-1)}
>
Prev
</button>
    <span className="btn btn-ghost btn-sm">
          {currentPage} / {totalPages}
        </span>
 <button
className="btn btn-sm"
disabled={currentPage === totalPages}
onClick={()=>setCurrentPage((prev)=>prev+1)}
>
Next
</button>
  </div>
      </>
  )
}

export default PlaylistTable
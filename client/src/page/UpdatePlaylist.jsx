import React from 'react'
import CreatePlaylistForm from '../components/CreatePlaylistForm'
import { useParams } from 'react-router-dom';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { useEffect } from 'react';

const UpdatePlaylist = () => {
  const { id } = useParams();
const {playlist,getAllPlaylists,getPlaylistById,isPlaylistLoading}=usePlaylistStore()


 useEffect(() => {
    if (id) getPlaylistById(id);
  }, [id]);
  return (
    <>
    
     <div className="h-screen w-full  ">
     <CreatePlaylistForm playlist={playlist}/>
    </div>
    
    </>
  )
}

export default UpdatePlaylist
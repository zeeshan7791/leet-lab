import React from 'react'
import { useParams } from 'react-router-dom'

const PlaylistProblems = () => {
    const {id}=useParams()
    
  return (
    <div>PlaylistProblems
        <h1>{id}</h1>
    </div>
  )
}

export default PlaylistProblems
import { useParams } from 'react-router-dom'
import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, PencilIcon, Trash, TrashIcon, Plus,X } from "lucide-react";
import { usePlaylistStore } from '../store/usePlaylistStore';
import { useAuthStore } from '../store/useAuthStore';
import { useProblemStore } from '../store/useProblemStore';
import { axiosInstance } from '../lib/axios';

const PlaylistProblems = () => {
    const {id}=useParams()
    const navigation=useNavigate()
     const { getAllProblems, problems, isProblemsLoading } = useProblemStore();
   
 const {playlist,getPlaylistById}=usePlaylistStore()
  const { authUser } = useAuthStore();


    useEffect(() => {
      console.log(id,'id where I am checking')
     getPlaylistById(id);

   
   }, [id]);
  
   console.log(playlist,"problems in my playlist------")

   
  const handleEditProblem = (id) => {
    navigation(`/update-problem/${id}`)
  };
  const [loading, setIsLoading] = useState(false);

   const handleDelete = async(id)=>{
    setIsLoading(true)
    try {
       const res = await axiosInstance.post(`/playlist/${playlist.id}/remove-problem`,{
          problemIds:[id]
       })
   setIsLoading(false)
       toast.success(res.data.message)
     
    } catch (error) {
      console.log(error)
    }

  }
  return (
    <div>PlaylistProblems
        <h1>{id}</h1>
        <div className="overflow-x-auto rounded-xl shadow-md">
               <table className="table table-zebra table-lg bg-base-200 text-base-content">
                 <thead className="bg-base-200">
                   <tr>
                     <th>Solved</th>
                     <th>Title</th>
                     <th>Tags</th>
                     <th>Difficulty</th>
                     <th>Actions</th>
                   </tr>
                 </thead>
                 <tbody>
       {
           playlist?.problems.length > 0 ? (
                 playlist?.problems.map((problem)=>{
       
                   const isSolved = problem.problem.solvedBy.some((user)=>user.userId === authUser?.id);
       
                      return (
                         <tr key={problem.problem.id}>
                           <td>
                             <input
                               type="checkbox"
                               checked={isSolved}
                               readOnly
                               className="checkbox checkbox-sm"
                             />
                           </td>
                           <td>
                             <Link to={`/problem/${problem.problem.id}`} className="font-semibold hover:underline">
                               {problem.problem.title}
                             </Link>
                           </td>
                           <td>
                             <div className="flex flex-wrap gap-1">
                               {(problem.problem.tags || []).map((tag, idx) => (
                                 <span
                                   key={idx}
                                   className="badge badge-outline badge-warning text-xs font-bold"
                                 >
                                   {tag}
                                 </span>
                               ))}
                             </div>
                           </td>
                           <td>
                             <span
                               className={`badge font-semibold text-xs text-white ${
                                 problem.difficulty === "EASY"
                                   ? "badge-success"
                                   : problem.difficulty === "MEDIUM"
                                   ? "badge-warning"
                                   : "badge-error"
                               }`}
                             >
                               {problem.problem.difficulty}
                             </span>
                           </td>
                           <td>
                             <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                               {authUser?.role === "ADMIN" && (
                                 <div className="flex gap-2" key={problem.problem.id}>
                                   <button
                                     onClick={() => handleDelete(problem.problem.id)}
                                     className="btn btn-sm btn-error"
                                   >
                                     <TrashIcon className="w-4 h-4 text-white" />
                                   </button>
                                   <button onClick={()=>handleEditProblem(problem.problem.id)} className="btn btn-sm btn-warning">
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
                         No problems found.
                       </td>
                     </tr>)
       }
                 </tbody>
               </table>
             </div>
    </div>
  )
}

export default PlaylistProblems
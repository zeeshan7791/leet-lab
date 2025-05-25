import { useParams } from 'react-router-dom'
import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, PencilIcon, Trash, TrashIcon, Plus,X, Loader } from "lucide-react";
import { usePlaylistStore } from '../store/usePlaylistStore';
import { useAuthStore } from '../store/useAuthStore';
import { useProblemStore } from '../store/useProblemStore';
import { axiosInstance } from '../lib/axios';

const PlaylistProblems = () => {
    const {id}=useParams()
    const navigation=useNavigate()
      const [search, setSearch] = useState("");
      const [difficulty, setDifficulty] = useState("ALL");
      const [selectedTag, setSelectedTag] = useState("ALL");
      const [currentPage, setCurrentPage] = useState(1);
     const { getAllProblems, problems, isProblemsLoading, } = useProblemStore();
   
 const {playlist,getPlaylistById,isPlaylistLoading,deleteProblemFromPlaylist}=usePlaylistStore()
  const { authUser } = useAuthStore();

    const allTags = useMemo(() => {
      if (!Array.isArray(playlist?.problems)) return [];
  
      const tagsSet = new Set();
  
      playlist?.problems.forEach((p) => p.problem.tags?.forEach((t) => tagsSet.add(t)));
  
      return Array.from(tagsSet);
    }, [playlist?.problems]);
  
 let filteredProblems = useMemo(()=>{
    return (playlist?.problems || [])
    .filter((problem)=> problem.problem.title.toLowerCase().includes(search.toLowerCase()))
    .filter((problem)=>difficulty === "ALL" ? true: problem.problem.difficulty === difficulty)
     .filter((problem) =>
        selectedTag === "ALL" ? true : problem.problem.tags?.includes(selectedTag)
      )
  },[playlist?.problems, search , difficulty , selectedTag])


  
    const itemsPerPage = 5;
    const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
    const paginatedProblems = useMemo(() => {
      return filteredProblems.slice(
        (currentPage - 1) * itemsPerPage, // 1 * 5 = 5 ( starting index = 0)
        currentPage * itemsPerPage // 1 * 5  = (0 , 10)
      );
    }, [filteredProblems, currentPage]);

    useEffect(() => {
      console.log(id,'id where I am checking')
      setIsLoading(true)
     getPlaylistById(id);
      setIsLoading(false)
   
   }, [id]);
  
     const difficulties = ["Easy", "Medium", "Hard"];
   console.log(playlist,"problems in my playlist------")

   
  const handleEditProblem = (id) => {
    navigation(`/update-problem/${id}`)
  };
  const [loading, setIsLoading] = useState(false);

   const handleDelete = async(id)=>{
    deleteProblemFromPlaylist(id,playlist)

  }

   if(isPlaylistLoading){

    return (
      <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin"/>
      </div>
    )
  }
  return (
    <div>
        <h1 className='text-center text-xl text-primary mb-2'>Problems in {playlist?.name} playlist</h1>
        <div className="overflow-x-auto rounded-xl shadow-md">
           <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by title"
          className="input input-bordered w-full md:w-1/3 bg-base-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select select-bordered bg-base-200"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="ALL">All Difficulties</option>
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <select
          className="select select-bordered bg-base-200"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="ALL">All Tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
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
           paginatedProblems?.length > 0 ? (
                 paginatedProblems?.map((problem)=>{
       
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
    </div>
    
  )
}

export default PlaylistProblems
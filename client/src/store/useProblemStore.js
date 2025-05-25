import { create } from "zustand";

import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });

      const res = await axiosInstance.get("/problems/get-all-problems");
console.log(res.data,'value in data')
      set({ problems: res.data.problems });
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error in getting problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id) => {
    try {
      set({ isProblemLoading: true });
 
      const res = await axiosInstance.get(`/problems/get-problem/${id}`);

      set({ problem: res.data.problem });
    return  toast.success(res.data.message);
      
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error in getting problems");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      const res = await axiosInstance.get("/problems/get-solved-problem");

      set({ solvedProblems: res.data.problems });
    } catch (error) {
      console.log("Error getting solved problems", error);
      toast.error("Error getting solved problems");
    }
  },
   deleteProblemById: async (id) => {
    try {
       set({ isProblemLoading: true });
          const res = await axiosInstance.delete(`/problems/delete-problem/${id}`)
        
          toast.success(res.data.message)
           set({ isProblemLoading: false });
         
       } catch (error) {
         toast.error(error.message)
       }
       finally{
         set({ isProblemLoading: false });
       }
  },
 
}));

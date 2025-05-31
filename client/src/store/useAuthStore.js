import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,
  isforgotPassword:false,
  isResetPassword:false,
  isUpdateUserLoading:false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      console.log("checkauth response", res.data);

      set({ authUser: res.data.user });
    } catch (error) {
      console.log("❌ Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigninUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error signing up", error);
      toast.error("Error signing up");
    } finally {
      set({ isSigninUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);

      set({ authUser: res.data.user });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error logging in", error);
      toast.error("Error logging in");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.get("/auth/logout");
      set({ authUser: null });

      toast.success("Logout successful");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error("Error logging out");
    }
  },
  updateProfile:async(id,data)=>{
    try {
            set({ isUpdateUserLoading: true });
            const res=await axiosInstance.put(`/auth/update/${id}`, data)
            console.log("ipdate profile data" , data)
           set({ isUpdateUserLoading: false });

            toast.success(res.data.message)
           } catch (error) {
             console.error("Profile Updation failed:", error);
           }
           finally{
          set({ isUpdateUserLoading: false });

           }

  },
    forgotPassword: async (email) => {
    set({ isforgotPassword: true });
      try {
     

      const res = await axiosInstance.post(`/auth/forgot-password`,email);
       set({ isforgotPassword: false });


      toast.success(res.data.message);
    } catch (error) {
      console.error("Signup failed", error);
    } finally {
       set({ isforgotPassword: false });

    }
  },
   resetPassword: async (newPassword,token) => {
    set({ isResetPassword: true });
      try {
     

      const res = await axiosInstance.post(`/auth/reset-password/${token}`,newPassword);
       set({ isResetPassword: false });


      toast.success(res.data.message);
      
    } catch (error) {

      console.error("Signup failed", error);
    } finally {
       set({ isResetPassword: false });

    }
  },

}));
import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route ,Navigate} from "react-router-dom";
import HomePage from './page/HomePage';
import LoginPage from './page/LoginPage';
import SignUpPage from './page/SignUpPage';
import AddProblem from './page/AddProblem';
import { useAuthStore } from './store/useAuthStore';
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
import Layout from './layout/Layout';
import ProblemPage from './page/ProblemPage';
import UpdateProblem from './page/UpdateProblem';
import AdminRoute from './components/AdminRoute';
import PlaylistPage from './page/PlaylistPage';
import PlaylistProblems from './components/PlaylistProblems';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); 
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
  <div className='flex flex-col items-center justify-start'>
     <Toaster />
      <Routes>
         <Route path="/" element={<Layout />}>
          <Route index element={authUser?<HomePage />:<Navigate to={"/login"}/>} />
         
          <Route path="/signup" element={!authUser?<SignUpPage />:<Navigate to={"/"}/>} />
          <Route path="/login" element={!authUser?<LoginPage />:<Navigate to={"/"}/>} />
            <Route
          path="/problem/:id"
          element={authUser ? <ProblemPage /> : <Navigate to={"/login"} />}
        />
        
              <Route element={<AdminRoute />}> 
          <Route path="/add-problem"     element={authUser ? <AddProblem /> : <Navigate to="/" />}/>
          <Route path="/update-problem/:id"     element={authUser ? <UpdateProblem /> : <Navigate to="/" />}/>
              </Route>
               <Route
          path="/playlist"
          element={authUser ? <PlaylistPage/> : <Navigate to={"/login"} />}
        />
         <Route
          path="/playlist/:id"
          element={authUser ? <PlaylistProblems/> : <Navigate to={"/login"} />}
        />
    
     </Route>
     
      </Routes>
      
      </div>
    
  )
}

export default App
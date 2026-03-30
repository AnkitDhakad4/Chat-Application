import {Toaster}from 'react-hot-toast'
import { Route, Routes } from "react-router-dom";
import { ChatPage, LoginPage, SignupPage } from "./pages/import.js";
import { Navigate } from 'react-router-dom';
import authStore from './store/userAuth.store.js';
import Loading from './components/Loading.jsx';
function App() {
  const {authStatus}=authStore()

  // if(true) return (<Loading/>)

  return (
    <>
   <div className="min-h-screen bg-[#020205] relative flex items-center justify-center p-4 overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-gradient-to-b from-violet-600/20 to-transparent blur-3xl opacity-50" />
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="absolute bottom-0 left-0 size-80 bg-fuchsia-600/10 blur-[100px]" />

      {authStatus?<Loading s="50" />:
      <Routes>
        <Route path="/" element={authStatus ? <ChatPage/> : <Navigate to={'/login'} />} />
        <Route path="/signup" element={!authStatus ? <SignupPage /> : <Navigate to={'/'}/>} />
        <Route path="/login" element={!authStatus ? <LoginPage/> :<Navigate to={'/'}/>} />
      </Routes>}
</div>
      <Toaster/>
    </>
  );
}

export default App;

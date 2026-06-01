import {Toaster}from 'react-hot-toast'
import { Route, Routes } from "react-router-dom";
import { ChatPage, LoginPage, SignupPage } from "./pages/import.js";
import { Navigate } from 'react-router-dom';
import authStore from './store/userAuth.store.js';
// import Loading from './components/Loading.jsx';
function App() {
  const {authStatus}=authStore()

  // if(true) return (<Loading/>)

  return (
    <>
   
      <Routes>
        <Route path="/" element={authStatus ? <ChatPage/> : <Navigate to={'/login'} />} />
        <Route path="/signup" element={!authStatus ? <SignupPage /> : <Navigate to={'/'}/>} />
        <Route path="/login" element={!authStatus ? <LoginPage/> :<Navigate to={'/'}/>} />
      </Routes>
      <Toaster/>
    </>
  );
}

export default App;

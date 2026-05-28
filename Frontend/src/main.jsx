import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import ChatPage from "./pages/ChatPage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <div  className=' border-box overflow-hidden h-screen w-screen bg-[#FFFFFF]  text-black'>
      <App />
      </div>

    </BrowserRouter>
  
  </>
      
  
);

import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
// import {io} from "socket.io-client";
import useChatStore from './useChatStore.js'
import groupStore from "./group.store.js";
import requestStore from "./requests.store.js";
import socket from "../socket/socket.js";

const baseUrl = import.meta.env.VITE_SOCKET_URL;
// console.log(baseUrl)

const initialState={
  authStatus: false,
  isCheckingAuth: false,
  isLoading: false, 
  user: {},
  loggedInUser:{},
  socket: null,
  onlineUsers: new Set(),
  isUserUpdating:false
}


const authStore = create((set, get) => ({
  // authStatus: false,
  // isCheckingAuth: false,
  // isLoading: false, 
  // user: {},
  // socket: null,
  // onlineUsers: new Set(),
  ...initialState,

  getMe: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get("/users/me");
      set({ user: response.data.data, authStatus: true });
      get().connect();
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isCheckingAuth: false });
    } 
  },
  signup: async (data) => {
    set({ isLoading: true });
    try {
     
      const res = await axiosInstance.post("/users/signup", data);
      set({ user: res.data.data, authStatus: true });
      get().connect();
      toast.success("Account is created successfully !");
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get("/users/check");
     
      set({ user: response.data.data, authStatus: true });
      get().connect();
      toast.success('Welcome !!');
    } catch (error) {
      
      toast.error(error.response?.data?.message);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data) => {
    try {
      set({ isLoading: true });
      
      const response = await axiosInstance.post("/users/login", data);
      set({ user: response.data.data, authStatus: true });
      set({ loggedInUser: response.data.data });
       get().connect();
      toast.success("Login Successfully !");
    } catch (error) { 
      console.log(error)
      toast.error(error.response?.data?.message);
    } finally {
      set({ isLoading: false });    
    }
  },
  clearSession: () => {
    useChatStore.getState().setSelectedUser(null);
    get().disconnect();
    useChatStore.getState().reset();
    groupStore.getState().reset();
    requestStore.getState().reset();
    set({ ...initialState });
  },
  logout: async () => {
    try {
      await axiosInstance.post("/users/logout");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not contact the server while logging out.");
    } finally {
      get().clearSession();
      toast.success("You have been logged out.");
    }
  },
  updateProfile:async(url)=>{
    try {
      set({isLoading:true})
      const resp=await axiosInstance.post('/users/updateProfilePic',{url})
     
      set({user:resp.data.data})
      toast.success("Profile pic updated successfully")
    } catch (error) {
      console.error(error)
      throw error 
    } finally {
      set({isLoading:false})
    }
  },

  updateUser:async(formData)=>{
    try {
      set({isUserUpdating:true})
      const resp=await axiosInstance.post('/users/updateProfile',formData)
    
      set({user:resp.data.data})
       toast.success("Profile updated successfully")
    } catch (error) {
      console.log(error?.message)
    } finally{
      set({isUserUpdating:false})
    }
  }
,
  connect: () => {

    // if (!get().authStatus || socket?.connected) return;


    socket?.removeAllListeners();//it removes all callback means custom events 
   
    
    socket?.disconnect();//it disconnnects the connection to prevent the duplicate connections

  
    
   
     
      socket.on("getOnlineUsers", (userIds) => {
       
        set({ onlineUsers: new Set(userIds) });
      });

      socket.connect()
  

   
    // set({ socket }); 
  },
  disconnect: () => {
  
    if (!socket) return;

    socket.removeAllListeners();
    if (socket.connected) {
      socket.disconnect();
    
    }

    set({ socket: null, onlineUsers: [] });
  },
   reset:()=>{
    set({...initialState})
  }
  
}));

export default authStore;

import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";
import useChatStore from './useChatStore.js'
import groupStore from "./group.store.js";
import requestStore from "./requests.store.js";

const baseUrl = import.meta.env.VITE_SOCKET_URL;
console.log(baseUrl)

const initialState={
  authStatus: false,
  isCheckingAuth: false,
  isLoading: false, 
  user: {},
  loggedInUser:{},
  socket: null,
  onlineUsers: new Set()
}


const authStore = create((set, get) => ({
  // authStatus: false,
  // isCheckingAuth: false,
  // isLoading: false, 
  // user: {},
  // socket: null,
  // onlineUsers: new Set(),
  ...initialState,


  signup: async (data) => {
    set({ isLoading: true });
    try {
      console.log(data);
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
      console.log(response.data);
      set({ user: response.data.data, authStatus: true });
      get().connect();
      toast.success('Welcome !!');
    } catch (error) {
      console.log("error for is toast ", error);
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
      toast.error(error.response?.data?.message);
    } finally {
      set({ isLoading: false });    
    }
  },
  logout: async () => {
    // console.log("In log out")
    try {
      useChatStore.getState().setSelectedUser(null);
      await axiosInstance.post("/users/logout");
      get().disconnect();
  

      // set({ authStatus: false });
      console.log("Reseting another stores")
      useChatStore.getState().reset();
      groupStore.getState().reset();
      requestStore.getState().reset();
      set({...initialState});
          toast.success("I will wait for you! 🥺 👋👋", {
        autoClose: 3000,
        pauseOnHover: true,
      });
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  },
  updateProfile:async(url)=>{
    try {
      set({isLoading:true})
      const resp=await axiosInstance.post('/users/updateProfilePic',{url})
      console.log("Profile is updated successfully ",resp.data.data)
      set({user:resp.data.data})
      toast.success("Profile pic updated successfully")
    } catch (error) {
      console.error(error)
      throw error 
    } finally {
      set({isLoading:false})
    }
  },
  connect: () => {
    if (!get().authStatus || get().socket?.connected) return;

    get().socket?.removeAllListeners();//it removes all callback means custom events 
    get().socket?.disconnect();//it disconnnects the connection to prevent the duplicate connections

    const socket = io(baseUrl, {
      withCredentials: true,
      autoConnect: false,
    });

    
    // console.log("socket is created ", socket)
    socket.on("getOnlineUsers", (userIds) => {
      // console.log("rsponse from the getOnlineUser in frontend ",userIds)
      set({ onlineUsers: new Set(userIds) });
    });

    socket.connect();
    set({ socket });
  },
  disconnect: () => {
    const socket = get().socket;
    if (!socket) return;

    socket.removeAllListeners();
    if (socket.connected) {
      socket.disconnect();
      // console.log("User is disconnected successfully");
    }

    set({ socket: null, onlineUsers: [] });
  },
   reset:()=>{
    set({...initialState})
  }
  
}));

export default authStore;

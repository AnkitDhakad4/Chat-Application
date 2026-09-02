import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
// import authStore from "./userAuth.store.js";
import { devtools } from "zustand/middleware";
import socket from "../socket/socket.js";
import authStore from "./userAuth.store.js";
import {triggerNotification} from '../utils/notification.util.jsx'

const initialState={
  chatPartners: [],
  tempMsgStore: [],
  contacts: [],
  selectedTab:null,
  // localStorage.getItem("selectedTab") || "Chats",
  selectedUser: null,
  // messages: [],
  messages:{},
  isUsersLoading: false,
  isMessageLoading: false,
  isSoundOn: localStorage.getItem("isSoundOn") === "true",
  isImageUploading: false,
  notificationsToUsers:new Set()
}
const useChatStore = create((set, get) => ({
  
  ...initialState,

  toggleSound: () => {
    const nextSoundState = !get().isSoundOn;
    localStorage.setItem("isSoundOn", String(nextSoundState));
    set({ isSoundOn: nextSoundState });
  },

  setSelectedTab: (tab) => {
     console.log(tab)
    set({ selectedTab: tab });
    // localStorage.setItem("selectedTab", String(tab));
  },

  getchatPartners: async () => {
    const { chatPartners } = get();
    // if (chatPartners && chatPartners.length > 0) return chatPartners;

    set({ isUsersLoading: true });
    try {
      const resp = await axiosInstance.get("/message/chats");
          
      set({ chatPartners: resp.data.data });
      return resp.data.data
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getContacts: async () => {
    const { contacts, chatPartners } = get();



    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/contacts");
      const allUsers = res.data.data;
      
      const partnerIds = new Set(chatPartners.map((partner) => partner._id));

      const data = allUsers.filter((user) => {
        return !partnerIds.has(user._id);
      });

      
      set({ contacts: data });
      return data;
    } catch (error) {
      console.log(error)
      // toast.error(error?.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (id) => {
    set({ isMessageLoading: true });
    let {messages}=get()

    if(messages[id]!==undefined) 
    {
      set({isMessageLoading:false})
      return
    }
    try {
     
      const res = await axiosInstance.get(`/message/${id}`);
      // console.log(res)
      const data=res.data.data || []
      set((state)=>({
        messages:{
          ...state.messages,
          [id]:data
        }        
      }))
      // set({ messages: res.data.data });
      
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.error);
    } finally {
      set({ isMessageLoading: false });
    }
  },

  setSelectedUser: (user) => {
    // console.log(user)
    const currentNotifications=get().notificationsToUsers
    if(currentNotifications && currentNotifications?.has(user?._id))
    {
      currentNotifications.delete(user._id)
    }

    set({ selectedUser: user ,notificationsToUsers:currentNotifications});

  },

  sendMessage: async ({messageText,url}) => {
    const { user } = authStore.getState();
    const { messages, selectedUser } = get();

    const prvmessages=messages[selectedUser._id]
    const optimisticId=`temp-${Date.now()}`
    const artificialMessage={
      _id:optimisticId,
      senderId:{_id:user._id},
      receiverId:selectedUser._id,
      text:messageText,
      image:url,
      createdAt:new Date().toISOString(),
      isSending:true,
    }
    set((state)=>({
      messages:{
        ...messages,
        [selectedUser._id]:[...prvmessages,artificialMessage]
      }
    }))

    try {
     
      const { contacts, selectedUser, chatPartners } = get();
      const resp = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        { text: messageText, image: url },
      );

      const savedMessage=resp.data.message
      set((state)=>({
        messages:{
          ...messages,
          [selectedUser._id]:[...prvmessages,savedMessage]
        }
        // messages:state.messages.map((msg)=>(msg._id ===optimisticId? savedMessage:msg))
      }));
    } catch (error) {
      console.log(error);
      set({messages:prvmessages})
      //   toast.error(error.response?.data?.error)
    }
  },

  getTokenForUpload: async (folder) => {
    try {
      const resp = await axiosInstance.post("/message/uploadToken", { folder });
     
      return {
        timestamp: resp.data.data.timestamp,
        signature: resp.data.data.signature,
        apiKey: resp.data.data.apiKey,
      };
    } catch (error) {
      console.error(error);
    }
  },
  
  uploadOnCloudinary: async (formData) => {
    
    set({ isImageUploading: true });
    try {
      const resp = await fetch(
        `https://api.cloudinary.com/v1_1/ankitdhakad/image/upload/`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await resp.json();
      console.log("resp from uploadoncloudinary", data);
      return data;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    } finally {
      set({ isImageUploading: false });
    }
  },

  subscribeMessage: () => {
    const { selectedUser, isSoundOn } = get();
    
    // if (!selectedUser) return;
    // const socket = authStore.getState().socket;
    // const {messages}=get()
    socket.on("newMessage", (msg) => {

        const selectedTab=get().selectedTab
        console.log(selectedTab)
        if(get().selectedUser?._id !== msg.senderId._id )
        {
           const currentState=get().notificationsToUsers
            set({notificationsToUsers:new Set([...currentState,msg.senderId._id])})
          triggerNotification(msg.senderId.name,msg.text,msg.senderId.profilePic)
        }
    

      const authUser=authStore.getState().user;
      const selectedUser=get().selectedUser;

    
      

      // console.log("in subscribe message authuser",authUser)
      if(!selectedUser) return;

      const incomming=msg.senderId._id===selectedUser._id && msg.receiverId === authUser._id;
      const outgoing=msg.receiverId ===selectedUser._id && msg.senderId._id ===authUser._id;
      

      if (!incomming && !outgoing) return;

      // set({ messages: [...get().messages, msg] });
      const {messages}=get()
      const prvmessages=messages[selectedUser._id]
     set((state)=>({
      messages:{
        ...messages,
        [selectedUser._id]:[...prvmessages,msg]
      }
    }))

      if (isSoundOn) {
        const playSound = new Audio("./sounds/notification.mp3");
        playSound.currentTime = 0;
        playSound
          .play()
          .catch((error) =>
            console.error(
              "errorwhile playing the notification sound ",
              error.message,
            ),
          );
      }
    });
  },

  unSubscribeMessage: () => {
    // const socket = authStore.getState().socket;
    socket?.off("newMessage");
  },

  reset:()=>{
    // console.log("Reseting the useChatstore")
    set({...initialState})
  }
}));

export default useChatStore;

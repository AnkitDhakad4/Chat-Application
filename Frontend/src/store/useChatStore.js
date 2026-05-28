import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
import authStore from "./userAuth.store.js";
const useChatStore = create((set, get) => ({
  chatParteners: [],
  tempMsgStore: [],
  contacts: [],
  selectedTab: localStorage.getItem('selectedTab') || 'Chats' ,
  selectedUser: null,
  messages: [],
  isUsersLoading: false,
  isMessageLoading: false,
  isSoundOn: localStorage.getItem("isSoundOn") === "true",
  isImageUploading: false,

  toggleSound: () => {
    const nextSoundState = !get().isSoundOn;
    localStorage.setItem("isSoundOn", String(nextSoundState));
    set({ isSoundOn: nextSoundState });
  },

  setSelectedTab: (tab) => {
   
    set({ selectedTab: tab });
    localStorage.setItem('selectedTab',String(tab))

  },

  getChatParteners: async () => {
    const { chatParteners } = get();
    if (chatParteners && chatParteners.length > 0) return;

    set({ isUsersLoading: true });
    try {
      const resp = await axiosInstance.get("/message/chats");
      set({ chatParteners: resp.data.data });
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getContacts: async () => {
    const { contacts, chatParteners } = get();

    if (contacts && contacts.length > 0) return;

    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/contacts");
      const allUsers = res.data.data;

      const data = allUsers.filter((user) => {
        const isAlreadyPartener = chatParteners.some(
          (partener) => partener._id === user._id,
        );
        return !isAlreadyPartener;
      });

      set({ contacts: data });
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (id) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${id}`);
      set({ messages: res.data.data });
    } catch (error) {
      toast.error(error.response?.data?.error);
    } finally {
      set({ isMessageLoading: false });
    }
  },

  setSelectedUser: (user) => {
    // console.log(user)
    set({ selectedUser: user });
  },

  sendMessage: async (image, message) => {
    // const { user } = authStore.getState();
    // const { messages, selectedUser } = get();

    // const artificialMessage = {
    //   _id: {
    //     $oid: new Date().toISOString()
    //   },
    //   senderId: {
    //     $oid: user._id,
    //   },
    //   recieverId: {
    //     $oid: selectedUser._id,
    //   },
    //   text: message,
    //   image: image,
    //   createdAt: {
    //     $date: new Date().toISOString(),
    //   },
    //   updatedAt: {
    //     $date: new Date().toISOString(),
    //   },
    //   __v: 0,
    // };
    // set({ messages: [...get().messages, artificialMessage] });

    try {
      const { contacts, selectedUser, chatParteners } = get();
      const resp = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        { text: message, image: image },
      );

      const newContacts = contacts.filter(
        (user) => user._id !== selectedUser._id,
      );
      const newChatParteners = contacts.filter(
        (user) => user._id === selectedUser._id,
      );

      if (newChatParteners.length > 0) {
        set({
          contacts: newContacts,
          chatParteners: chatParteners.concat(newChatParteners),
        });
      }
      // console.log("Message in sendMessage is ",resp.data.message)
      set({ messages: [...get().messages, resp.data.message] });
    } catch (error) {
      console.log(error);
      //   toast.error(error.response?.data?.error)
    }
  },

  getTokenForUpload: async (folder) => {
    try {
      const resp = await axiosInstance.post("/message/uploadToken", { folder });
      // console.log("resp from getTokenForUpload", resp);
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
    console.log("In upload on cloudinary");
    set({ isImageUploading: true });
    try {
      const resp = await fetch(
        `https://api.cloudinary.com/v1_1/ankitdhakad/image/upload`,
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
    const {selectedUser,isSoundOn}=get()
    if(!selectedUser) return

    const socket=authStore.getState().socket
    // const {messages}=get()
    socket.on('newMessage',(msg)=>{

      const isMessageFromSelectedUser = msg.senderId === selectedUser._id || msg.recieverId === selectedUser._id;
        
      if (!isMessageFromSelectedUser) return;

      set({messages:[...get().messages,msg]})



      if(isSoundOn)
      {
        const playSound=new Audio('./sounds/notification.mp3')
        playSound.currentTime=0;
        playSound.play().catch((error)=>console.error("errorwhile playing the notification sound ",error.message))
      }

    })

     

  },

  unSubscribeMessage:()=>{
    const socket=authStore.getState().socket
    socket.off('newMessage')
  }
}));  

export default useChatStore;

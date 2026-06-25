import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
// import authStore from "./userAuth.store.js";
import { devtools } from "zustand/middleware";
import socket from "../socket/socket.js";
import authStore from "./userAuth.store.js";


const initialState={
  chatPartners: [],
  tempMsgStore: [],
  contacts: [],
  selectedTab:null,
  // localStorage.getItem("selectedTab") || "Chats",
  selectedUser: null,
  messages: [],
  isUsersLoading: false,
  isMessageLoading: false,
  isSoundOn: localStorage.getItem("isSoundOn") === "true",
  isImageUploading: false
}
const useChatStore = create((set, get) => ({
  // chatPartners: [],
  // tempMsgStore: [],
  // contacts: [],
  // selectedTab:"", 
  // // localStorage.getItem("selectedTab") || "Chats",
  // selectedUser: null,
  // messages: [],
  // isUsersLoading: false,
  // isMessageLoading: false,
  // isSoundOn: localStorage.getItem("isSoundOn") === "true",
  // isImageUploading: false,
  ...initialState,

  toggleSound: () => {
    const nextSoundState = !get().isSoundOn;
    localStorage.setItem("isSoundOn", String(nextSoundState));
    set({ isSoundOn: nextSoundState });
  },

  setSelectedTab: (tab) => {
    
    set({ selectedTab: tab });
    localStorage.setItem("selectedTab", String(tab));
  },

  getchatPartners: async () => {
    const { chatPartners } = get();
    // if (chatPartners && chatPartners.length > 0) return chatPartners;

    set({ isUsersLoading: true });
    try {
      const resp = await axiosInstance.get("/message/chats");
            console.log("data in getchatPartners is ", resp.data);
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

    // if (contacts && contacts.length > 0) return contacts;

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
    try {
      console.log("In getMessages ")
      const res = await axiosInstance.get(`/message/${id}`);
      console.log(res)
      set({ messages: res.data.data });
      console.log("messages are ",res.data.data)
    } catch (error) {
      toast.error(error.response?.data?.error);
    } finally {
      set({ isMessageLoading: false });
    }
  },

  setSelectedUser: (user) => {
    console.log(user)
    set({ selectedUser: user });

  },

  sendMessage: async ({messageText,url}) => {
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
      console.log("message in send message ",messageText,url)
      const { contacts, selectedUser, chatPartners } = get();
      const resp = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        { text: messageText, image: url },
      );

      // const newContacts = contacts.filter(
      //   (user) => user._id !== selectedUser._id,
      // );
      // const newchatPartners = contacts.filter(
      //   (user) => user._id === selectedUser._id,
      // );

      // if (newchatPartners.length > 0) {
      //   set({
      //     contacts: newContacts,
      //     chatPartners: chatPartners.concat(newchatPartners),
      //   });
      // }
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
    if (!selectedUser) return;

    // const socket = authStore.getState().socket;
    // const {messages}=get()
    socket.on("newMessage", (msg) => {

      const authUser=authStore.getState().user;
      const selectedUser=get().selectedUser;


      // console.log("in subscribe message authuser",authUser)
      if(!selectedUser) return;

      const incomming=msg.senderId===selectedUser._id && msg.receiverId === authUser._id;
      const outgoing=msg.receiverId ===selectedUser._id && msg.senderId ===authUser._id;
      

      if (!incomming && !outgoing) return;

      set({ messages: [...get().messages, msg] });

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

import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
import authStore from "./userAuth.store.js";
const useChatStore = create((set, get) => ({
  chatPartners: [],
  tempMsgStore: [],
  contacts: [],
  selectedTab: localStorage.getItem("selectedTab") || "Chats",
  selectedUser: null,
  messages: [
    // --- Day 1: May 30 (Initial UI Review) ---
    {
      _id: "6658a123e4b0c12345678901",
      senderId: 1,
      recieverId: 2,
      text: "Hey! Did you get a chance to look at the new UI design?",
      image:
        "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop", // Portrait UI Concept
      createdAt: "2026-05-30T10:14:00.000Z",
      updatedAt: "2026-05-30T10:14:00.000Z",
    },
    {
      _id: "6658a156e4b0c12345678902",
      senderId: 2,
      recieverId: 1,
      text: "Yeah, I just opened it up. The pink accents look really clean!",
      image:
        "https://images.unsplash.com/photo-1614036417651-ebe5e12851df?q=80&w=500&h=500&auto=format&fit=crop", // Square Pink Abstract
      createdAt: "2026-05-30T10:15:30.000Z",
      updatedAt: "2026-05-30T10:15:30.000Z",
    },
    {
      _id: "6658a189e4b0c12345678903",
      senderId: 2,
      recieverId: 1,
      text: "Check out this screenshot of how the layout looks on my screen.",
      image:
        "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1200&h=600&auto=format&fit=crop", // Wide Landscape Desktop
      createdAt: "2026-05-30T10:16:00.000Z",
      updatedAt: "2026-05-30T10:16:00.000Z",
    },
    {
      _id: "6658a1bce4b0c12345678904",
      senderId: 1,
      recieverId: 2,
      text: "Oh wow, that looks perfect. The alignment is spot on now.",
      image:
        "https://images.unsplash.com/photo-1551288049-bbbda546697c?q=80&w=600&h=800&auto=format&fit=crop", // Vertical Data Viz
      createdAt: "2026-05-30T10:17:15.000Z",
      updatedAt: "2026-05-30T10:17:15.000Z",
    },
    {
      _id: "6658a1efe4b0c12345678905",
      senderId: 2,
      recieverId: 1,
      text: "Awesome! Let's lock this in and review it with the developers tomorrow.",
      image:
        "https://images.unsplash.com/photo-1522071823991-b9671f9d7f1f?q=80&w=1000&h=400&auto=format&fit=crop", // Narrow Banner
      createdAt: "2026-05-30T10:25:00.000Z",
      updatedAt: "2026-05-30T10:25:00.000Z",
    },

    // --- Day 2: May 31 (Developer Feedback) ---
    {
      _id: "6658a222e4b0c12345678906",
      senderId: 1,
      recieverId: 2,
      text: "Hey, dev team said the layout is feasible, but they want an asset export for the icons.",
      image:
        "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&h=800&auto=format&fit=crop", // Square Icon Mesh
      createdAt: "2026-05-31T14:30:00.000Z",
      updatedAt: "2026-05-31T14:30:00.000Z",
    },
    {
      _id: "6658a255e4b0c12345678907",
      senderId: 2,
      recieverId: 1,
      text: "No problem. Just uploaded the entire icon pack folder to the shared drive.",
      image:
        "https://images.unsplash.com/photo-1544391682-17ef3692d184?q=80&w=1200&h=500&auto=format&fit=crop", // Files/Folder Abstract
      createdAt: "2026-05-31T14:45:12.000Z",
      updatedAt: "2026-05-31T14:45:12.000Z",
    },
    {
      _id: "6658a288e4b0c12345678908",
      senderId: 1,
      recieverId: 2,
      text: "Got it, downloading them now. Thanks for the quick turnaround!",
      image:
        "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?q=80&w=400&h=400&auto=format&fit=crop", // Small Square Success
      createdAt: "2026-05-31T15:02:40.000Z",
      updatedAt: "2026-05-31T15:02:40.000Z",
    },

    // --- Day 3: June 01 (Staging Environment Launch) ---
    {
      _id: "6658a2bbe4b0c12345678909",
      senderId: 2,
      recieverId: 1,
      text: "The staging link is live! Check out the interactive prototype with the real backend.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&h=600&auto=format&fit=crop", // Tech Dashboard
      createdAt: "2026-06-01T09:00:00.000Z",
      updatedAt: "2026-06-01T09:00:00.000Z",
    },
    {
      _id: "6658a2eee4b0c12345678910",
      senderId: 1,
      recieverId: 2,
      text: "Holy cow, the transitions feel incredibly smooth. Great work team!",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&h=1200&auto=format&fit=crop", // Vertical Motion Concept
      createdAt: "2026-06-01T09:12:18.000Z",
      updatedAt: "2026-06-01T09:12:18.000Z",
    },

    // --- Day 4: June 02 (Bug Hunting & Assets) ---
    {
      _id: "6658a31fe4b0c12345678911",
      senderId: 1,
      recieverId: 2,
      text: "Wait, found a tiny bug on mobile. The hero section image is stretching awkwardly.",
      image:
        "https://images.unsplash.com/photo-1525733225354-91fc498a9643?q=80&w=500&h=1000&auto=format&fit=crop", // Long Mobile Screen Bug
      createdAt: "2026-06-02T11:05:00.000Z",
      updatedAt: "2026-06-02T11:05:00.000Z",
    },
    {
      _id: "6658a352e4b0c12345678912",
      senderId: 2,
      recieverId: 1,
      text: "Ah, they forgot to add object-cover to that image tag. I will ping them to fix it.",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=900&h=450&auto=format&fit=crop", // Code Snippet View
      createdAt: "2026-06-02T11:18:45.000Z",
      updatedAt: "2026-06-02T11:18:45.000Z",
    },
    {
      _id: "6658a385e4b0c12345678913",
      senderId: 2,
      recieverId: 1,
      text: "By the way, did we finalize the default placeholder avatar for empty user profiles?",
      image:
        "https://images.unsplash.com/photo-1531771686035-25f2750e5c83?q=80&w=600&h=600&auto=format&fit=crop", // Square Avatar Placeholder
      createdAt: "2026-06-02T16:40:00.000Z",
      updatedAt: "2026-06-02T16:40:00.000Z",
    },
    {
      _id: "6658a3b8e4b0c12345678914",
      senderId: 1,
      recieverId: 2,
      text: "Yes, we chose this minimalist geometric pattern vector. Check it out.",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&h=1000&auto=format&fit=crop", // Vertical Abstract Pattern
      createdAt: "2026-06-02T16:55:22.000Z",
      updatedAt: "2026-06-02T16:55:22.000Z",
    },

    // --- Day 5: June 03 (Content & Marketing Prep) ---
    {
      _id: "6658a3ebe4b0c12345678915",
      senderId: 2,
      recieverId: 1,
      text: "Perfect, that asset looks very clean. Let's use it.",
      image:
        "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&h=400&auto=format&fit=crop", // Wide Hero Crop
      createdAt: "2026-06-03T10:00:00.000Z",
      updatedAt: "2026-06-03T10:00:00.000Z",
    },
    {
      _id: "6658a41ee4b0c12345678916",
      senderId: 1,
      recieverId: 2,
      text: "Marketing wants a high-res cover banner for the launch blog post. Any ideas?",
      image:
        "https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=700&h=900&auto=format&fit=crop", // High-Res Abstract Portrait
      createdAt: "2026-06-03T13:12:00.000Z",
      updatedAt: "2026-06-03T13:12:00.000Z",
    },
    {
      _id: "6658a451e4b0c12345678917",
      senderId: 2,
      recieverId: 1,
      text: "What about something abstract that highlights our new workspace setup vibes?",
      image:
        "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=1200&h=800&auto=format&fit=crop", // Standard 3:2 Workspace
      createdAt: "2026-06-03T13:45:10.000Z",
      updatedAt: "2026-06-03T13:45:10.000Z",
    },

    // --- Day 6: June 04 (Final Launch Day Approvals) ---
    {
      _id: "6658a484e4b0c12345678918",
      senderId: 1,
      recieverId: 2,
      text: "That option looks stunning. Sending it straight to marketing now.",
      image:
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1000&h=500&auto=format&fit=crop", // Marketing Banner
      createdAt: "2026-06-04T08:50:00.000Z",
      updatedAt: "2026-06-04T08:50:00.000Z",
    },
    {
      _id: "6658a4b7e4b0c12345678919",
      senderId: 2,
      recieverId: 1,
      text: "Awesome. Mobile stretching layout bug is also deployed and completely fixed.",
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&h=400&auto=format&fit=crop", // Code Success Banner
      createdAt: "2026-06-04T09:15:00.000Z",
      updatedAt: "2026-06-04T09:15:00.000Z",
    },
    {
      _id: "6658a4eae4b0c12345678920",
      senderId: 1,
      recieverId: 2,
      text: "Incredible work! We are fully green-lit for production. Let's merge it! 🚀",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&h=800&auto=format&fit=crop", // Celebration Square
      createdAt: "2026-06-04T09:30:15.000Z",
      updatedAt: "2026-06-04T09:30:15.000Z",
    },
  ],
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
    localStorage.setItem("selectedTab", String(tab));
  },

  getchatPartners: async () => {
    const { chatPartners } = get();
    if (chatPartners && chatPartners.length > 0) return chatPartners;

    set({ isUsersLoading: true });
    try {
      const resp = await axiosInstance.get("/message/chats");
            console.log("data in getchatPartners is ", resp.data.data);
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

    if (contacts && contacts.length > 0) return contacts;

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
      const { contacts, selectedUser, chatPartners } = get();
      const resp = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        { text: message, image: image },
      );

      const newContacts = contacts.filter(
        (user) => user._id !== selectedUser._id,
      );
      const newchatPartners = contacts.filter(
        (user) => user._id === selectedUser._id,
      );

      if (newchatPartners.length > 0) {
        set({
          contacts: newContacts,
          chatPartners: chatPartners.concat(newchatPartners),
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
    const { selectedUser, isSoundOn } = get();
    if (!selectedUser) return;

    const socket = authStore.getState().socket;
    // const {messages}=get()
    socket.on("newMessage", (msg) => {
      const isMessageFromSelectedUser =
        msg.senderId === selectedUser._id ||
        msg.recieverId === selectedUser._id;

      if (!isMessageFromSelectedUser) return;

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
    const socket = authStore.getState().socket;
    socket.off("newMessage");
  },
}));

export default useChatStore;

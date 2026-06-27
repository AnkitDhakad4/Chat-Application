import axios from "axios";
import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import socket from "../socket/socket";
import authStore from "./userAuth.store.js";
const initialState = {
  selectedGroup: null,
  allGroups: [],
  oneGroupIscreated: false,
  isGroupsLoading: true,
  isGroupMessageLoading: false,
  groupsMessages: {},
  socketIsConnected: false,
  notificationCount:{},
};
const groupStore = create((set, get) => ({
  ...initialState,

  setSelectedGroup: (grp) => {
    // console.log(grp,"is selected")
    set({ selectedGroup: grp });
  },

  sendMessageInGroup: async ({ text, groupId, image }) => {

    // const user=authStore.getState().user

    // const tempMsg = {
    //   senderId: {
    //     _id: user._id,
    //     name: user.name,
    //     profilePic: user.profilePic,
    //   },
    //   text: text,
    //   image: image,
    //   groupId: groupId,
    //   _id: Date.now(),
    //   createdAt: Date.now(),
    //   updatedAt: Date.now(),
    //   __v: 0,
    // };

    try {
      const resp = await axiosInstance.post("/group/sendMessage", {
        text,
        groupId,
        image,
        senderSocketId: socket?.id,
      });
      const newMessage = resp.data.data;
      const currentMessages = get().groupsMessages[groupId] || [];
      
      // if (!get().socketIsConnected) {
        set({
          groupsMessages: {
            ...get().groupsMessages,
            [groupId]: [...currentMessages, newMessage],
          },
        });
      // }
    } catch (error) {
      console.log(error?.response?.data || error.message);
    }
  },

  getGroupMessages: async (id) => {
    try {
      console.log("in getGroupMessages id is   ", id);
      const resp = await axiosInstance.post("/group/getAllMessages", {
        groupId: id,
      });
      const newMessages = resp.data.data;

      console.log("in getGroupMessages", newMessages);
      set({
        groupsMessages: {
          ...get().groupsMessages,
          [id]: newMessages,
        },
      });
      // toast.success(resp.data.message);
    } catch (error) {
      console.log(error.response.data);
    }
  },

  createGroup: async (body) => {
    try {
      console.log(body)
      const resp = await axiosInstance.post("/group/createGroup", body);
      toast.success(resp.data.message);
      // set({ oneGroupIscreated: true });
    } catch (error) {
      console.log(error)
      console.log(error?.data?.message);
    }
  },

  setoneGroupIscreated: (arg) => {
    set({ oneGroupIscreated: arg });
  },

  addMembersInGroup: async (members, groupId) => {
    try {
      const resp = await axiosInstance.post("/group/addMembers", {
        members,
        groupId,
      });
      toast.success(resp.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error?.data?.message);
    }
  },

  removeMembersFromGroup: async (members, groupId) => {
    try {
      const resp = await axiosInstance.post("/group/removeMembers", {
        membersToKick: members,
        groupId,
      });
      toast.success(
        "Member is removed successfully it will render after relogin",
      );
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error?.data?.message);
    }
  },
  getAllGroups: async () => {
    try {
      set({ isGroupsLoading: true });
      const resp = await axiosInstance.post("/group/allGroups");
      // console.log(resp.data.data);
      set({ allGroups: resp.data.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  subscribeForGroupMessage: () => {
    set({ socketIsConnected: true });
    if (!socket) return;
    socket.on("newGroupMessage", (newmsg) => {
      console.log("socket se aa gya hai ", newmsg);
      const currentmsgs = get().groupsMessages[newmsg.groupId] || [];
      set({
        groupsMessages: {
          ...get().groupsMessages,
          [newmsg.groupId]: [...currentmsgs, newmsg],
        },
      });
    });
  },

  unsubscribeForGroupMessage: () => {
    if (!socket) return;
    set({ socketIsConnected: true });
    socket.off("newGroupMessage");
  },

  reset: () => {
    // console.log("Reseting the groupStore")
    set({ ...initialState });
  },
}));

export default groupStore;

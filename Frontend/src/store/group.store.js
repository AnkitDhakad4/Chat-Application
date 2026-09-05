import axios from "axios";
import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import socket from "../socket/socket";
import authStore from "./userAuth.store.js";
import {triggerGroupNotification} from '../utils/notification.util.jsx'
const initialState = {
  selectedGroup: null,
  allGroups: [],
  oneGroupIscreated: false,
  isGroupsLoading: true,
  isGroupMessageLoading: false,
  groupsMessages: {},
  socketIsConnected: false,
  notificationCount:{},
  isUpdatingGroup:false,
  notificationsToGroups:new Set()
};
const groupStore = create((set, get) => ({
  ...initialState,

  setSelectedGroup: (grp) => {
    // console.log(grp,"is selected")
    const currentNotifications=get().notificationsToGroups
    if(currentNotifications && currentNotifications?.has(grp?._id))
    {
      currentNotifications.delete(grp._id)
    }
    set({ selectedGroup: grp ,notificationsToGroups:currentNotifications});
  },

  sendMessageInGroup: async ({ text, groupId, image }) => {

    const {user}=authStore.getState()
    const {groupsMessages}=get()
    const newInstanceOfGroupMessages={...groupsMessages}
    const tempId=`temp-${Date.now()}`
    const tempMsg = {
      senderId: {
        _id: user._id,
        name: user.name,
        profilePic: user.profilePic,
      },
      text: text,
      image: image,
      groupId: groupId,
      _id: tempId,
      createdAt: new Date().toISOString(),
       isSending:true
    };

    const currentMessages=get().groupsMessages[groupId] ||[]
    set({groupsMessages:{...groupsMessages,[groupId]:[...currentMessages,tempMsg]}})
    try {
      const resp = await axiosInstance.post("/group/sendMessage", {
        text,
        groupId,
        image,
        senderSocketId: socket?.id,
      });
      const newMessage = resp.data.data;
      
      // if (!get().socketIsConnected) {
        set((state)=>{
          // const freshGroupMessages = state.groupsMessages[groupId] || [];
          return {
          groupsMessages: {
            ...state.groupsMessages,
            [groupId]: [...currentMessages,newMessage]
          },
        }
        });
      // }
    } catch (error) {
      set({groupsMessages:newInstanceOfGroupMessages})
      console.log(error?.response?.data || error.message);
    }
  },

  getGroupMessages: async (id) => {
    try {
      
      const resp = await axiosInstance.post("/group/getAllMessages", {
        groupId: id,
      });
      const newMessages = resp.data.data;
      
     if(get().selectedGroup._id !== newMessages.groupId)
     {
      set({
        groupsMessages: {
          ...get().groupsMessages,
          [id]: newMessages,
        },
      });
     }
     
      toast.success(resp.data.message);
    } catch (error) {
      console.log(error.response.data);
    }
  },

  createGroup: async (body) => {
    try {
      
      const resp = await axiosInstance.post("/group/createGroup", body);
      toast.success(resp.data.message);
      // set({ oneGroupIscreated: true });
    } catch (error) {
      console.log(error)
      console.log(error?.data?.message);
    }
  },

 updateGroup: async (data, grpId) => {
  try {
    set({isUpdatingGroup:true})
   
    const resp = await axiosInstance.post(`/group/updateGroupDetails/${grpId}`, data);
    const updatedGroup = resp?.data?.data;

    if (!updatedGroup) return;

    
    const newGroupData = get().allGroups.map((grp) => 
      grp._id === grpId ? updatedGroup : grp
    );

    
    set({ 
      selectedGroup: updatedGroup,
      allGroups: newGroupData 
    });
    toast.success("Group is updated successfully")
  } catch (error) {
    toast.error("error while updating in the group")
    console.log(error);
  } finally
  {
    set({isUpdatingGroup:false})
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
      const {selectedGroup,allGroups}=get()
      const resp = await axiosInstance.post("/group/removeMembers", {
        membersToKick: members,
        groupId,
      });

      if(!resp)
      {
        toast.error("error while removing the members")
      }
      toast.success(
        "Member is removed successfully it will render after relogin",
      );

      // const newMembers=selectedGroup.members.map((mem)=>(!members.includes(mem._id)))
      const newAllGroup=allGroups.map((grp)=>(grp._id === resp.data?.data?._id ? resp?.data?.data : grp))
     
      set({selectedGroup:resp.data.data,allGroups:[...newAllGroup]})

    } catch (error) {
      console.log(error)
      // toast.error(error.response?.data?.message);
     
    }
  },
  
  getAllGroups: async () => {
    try {
      set({ isGroupsLoading: true });
      const resp = await axiosInstance.post("/group/allGroups");
    
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
  
    
    socket.on("newGroupMessage", (newmsg,data) => {
      // console.log("Data in the groupMessage ",data)
      const currentmsgs = get().groupsMessages[newmsg.groupId] || [];
      set({
        groupsMessages: {
          ...get().groupsMessages,
          [newmsg.groupId]: [...currentmsgs, newmsg],
        },
      });
      // console.log(data)
      // console.log(get().selectedGroup)
      
      if(!get().selectedGroup ||  get().selectedGroup._id !== data._id)
       {
        const currentState=get().notificationsToGroups
            set({notificationsToGroups:new Set([...currentState,data._id])})
        
          triggerGroupNotification(data.groupName,newmsg.senderId.name,newmsg.text,data.groupIcon)
      }
    });
  },

  unsubscribeForGroupMessage: () => {
    if (!socket) return;
    set({ socketIsConnected: true });
    socket.off("newGroupMessage");
  },

  reset: () => {
    
    set({ ...initialState });
  },
}));

export default groupStore;

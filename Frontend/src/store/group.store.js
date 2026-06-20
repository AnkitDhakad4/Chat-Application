import axios from "axios";
import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const initialState={
     selectedGroup:null,
     allGroups:[],
     oneGroupIscreated:false,
    isGroupsLoading:true,
    isGroupMessageLoading:false,
    groupsMessages: {},
}
const groupStore=create((set,get)=>({
    ...initialState,
    
    setSelectedGroup:(grp)=>{
        // console.log(grp,"is selected")
        set({selectedGroup:grp})
    },

    sendMessageInGroup:async({text,groupId,image})=>{
        try {

            const resp=await axiosInstance.post('/group/sendMessage',{text,groupId,image})
            const newMessage=resp.data.data
            const currentMessages=get().groupsMessages[groupId] ||[];
            
            console.log("resp after currentMessages ",currentMessages)
            set({
                groupsMessages:{
                    ...get().groupsMessages,
                    [groupId]:[...currentMessages,newMessage]
                }
            })
            console.log("Message it been seted")
           
        } catch (error) {
            console.log(error?.response?.data || error.message)
        }
    },

    getGroupMessages:async(id)=>{
        try {
            console.log("in getGroupMessages id is   ",id)
            const resp=await axiosInstance.post('/group/getAllMessages',{groupId:id})
            const newMessages=resp.data.data

            console.log("in getGroupMessages",newMessages)
            set({groupsMessages:{
                ...get().groupsMessages,
                [id]:newMessages
            }})
            toast.success(resp.data.message)
        } catch (error) {
            console.log(error.response.data)
        }
    },

    createGroup:async (name,description)=>{
        try {
            const resp=await axiosInstance.post('/group/createGroup',{name,description})
            toast.success(resp.data.message)
            set({oneGroupIscreated:true})
        } catch (error) {
            console.log(error?.data?.message)
        }
    },

    setoneGroupIscreated:()=>{
        set({oneGroupIscreated:true})
    },

    addMembersInGroup:async (members,groupId)=>{
        try {
            const resp=await axiosInstance.post('/group/addMembers',{members,groupId})
            toast.success(resp.data.message)
        } catch (error) {
            toast.error(error.response?.data?.message);
            console.log(error?.data?.message)
        }
    },

    removeMembersFromGroup:async (members,groupId)=>{
        try {
            const resp=await axiosInstance.post('/group/removeMembers',{membersToKick:members,groupId})
            toast.success("Member is removed successfully it will render after relogin")
        } catch (error) {
            toast.error(error.response?.data?.message);
            console.log(error?.data?.message)
        }
    },
    getAllGroups:async ()=>{
        try {
            set({isGroupsLoading:true})
            const resp=await axiosInstance.post('/group/allGroups')
            console.log(resp.data.data)
            set({allGroups:resp.data.data});
        } catch (error) {
            console.log(error)
        }finally{
            set({isGroupsLoading:false})
        }
    },
     reset:()=>{
        // console.log("Reseting the groupStore")
    set({...initialState})
  }
}))

export default groupStore
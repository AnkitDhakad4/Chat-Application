import axios from "axios";
import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const initialState={
     selectedGroup:null,
     allGroups:[],
     oneGroupIscreated:false,
    isGroupsLoading:true
}
const groupStore=create((set,get)=>({
    ...initialState,
    
    setSelectedGroup:(grp)=>{
        // console.log(grp,"is selected")
        set({selectedGroup:grp})
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
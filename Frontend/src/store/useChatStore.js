import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
const useChatStore= create((set,get)=>({

    chatParteners:[],
    contacts:[],
    selectedTab:"chats",
    selectedUser:null,
    messages:[],
    isUsersLoading:false,
    isMessageLoading:false,
    isSoundOn:JSON.parse(localStorage.getItem('isSoundOn'))===true,


    toggleSound:()=>{
        localStorage.setItem('isSoundOn',!get().isSoundOn)
        set({isSoundOn:!get().isSoundOn})
    },

    setSelectedTab:(tab)=>{
        set({selectedTab:tab})
    },

    getChatParteners:async()=>{
        const {chatParteners}=get() 
        if (chatParteners && chatParteners.length > 0) return
        
        set({isUsersLoading:true})
        try {
            const resp=await axiosInstance.get('/message/chats')
            set({chatParteners:resp.data.data})
        } catch (error) {
            toast.error(error.response?.data?.message)
        }finally
        {
           set({isUsersLoading:false}) 
        }
    },

    getContacts:async()=>{
        const {contacts}=get()
        
        if(contacts && contacts.length > 0) return;

        set({isUsersLoading:true})
        try {
            const res=await axiosInstance.get('/message/contacts')
            set({contacts:res.data.data})
        } catch (error) {
            toast.error(error.response?.data?.message)            
        } finally{
            set({isUsersLoading:false})
        }
    },

    getMessages:async(id)=>{
        set({isMessageLoading:true})
        try
        {
            const res=await axiosInstance.get(`/message/${id}`)
            set({messages:res.data})
        }catch{
            toast.error(res.response?.data?.error)
        }finally{
            set({isMessageLoading:false})
        }
    },

    setSelectedUser:(user)=>{
        console.log(user)
        set({selectedUser:user})
    }






}))

export default useChatStore
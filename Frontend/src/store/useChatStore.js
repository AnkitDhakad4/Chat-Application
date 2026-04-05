import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
import axios from "axios";
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
            set({messages:res.data.data})
        }catch{
            toast.error(res.response?.data?.error)
        }finally{
            set({isMessageLoading:false})
        }
    },

    setSelectedUser:(user)=>{
        // console.log(user)     
        set({selectedUser:user})
    },

    sendMessage:async(image,message)=>{
        console.log("In send message of store")
        try {
            const resp=await axiosInstance.post(`/message/send/${get().selectedUser._id}`,{text:message,image:image})
            console.log(resp.data)
            set({messages:[...get().messages,resp.data.message]})
        } catch (error) {
            console.log(error)
            // toast.error(error.response?.data?.error)
        }
    },


    getTokenForUpload:async()=>{
        try {
            const resp=await axiosInstance.get('/message/uploadToken')
            // console.log("resp from getTokenForUpload", resp);
            return {timestamp:resp.data.data.timestamp,signature:resp.data.data.signature,apiKey:resp.data.data.apiKey}
    } catch (error) {
        console.error(error)
    }
    },
  uploadOnCloudinary:async(formData)=>{
    try {
        const resp=await fetch(`https://api.cloudinary.com/v1_1/ankitdhakad/image/upload`,{
            method:'POST',
            body:formData
        })
        const data=await resp.json()
        console.log("resp from uploadoncloudinary", data);
        return data;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }

}






}))

export default useChatStore
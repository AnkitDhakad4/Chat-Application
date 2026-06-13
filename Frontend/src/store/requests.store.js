import { create } from "zustand";
import  axiosInstance from "../lib/axios.js";


// it return all these states(variables) and actions(methods)
const requestStore =create((set,get)=>({
    selectedNoticeTab:"Group",
    messageRequests:[],
    groupInvitations:[],
    rejectedMessageRequests:[],
    rejectedGroupInvitations:[],


    setSelectedNoticeTab:(noticeTab)=>{
        set({selectedNoticeTab:noticeTab})
    },

    getMessageRequests:async ()=>{
        try {
            const resp=await axiosInstance.post('/message/getAllRequests')
           
            console.log(resp.data)
            set({messageRequests:resp.data.data})
        } catch (error) {
            console.log(error)
        }

    },
    getGroupRequests:async ()=>{
        try {
            const resp=await axiosInstance.get('/users/groupInvitations')
            console.log(resp.data)
            set({groupInvitations:resp.data.data})
        } catch (error) {
            console.log(error)
        }

    }
}))

export default requestStore;

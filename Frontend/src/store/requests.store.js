import { create } from "zustand";
import  axiosInstance from "../lib/axios.js";

const initialState={
    selectedNoticeTab:"",
    messageRequests:[],
    groupInvitations:[],
    rejectedMessageRequests:[],
    rejectedGroupInvitations:[],
    sentRequests:[],
    infoAbout:null
}
// it return all these states(variables) and actions(methods)
const requestStore =create((set,get)=>({
    // selectedNoticeTab:"",
    // messageRequests:[],
    // groupInvitations:[],
    // rejectedMessageRequests:[],
    // rejectedGroupInvitations:[],
    // infoAbout:null,
    ...initialState,


    sentMessageRequest:async(userId)=>{
        try {
            console.log(userId)
            const request=await axiosInstance.get(`/message/messageRequest/${userId}`)
            console.log(request.data)
        } catch (error) {
            console.log(error)
        }
    },
    setInfoAbout:(usrOrGrp)=>{
        set({infoAbout:usrOrGrp})
        console.log(usrOrGrp)

    },
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
           
            set({groupInvitations:resp.data.data})
           
        } catch (error) {
            console.log(error)
        }

    },
    rejectedMessageRequest:async ()=>{
        try {
            const resp=await axiosInstance.post('/message/rejectMessageRequest')
            console.log(resp.data.data)
            set({rejectedMessageRequests:resp.data.data})
        } catch (error) {
            console.error(error)
        }
    },
    rejectedInvitations:async ()=>{
        try {
            const resp=await axiosInstance.post('/users/rejectedInvitations')
            console.log(resp.data.data)
            set({rejectedGroupInvitations:resp.data.data})
        } catch (error) {
            console.error(error)
        }
    },


    getSentRequests:async()=>{
        try{
            const reqs=await axiosInstance.get('/message/getSentRequests')
            console.log("sented requests are ",reqs.data.data)
            set({sentRequests:reqs.data.data})
        }catch(error)
        {
            console.log(error)
        }
    },

    acceptInvitation:async ()=>{

    },

    rejectInvitation:async()=>{

    },

    acceptMessageReqeust:async(req)=>{
        console.log("In acceptMessageReqeust")
    },

    rejectMessageReqeust:async(req)=>{
        console.log("In rejectMessageReqeust")


    },
     reset:()=>{
        // console.log("Reseting the requestStore")
    set({...initialState})
  }
}))

export default requestStore;

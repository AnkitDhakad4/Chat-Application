import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

const initialState = {
  selectedNoticeTab: "",
  messageRequests: [],
  groupInvitations: [],
  rejectedMessageRequests: [],
  rejectedGroupInvitations: [],
  // sentRequests:new Set(),
  infoAbout: null,
};
// it return all these states(variables) and actions(methods)
const requestStore = create((set, get) => ({
  // selectedNoticeTab:"",
  // messageRequests:[],
  // groupInvitations:[],
  // rejectedMessageRequests:[],
  // rejectedGroupInvitations:[],
  // infoAbout:null,
  ...initialState,

  sentMessageRequest: async (userId) => {
    try {
      // console.log(userId);
      const request = await axiosInstance.get(
        `/message/messageRequest/${userId}`,
      );
      set({sentRequests:new Set(get().sentRequests).add(userId)})
    } catch (error) {
      console.log(error);
    }
  },
  setInfoAbout: (usrOrGrp) => {
    set({ infoAbout: usrOrGrp });
    // console.log(usrOrGrp)
  },
  setSelectedNoticeTab: (noticeTab) => {
    set({ selectedNoticeTab: noticeTab });
  },

  getMessageRequests: async () => {
    try {
      const resp = await axiosInstance.post("/message/getAllRequests");

     
      set({ messageRequests: resp.data.data });
    } catch (error) {
      console.log(error);
    }
  },
  getGroupRequests: async () => {
    try {
      const resp = await axiosInstance.get("/users/groupInvitations");

      set({ groupInvitations: resp.data.data });
    } catch (error) {
      console.log(error);
    }
  },
  rejectedMessageRequest: async () => {
    try {
      const resp = await axiosInstance.post("/message/rejectMessageRequest");
      
      set({ rejectedMessageRequests: resp.data.data });
    } catch (error) {
      console.error(error);
    }
  },
  rejectedInvitations: async () => {
    try {
      const resp = await axiosInstance.post("/users/rejectedInvitations");
      // console.log(resp.data.data);
      set({ rejectedGroupInvitations: resp.data.data });
    } catch (error) {
      console.error(error);
    }
  },

  getSentRequests: async () => {
    try {
      const reqs = await axiosInstance.get("/message/getSentRequests");
      
      const data=reqs.data.data.map((rq)=>rq.receiverId)
      
      set({ sentRequests: new Set(data) });
    } catch (error) {
      console.log(error);
    }
  },

  acceptInvitation: async (grpId,invtId) => {
    try {
      const resp = await axiosInstance.post(`/group/acceptInvitation`, {
        groupId: grpId,
      });

       const { groupInvitations } = get();
      if (!resp) {
        console.log("there is some error");
        return;
      }
      
      const updatedGroupInvitations = groupInvitations.filter(
        (invt) => (invt._id !== invtId)
      );
        
      set({ groupInvitations: [...updatedGroupInvitations] });
      toast.success("Invitation is accepted");
      
    } catch (error) {
      console.log(error);
    }
  },

  rejectInvitation: async (grpId,invtId) => {
    try {
        const resp = await axiosInstance.post(`/group/rejectInvitation`, {
            groupId: grpId,
        });
        //  console.log(resp.data.message)
        if (!resp) {
            // console.log("there is some error");
            return;
        }
        
        const { groupInvitations } = get();
      const updatedGroupInvitations = groupInvitations.filter(
        (invt) => (invt._id !== invtId)
      );
      set({ groupInvitations: [...updatedGroupInvitations] });
      toast.success("Invitation is rejected");
    } catch (error) {
      console.log(error);
    }
  },

  acceptMessageReqeust: async (reqId) => {
    try {
      
      const resp = await axiosInstance.post(`/message/acceptMessageRequest`, {
        requestId: reqId,
      });
     
      const { messageRequests } = get();
      const updatedMessageRequests = messageRequests.filter(
        (invt) => (invt._id !== reqId)
      );
    
      set({ messageRequests: [...updatedMessageRequests] });
      toast.success("Request is accepted");
    } catch (error) {
      console.log(error);
    }
  },

  rejectMessageReqeust: async (reqId) => {
    try {
      const resp = await axiosInstance.post(`/message/rejectMessageRequest`, {
        requestId: reqId,
      });
      const { messageRequests } = get();
      const updatedMessageRequests = messageRequests.filter(
        (invt) => (invt._id !== reqId)
      );
      set({ messageRequests: [...updatedMessageRequests] });
      
      toast.success("Request is rejected");
    } catch (error) {
      console.log(error);
    }
  },
  reset: () => {
    // console.log("Reseting the requestStore")
    set({ ...initialState });
  },
}));

export default requestStore;

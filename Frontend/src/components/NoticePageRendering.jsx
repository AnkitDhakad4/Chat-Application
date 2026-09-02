import React, { useState } from "react";
import useChatStore from "../store/useChatStore.js";
import authStore from "../store/userAuth.store.js";
import {
  Search,
  Bell,
  BellOff,
  LoaderCircle,
  VolumeOff,
  Volume2,
  VolumeX,
  Check,
  CircleX,
} from "lucide-react";
import ProfileHeader from "./profileHeader.jsx";
import { useEffect } from "react";
import toast from "react-hot-toast";
import requestStore from "../store/requests.store.js";
import groupStore from "../store/group.store.js";
import GroupProfileView from "./GroupProfileView.jsx";

function MessageRequest({ rqs }) {
  console.log(rqs);
  const { acceptMessageReqeust, rejectMessageReqeust } = requestStore();

  const accepted = async (id) => {
    console.log("In accepted");
    await acceptMessageReqeust(id);
  };

  const rejected = async (id) => {
    console.log("In rejected");
    await rejectMessageReqeust(id);
  };
  return (
    <div className=" h-1/10 flex my-1  rung p-0.5 items-center justify-evenly ">
      <img className=" object-cover size-11" src={rqs.senderId.profilePic || '/avatar.png'} />
      <div className="flex flex-col w-65/100 ">
        <p className="text-lg font-liberation text-[#18181B]">
          {rqs.senderId.name}
        </p>
        <p className="truncate max-w-full text-xs font-extralight text-[#71717A] font-inter">
          {rqs.senderId.about}
        </p>
      </div>
      <div className="flex flex-col gap-1 pt-1 ">
        <button
          onClick={()=>{accepted(rqs._id)}}
          className="bg-[#166534] hover:bg-[#15803d] text-white font-medium text-xs px-2 py-0.5  rounded-xl cursor-pointer transition-all duration-200 flex items-center"
        >
          Accept
        </button>

        <button
          onClick={()=>{rejected(rqs._id)}}
          className="bg-[#5b0e0e] hover:bg-[#991b1b] text-neutral-300 hover:text-white font-medium text-xs px-2 py-0.5 rounded-xl cursor-pointer transition-all duration-200 flex items-center"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

function GroupInvitation({invt}) {
  const { acceptMessageReqeust, rejectMessageReqeust } = requestStore();
const {acceptInvitation,rejectInvitation}=requestStore()

  const accepted = async (id,invtId) => {
    
    await acceptInvitation(id,invtId);
  };

  const rejected = async (id,invtId) => {
    
    await rejectInvitation(id,invtId);
  };
  return (
    <div className=" h-1/10 flex p-0.5 items-center justify-evenly ">
      <img className=" object-cover size-11" src={invt.groupId.groupIcon} alt="icon" />
      <div className="flex flex-col w-65/100 ">
        <p className="text-lg font-liberation text-[#18181B]">{invt.groupId.groupName}</p>
        <p className="truncate max-w-full text-xs font-extralight text-[#71717A] font-inter">
          {invt.groupId.groupDescription}
        </p>
      </div>
      <div className="flex flex-col gap-1 pt-1 ">
        <button
          onClick={()=>{accepted(invt.groupId._id,invt._id)}}
          className="bg-[#166534] hover:bg-[#15803d] text-white font-medium text-xs px-2 py-0.5  rounded-xl cursor-pointer transition-all duration-200 flex items-center"
        >
          Accept
        </button>

        <button
          onClick={()=>{rejected(invt.groupId._id,invt._id)}}
          className="bg-[#5b0e0e] hover:bg-[#991b1b] text-neutral-300 hover:text-white font-medium text-xs px-2 py-0.5 rounded-xl cursor-pointer transition-all duration-200 flex items-center"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

function NoticePageRendering() {
  const { selectedTab, isSoundOn, toggleSound } = useChatStore();

  const [searchVal, setSearchVal] = useState("");

  const handleChange = (e) => {
    setSearchVal(e.target.value);
  };

  const handleSearch = () => {
    console.log(searchVal);
    
    setSearchVal("");
  };

  const handleBell = () => {
    toggleSound();
    console.log("Now sound is ", isSoundOn);
  };

  const {
    getMessageRequests,
    getGroupRequests,
    messageRequests,
    groupInvitations,
  } = requestStore();

 

  const { selectedGroup, allGroups, isGroupsLoading } = groupStore();
  // console.log(allGroups);

  const [reqType, setReqType] = useState("Message");

  const messageRequest = async (subTab) => {
    await getMessageRequests();
    setReqType(subTab);
  };

  const groupInvitation = async (subTab) => {
    await getGroupRequests();
    setReqType(subTab);
  };

  if (reqType === "Message") {
    return (
      <div className=" border border-[#E2E8F0] box-border  h-full w-27/100 flex flex-col ">
        <div className=" border-b  border-[#E2E8F0] h-1/10 flex">
          <div className="flex justify-center w-27/100 truncate  items-center h-full font-liberation text-[#1d2947] font-bold text-2xl">
            <p>{selectedTab}</p>
          </div>
          <div className=" flex items-center justify-evenly grow ">
            <input
              type="text"
              className="border-slate-200 focus:ring-blue-500 text-gray-900 bg-gray-100 p-2 rounded-2xl h-1/2"
              placeholder="search here..."
              onChange={handleChange}
              value={searchVal}
            />
            <button onClick={handleSearch}>
              <Search className="size-5 text-[#64748B] cursor-pointer" />
            </button>
            {isSoundOn ? (
              <button onClick={handleBell}>
                <Volume2 className="size-5  text-[#64748B] cursor-pointer" />
              </button>
            ) : (
              <button onClick={handleBell}>
                <VolumeX className="size-5  text-[#64748B] cursor-pointer" />
              </button>
            )}
          </div>
        </div>

        {/* tab switch */}
        <div className=" h-1/20 flex justify-evenly items-center  border-[#E2E8F0] border-b ">
          <p
            // onClick={()=>{setSelectedNoticeTab('Messages')}}
            onClick={() => {
              messageRequest("Message");
            }}
            className={` bg-[#F3F4F6] duration-500 cursor-pointer hover:bg-[#FF2D78] hover:text-[#ffffff]  font-liberation font-bold text-[#475569] px-1.5 rounded-2xl  ${reqType === "Message" ? "bg-[#FF2D78] text-[#ffffff]  " : ""}`}
          >
            Message Requests
          </p>
          <p
            // onClick={()=>{setSelectedNoticeTab('Groups')}}
            onClick={() => {
              groupInvitation("Group");
            }}
            className={` bg-[#F3F4F6] duration-500 cursor-pointer hover:bg-[#FF2D78] hover:text-[#ffffff]  font-liberation font-bold text-[#475569] px-1.5 rounded-2xl  ${reqType === "Group" ? "bg-[#FF2D78] text-[#ffffff]  " : ""}`}
          >
            Group Invitations
          </p>
        </div>

        <div className="flex-1 w-full p-2">
          {messageRequests.map((rqs) => (
            <MessageRequest key={rqs._id} rqs={rqs} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className=" border border-[#E2E8F0] box-border  h-full w-27/100 flex flex-col ">
        <div className=" border-b  border-[#E2E8F0] h-1/10 flex">
          <div className="flex justify-center w-27/100 truncate  items-center h-full font-liberation text-[#1d2947] font-bold text-2xl">
            <p>{selectedTab}</p>
          </div>
          <div className=" flex items-center justify-evenly grow ">
            <input
              type="text"
              className="border-slate-200 focus:ring-blue-500 text-gray-900 bg-gray-100 p-2 rounded-2xl h-1/2"
              placeholder="search here..."
              onChange={handleChange}
              value={searchVal}
            />
            <button onClick={handleSearch}>
              <Search className="size-5 text-[#64748B] cursor-pointer" />
            </button>
            {isSoundOn ? (
              <button onClick={handleBell}>
                <Volume2 className="size-5  text-[#64748B] cursor-pointer" />
              </button>
            ) : (
              <button onClick={handleBell}>
                <VolumeX className="size-5  text-[#64748B] cursor-pointer" />
              </button>
            )}
          </div>
        </div>

        {/* tab switch */}
        <div className=" h-1/20 flex justify-evenly items-center  border-[#E2E8F0] border-b ">
          <p
            // onClick={()=>{setSelectedNoticeTab('Messages')}}
            onClick={() => {
              messageRequest("Message");
            }}
            className={` bg-[#F3F4F6] duration-500 cursor-pointer hover:bg-[#FF2D78] hover:text-[#ffffff]  font-liberation font-bold text-[#475569] px-1.5 rounded-2xl  ${reqType === "Message" ? "bg-[#FF2D78] text-[#ffffff]  " : ""}`}
          >
            Message Requests
          </p>
          <p
            // onClick={()=>{setSelectedNoticeTab('Groups')}}
            onClick={() => {
              groupInvitation("Group");
            }}
            className={` bg-[#F3F4F6] duration-500 cursor-pointer hover:bg-[#FF2D78] hover:text-[#ffffff]  font-liberation font-bold text-[#475569] px-1.5 rounded-2xl  ${reqType === "Group" ? "bg-[#FF2D78] text-[#ffffff]  " : ""}`}
          >
            Group Invitations
          </p>
        </div>

        <div className="flex-1 w-full p-2">
          {groupInvitations.map((invt)=>(<GroupInvitation key={invt._id} invt={invt}/>))}
          
        </div>
      </div>
    );
  }
}

export default NoticePageRendering;

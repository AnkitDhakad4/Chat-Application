import React, { useState } from "react";
import { ChevronLeft, Contact } from "lucide-react";
import authStore from "../store/userAuth.store.js";
import requestStore from "../store/requests.store.js";
import useChatStore from "../store/useChatStore.js";
import groupStore from "../store/group.store.js";
import GroupInfo from "./GroupInfo.jsx";

const Info = () => {
  const { selectedNoticeTab, setInfoAbout } = requestStore();
  const { selectedUser, selectedTab, setSelectedUser, chatPartners } =
    useChatStore();
  const user = selectedUser;

  

  const { onlineUsers,loggedInUser } = authStore();
  const onLineUsers = new Set(onlineUsers);

  const [showRemoveMembers, setShowRemoveMembers] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { selectedGroup,addMembersInGroup,removeMembersFromGroup} = groupStore();
  const group = selectedGroup;
  if (selectedTab === "Chats") {
    return (
      <div className="h-full bg-white flex-1  border-y border-r border-[#E2E8F0] ">
        {/* Header */}
        <div className="relative flex items-center pl-4 border-b   h-1/10  border-[#E2E8F0]">
          <button
            onClick={() => {
              setInfoAbout(null);
            }}
            className="flex items-center gap-1 text-pink-500 text-sm"
          >
            <ChevronLeft size={20} className="self-center" />
            Back
          </button>

          <div className="absolute left-1/2 -translate-x-1/2"></div>
        </div>

        {/* Profile */}
        <div className="h-35/100  flex flex-col  items-center pt-6 text-[#FF2D78]">
          <div className="relative">
            <div className="p-1">
              <img
                src={user.profilePic}
                alt={user.name}
                className="w-24 h-24 rounded-lg object-cover border-2 "
              />
            </div>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold font-sora text-slate-800">
            {user.name}
          </h1>

          <p
            className={`text-xs  tracking-wide mt-1 ${onLineUsers.has(user._id) ? "text-green-600" : "text-black"}`}
          >
            {onLineUsers.has(user._id) ? "Online..." : "Offline..."}
          </p>
        </div>

        {/* Info Cards */}
        <div className="w-1/2  mx-auto flex flex-col pt-3 gap-3">
          <InfoCard title="Contact">
            {user.phone || "Did not provided yet."}
          </InfoCard>

          <InfoCard title="Bio">
            {user.about || "Did not provided yet."}
          </InfoCard>

          <InfoCard title="Email ">
            {user.email || "Did not provided yet."}
          </InfoCard>
        </div>
      </div>
    );
  } else {
      return (
        <GroupInfo/>
      );
  }
};

const InfoCard = ({ title, children, outsideClass }) => {
  return (
    <div className="bg-[#F9FAFB] rounded-xl py-2 px-2 shadow-sm border border-[#F3F4F6]">
      <p className="text-[10px] uppercase tracking-[0.25em] font-liberation text-[#6B7280] ">
        {title}
      </p>
      <p className={`text-gray-800 font-inter  font-medium `}>{children}</p>
    </div>
  );
};

export default Info;

// <div>{/* profilePic */}
//

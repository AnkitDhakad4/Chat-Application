import React, { useState } from "react";
import { ChevronLeft, Contact } from "lucide-react";
import authStore from "../store/userAuth.store.js";
import requestStore from "../store/requests.store.js";
import useChatStore from "../store/useChatStore.js";
import groupStore from "../store/group.store.js";

const Info = () => {
  const { selectedNoticeTab, setInfoAbout } = requestStore();
  const { selectedUser, selectedTab, setSelectedUser, chatPartners } =
    useChatStore();
  const user = selectedUser;

  console.log("chatPartners in the info are ", chatPartners);

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
            <div className="p-1 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-lg">
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
      <div className=" relative h-full  bg-white flex-1    border-y border-r border-[#E2E8F0] ">
        {/* header */}
        <div className=" flex items-center pl-4 border-b   h-1/10  border-[#E2E8F0]">
          <button
            onClick={() => {
              setInfoAbout(null);
            }}
            className="flex items-center gap-1 text-pink-500 text-sm"
          >
            <ChevronLeft size={20} className="self-center" />
            Back
          </button>
          <div className="flex justify-center items-center w-full">
            <p className="w-full text-center text-[#111827] font-sora font-bold mr-3">
              Group Info
            </p>
          </div>
        </div>

        {/* expect header */}
        <div className="flex h-9/10 w-full divide-x divide-[#E2E8F0] bg-white overflow-hidden">
          {/* First Column: Group Meta Details */}
          <div className="h-full w-1/2 flex flex-col items-center p-6 text-[#FF2D78] overflow-y-auto scrollbar-none">
            <div className="flex flex-col w-full items-center pb-5 border-b border-slate-100">
              <div className="relative group">
                <div className="p-1 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-[1.02]">
                  <img
                    src={group.groupIcon}
                    alt={"GroupIcon"}
                    className="w-24 h-24 rounded-xl object-cover border-2 border-white"
                  />
                </div>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold font-sora text-slate-800 tracking-tight text-center max-w-xs break-words px-2">
                {group.groupName}
              </h1>

              <div className="w-full max-w-sm flex flex-col gap-2.5 items-center text-[#111827] mt-5 bg-[#F9FAFB] border border-slate-100 p-3.5 rounded-xl">
                <p className="text-sm font-semibold flex justify-between w-full px-1">
                  <span className="text-slate-400 font-normal">Created At</span>
                  <span className="text-[#6B7280]">
                    {new Date(group.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </p>
                <div className="h-[1px] w-full bg-slate-200/60" />
                <p className="text-sm font-semibold flex justify-between w-full px-1">
                  <span className="text-slate-400 font-normal">Members</span>
                  <span className="text-[#6B7280] bg-slate-200/40 px-2 py-0.5 rounded-full text-xs">
                    {group.members.length}
                  </span>
                </p>
              </div>
            </div>

            {/* Description Field Container */}
            <div className="w-full flex flex-col flex-1 mt-5 min-h-[120px]">
              <p className="font-bold text-[#111827] text-xs tracking-wider uppercase font-inter mb-2.5 pl-1 text-center">
                Description
              </p>
              <div className="bg-[#F9FAFB] border border-slate-100 rounded-xl overflow-y-auto flex-1 p-3.5">
                <p className="text-[#4B5563] text-sm leading-relaxed whitespace-pre-wrap">
                  Lorem
                </p>
              </div>
            </div>
          </div>

          {/* Second Column: Actions & Scrollable Directory */}
          <div className="h-full w-1/2 flex flex-col p-6 bg-slate-50/30">
            <p className="font-bold text-[#111827] text-xs tracking-wider uppercase font-inter text-center mb-3.5">
              Members
            </p>

            {/* Clean Active Roster Cards */}
            <div className="flex-1 bg-white border border-slate-100 overflow-y-auto scrollbar-none rounded-xl p-2 shadow-sm mb-4 space-y-0.5">
              {group.members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-slate-50/80 transition-all w-full max-w-full overflow-hidden"
                >
                  <img
                    src={member.profilePic}
                    alt={member.fullName}
                    className={`w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 ${onlineUsers.has(member._id)?"border-green-600":"border-slate-100"}`}
                  />

                  <div className="flex flex-col min-w-0 flex-1">
                    <p className="font-semibold text-sm text-[#111827] truncate">
                      {member.name}
                    </p>

                    {member._id === group.admin ? (
                      <span className="inline-flex items-center text-[11px] text-[#457a05] bg-emerald-50 px-1.5 py-0.5 rounded font-medium mt-0.5 w-fit">
                        admin...
                      </span>
                    ) : (
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {"member..."}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Primary Execution CTA Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddMembers(true);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#FF2D78] hover:bg-[#e02266] text-white text-sm font-semibold shadow-sm transition-colors"
              >
                Add Member
              </button>

              <button
                onClick={() => setShowRemoveMembers(true)}
                className="flex-1 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-semibold transition-colors"
              >
                Remove Members
              </button>
            </div>
          </div>
        </div>

        {/* Portal Overlay & Destructive Selection Box */}
        {showRemoveMembers && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-[450px] max-h-[75vh] bg-white rounded-2xl p-5 shadow-2xl border border-slate-100 flex flex-col">
              <h2 className="text-lg font-bold text-center text-[#111827] border-b pb-3.5 border-slate-100">
                Remove Members
              </h2>

              {/* Selectable Roster Check-list */}
              <div className="mt-3.5 space-y-0.5 max-h-[45vh] overflow-y-auto scrollbar-none flex-1 py-1">
                {group.members
                  .filter((member) => member._id !== group.admin)
                  .map((member) => (
                    <label
                      key={member._id}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F9FAFB] cursor-pointer transition-colors border border-transparent hover:border-slate-100 select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member._id)}
                        onChange={() => {
                          setSelectedMembers((prev) =>
                            prev.includes(member._id)
                              ? prev.filter((id) => id !== member._id)
                              : [...prev, member._id],
                          );
                        }}
                        className="w-4 h-4 rounded text-red-500 focus:ring-red-400 border-slate-300 cursor-pointer"
                      />

                      <img
                        src={member.profilePic}
                        alt={"photo"}
                        className="w-9 h-9 rounded-full object-cover border border-slate-100"
                      />

                      <p className="text-sm font-medium text-[#111827] truncate flex-1">
                        {member.name}
                      </p>
                    </label>
                  ))}
              </div>

              {/* Roster Mutation Actions Control Panel */}
              <div className="flex justify-end gap-2.5 mt-4 pt-3.5 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowRemoveMembers(false);
                    setSelectedMembers([]);
                  }}
                  className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    console.log("Members To Remove:", selectedMembers);
                    // TODO: Call the api funtion to remove members
                    await removeMembersFromGroup(selectedMembers,selectedGroup._id)
                    setShowRemoveMembers(false);
                    setSelectedMembers([]);
                  }}
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors"
                >
                  Remove Selected
                </button>
              </div>
            </div>
          </div>
        )}
        {showAddMembers && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-[450px] max-h-[75vh] bg-white rounded-2xl p-5 shadow-2xl border border-slate-100 flex flex-col">
              <h2 className="text-lg font-bold text-center text-[#111827] border-b pb-3.5 border-slate-100">
                Add Members
              </h2>

              {/* Selectable Roster Check-list */}
              <div className="mt-3.5 space-y-0.5 max-h-[45vh] overflow-y-auto scrollbar-none flex-1 py-1">
                {chatPartners?.map((member) => (
                  <label
                    key={member._id}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F9FAFB] cursor-pointer transition-colors border border-transparent hover:border-slate-100 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member._id)}
                      onChange={() => {
                        setSelectedMembers((prev) =>
                          prev.includes(member._id)
                            ? prev.filter((id) => id !== member._id)
                            : [...prev, member._id],
                        );
                      }}
                      className="w-4 h-4 rounded text-red-500 focus:ring-red-400 border-slate-300 cursor-pointer"
                    />

                    <img
                      src={member.profilePic}
                      alt={"photo"}
                      className="w-9 h-9 rounded-full object-cover border border-slate-100"
                    />

                    <p className="text-sm font-medium text-[#111827] truncate flex-1">
                      {member.name}
                    </p>
                  </label>
                ))}
              </div>

              {/* Roster Mutation Actions Control Panel */}
              <div className="flex justify-end gap-2.5 mt-4 pt-3.5 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowAddMembers(false);
                    setSelectedMembers([]);
                  }}
                  className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={async() => {
                    console.log("Members To Remove:", selectedMembers);
                    // TODO: Call the api funtion to add members
                    await addMembersInGroup(selectedMembers,selectedGroup._id)
                    setShowAddMembers(false);
                    setSelectedMembers([]);
                  }}
                  // disabled={loggedInUser._id !== group.admin}
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors"
                >
                  Add 
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
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

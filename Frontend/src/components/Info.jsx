import React, { useState } from "react";
import { ChevronLeft, Contact } from "lucide-react";
import authStore from "../store/userAuth.store.js";
import requestStore from "../store/requests.store.js";

const Info = () => {
  const { selectedNoticeTab } = requestStore();
  const user = {
    name: "Jordan Smith",
    role: "Senior Product Designer",
    phone: "+1 (555) 987 6543",
    bio: "Crafting ",
    email: "jordan.smith@designflow.io",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
  };

  const { onlineUsers } = authStore();
  const onLineUsers = new Set(onlineUsers);
  const isOnline = onLineUsers.has(user._id);
  const [showRemoveMembers, setShowRemoveMembers] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const group = {
    _id: "6a2668e2b8c864d6b576500e",
    groupName: "New Group",
    groupDescription: "This is group description",
    admin: "69d2a480baf6989be3e13770",
    members: [
      {
        about: "Hey there! I am using Chatflow.",
        _id: "69d2a480baf6989be3e13770",
        name: "A",
        email: "a@gmail.com",
        profilePic:
          "https://res.cloudinary.com/ankitdhakad/image/upload/v1775766038/profile/l2ifejgd0s7h98nlrydi.png",
        lastSeen: "2026-06-14T08:32:01.364Z",
      }
    ],
    createdAt: "2026-06-08T07:01:54.039Z",
    updatedAt: "2026-06-10T19:30:03.218Z",
    __v: 0,
    groupIcon:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1hZxkl7aLUy170veFH3FI9uDbkqoSBjMY2A&s",
  };
  if (selectedNoticeTab !== "Group") {
    return (
      <div className="h-full bg-white flex-1  border-y border-r border-[#E2E8F0] ">
        {/* Header */}
        <div className="relative flex items-center pl-4 border-b   h-1/10  border-[#E2E8F0]">
          <button className="flex items-center gap-1 text-pink-500 text-sm">
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
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-lg object-cover border-2 "
              />
            </div>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold font-sora text-slate-800">
            {user.name}
          </h1>

          <p
            className={`text-xs  tracking-wide mt-1 ${isOnline ? "text-green-600" : "text-black"}`}
          >
            {isOnline ? "Online..." : "Offline..."}
          </p>
        </div>

        {/* Info Cards */}
        <div className="w-1/2  mx-auto flex flex-col pt-3 gap-3">
          <InfoCard title="Contact">
            {user.phone || "Did not provided yet."}
          </InfoCard>

          <InfoCard title="Bio">{user.bio || "Did not provided yet."}</InfoCard>

          <InfoCard title="Email ">
            {user.email || "Did not provided yet."}
          </InfoCard>
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-full  bg-white flex-1    border-y border-r border-[#E2E8F0] ">
        {/* header */}
        <div className=" flex items-center pl-4 border-b   h-1/10  border-[#E2E8F0]">
          <button 
          onClick={()=>{}}
          className="flex items-center gap-1 text-pink-500 text-sm">
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
        <div className="flex h-9/10 w-full rung">
          {/* first colummn */}
          <div className="h-full w-1/2 rung   flex flex-col  items-center pt-4 text-[#FF2D78]">
            <div className="rung flex flex-col w-full items-center py-2">
              <div className="relative">
                <div className="p-1 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-lg">
                  <img
                    src={group.groupIcon}
                    alt={"GroupIcon"}
                    className="w-24 h-24 rounded-lg object-cover border-2 "
                  />
                </div>
              </div>

              <h1 className="mt-4 text-4xl font-extrabold font-sora text-slate-800">
                {group.groupName}
              </h1>

              <div className="rung w-full flex flex-col items-center   text-[#111827] mt-4 ">
                <p className="font-semibold">
                  Created At:{" "}
                  <span className="text-[#6B7280]">
                    {new Date(group.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </p>
                <p className="font-semibold">
                  Members:{" "}
                  <span className="text-[#6B7280]">{group.members.length}</span>
                </p>
              </div>
            </div>

            <p className="font-bold text-[#111827] uppercase font-inter  text-center">
              Description
            </p>
            <div className="bg-[#F9FAFB] overflow-y-scroll scrollbar-none w-full h-fit py-2 px-1 mb-1">
              <p className="px-2 text-[#4B5563]">
                Lorem 
              </p>
            </div>
          </div>

          {/* second column */}
          <div className="h-full w-1/2 rung flex flex-col pt-4 px-2">
            {/* buttons */}
            {/* members heading */}
            <p className="font-bold text-[#111827] uppercase font-inter text-center mb-2">
              Members
            </p>
            {/* members list */}
            <div className="flex-1 bg-[#F9FAFB] overflow-y-scroll scrollbar-none rounded-lg p-2">
              {group.members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-white w-full max-w-full overflow-hidden"
                >
                  <img
                    src={member.profilePic}
                    alt={member.fullName}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0" // Added flex-shrink-0 so the image never squishes
                  />

                  <div className="flex flex-col min-w-0 flex-1 ">
                    <p className="font-medium text-[#111827] truncate">
                      {member.name}
                    </p>

                    {member._id === group.admin ? (
                      <span className="text-xs text-[#457a05] font-medium">
                        admin...
                      </span>
                    ) : (
                      <p className="text-xs text-gray-500 truncate block w-1/2">
                        {'member...'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mb-3">
              <button className="flex-1 py-2 rounded-lg bg-[#FF2D78] text-white font-semibold">
                Add Member
              </button>

              <button
                onClick={() => setShowRemoveMembers(true)}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white font-semibold"
              >
                Remove Members
              </button>
            </div>
          </div>
        </div>
        {showRemoveMembers && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="w-[450px] max-h-[70vh] bg-white rounded-xl p-4 shadow-lg">
              <h2 className="text-xl font-bold text-center text-[#111827]">
                Remove Members
              </h2>

              <div className="mt-4 space-y-2 max-h-[45vh] overflow-y-auto scrollbar-none">
                {group.members
                  .filter((member) => member._id !== group.admin)
                  .map((member) => (
                    <label
                      key={member._id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F9FAFB] cursor-pointer"
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
                      />

                      <img
                        src={member.profilePic}
                        alt={"photo"}
                        className="w-10 h-10 rounded-full object-cover"
                      />

                      <p className="text-[#111827]">{member.name}</p>
                    </label>
                  ))}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => {
                    setShowRemoveMembers(false);
                    setSelectedMembers([]);
                  }}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    console.log("Members To Remove:", selectedMembers);

                    // call api here

                    setShowRemoveMembers(false);
                    setSelectedMembers([]);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white"
                >
                  Remove Selected
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

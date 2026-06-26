import React, { useState, useRef } from "react";
import { ChevronLeft, Pencil, Check, X, Camera } from "lucide-react";
import authStore from "../store/userAuth.store.js";
import requestStore from "../store/requests.store.js";
import useChatStore from "../store/useChatStore.js";
import groupStore from "../store/group.store.js";

function GroupInfo() {
  const { setInfoAbout } = requestStore();
  const { chatPartners } = useChatStore();
  const { onlineUsers, loggedInUser } = authStore();
  const onLineUsers = new Set(onlineUsers);

  const [showRemoveMembers, setShowRemoveMembers] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  
  // Destructure updating actions from your groupStore
  const { 
    selectedGroup, 
    addMembersInGroup, 
    removeMembersFromGroup,
    updateGroupDetails // Ensure your store supports an update method (e.g., updating icon, name, description)
  } = groupStore();
  const group = selectedGroup;

  // Admin Check
  const isAdmin = loggedInUser?._id === group?.admin;

  // Local states for editing group details
  const [isEditingName, setIsEditingName] = useState(false);
  const [groupNameInput, setGroupNameInput] = useState(group?.groupName || "");
  
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [groupDescInput, setGroupDescInput] = useState(group?.description || "Lorem");

  const fileInputRef = useRef(null);

  // Handlers for Save operations
  const handleSaveName = async () => {
    if (groupNameInput.trim() && groupNameInput !== group.groupName) {
      if (updateGroupDetails) {
        await updateGroupDetails({ groupName: groupNameInput }, group._id);
      }
    }
    setIsEditingName(false);
  };

  const handleSaveDesc = async () => {
    if (groupDescInput !== group.description) {
      if (updateGroupDetails) {
        await updateGroupDetails({ description: groupDescInput }, group._id);
      }
    }
    setIsEditingDesc(false);
  };

  const handleIconChange = async (e) => {
    const file = e.target.files[0];
    if (file && updateGroupDetails) {
      // You can either send raw file or a FormData depending on your store/API setup
      const formData = new FormData();
      formData.append("groupIcon", file);
      await updateGroupDetails(formData, group._id);
    }
  };

  return (
    <div className="relative h-full bg-white flex-1 border-y border-r border-[#E2E8F0]">
      {/* header */}
      <div className="flex items-center pl-4 border-b h-1/10 border-[#E2E8F0]">
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

      {/* columns wrapper */}
      <div className="flex h-9/10 w-full divide-x divide-[#E2E8F0] bg-white overflow-hidden">
        
        {/* First Column: Group Meta Details & Admin Modifications */}
        <div className="h-full w-1/2 flex flex-col items-center p-6 text-[#FF2D78] overflow-y-auto scrollbar-none">
          <div className="flex flex-col w-full items-center pb-5 border-b border-slate-100">
            
            {/* Interactive Group Icon for Admin */}
            <div className="relative group/avatar">
              <div className="p-1 rounded-2xl shadow-md transition-transform duration-300 group-hover/avatar:scale-[1.02]">
                <img
                  src={group.groupIcon}
                  alt={"GroupIcon"}
                 className="w-24 h-24 rounded-xl object-cover border-2 border-slate-100"
                />
              </div>
              {isAdmin && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-1 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer text-white m-1"
                >
                  <Camera size={20} />
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleIconChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            {/* Interactive Group Name */}
            <div className="mt-4 flex items-center justify-center gap-2 w-full max-w-xs px-2">
              {isEditingName ? (
                <div className="flex items-center gap-1.5 w-full border border-slate-200 rounded-lg bg-white px-2 py-1 shadow-sm">
                  <input
                    type="text"
                    value={groupNameInput}
                    onChange={(e) => setGroupNameInput(e.target.value)}
                    className="w-full text-lg font-bold text-slate-800 outline-none font-sora"
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="text-emerald-600 hover:bg-emerald-50 p-1 rounded-md transition-colors">
                    <Check size={16} />
                  </button>
                  <button onClick={() => { setIsEditingName(false); setGroupNameInput(group.groupName); }} className="text-slate-400 hover:bg-slate-50 p-1 rounded-md transition-colors">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-extrabold font-sora text-slate-800 tracking-tight text-center break-words max-w-[80%]">
                    {group.groupName}
                  </h1>
                  {isAdmin && (
                    <button 
                      onClick={() => setIsEditingName(true)} 
                      className="text-slate-400 hover:text-[#FF2D78] transition-colors p-1"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                </>
              )}
            </div>

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

          {/* Interactive Description Field Container */}
          <div className="w-full flex flex-col flex-1 mt-5 min-h-[120px]">
            <div className="flex items-center justify-center gap-2 mb-2.5 relative">
              <p className="font-bold text-[#111827] text-xs tracking-wider uppercase font-inter pl-1 text-center">
                Description
              </p>
              {isAdmin && !isEditingDesc && (
                <button 
                  onClick={() => setIsEditingDesc(true)} 
                  className="text-slate-400 hover:text-[#FF2D78] transition-colors absolute right-2"
                >
                  <Pencil size={14} />
                </button>
              )}
            </div>
            
            <div className="bg-[#F9FAFB] border border-slate-100 rounded-xl overflow-y-auto flex-1 p-3.5 flex flex-col">
              {isEditingDesc ? (
                <div className="flex flex-col h-full gap-2">
                  <textarea
                    value={groupDescInput}
                    onChange={(e) => setGroupDescInput(e.target.value)}
                    className="w-full flex-1 bg-white border border-slate-200 rounded-lg p-2 text-sm text-[#4B5563] focus:outline-none focus:ring-1 focus:ring-pink-400 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end gap-1.5">
                    <button onClick={handleSaveDesc} className="flex items-center gap-1 text-xs bg-emerald-600 text-white px-2 py-1 rounded-md hover:bg-emerald-700 transition-colors">
                      <Check size={12} /> Save
                    </button>
                    <button onClick={() => { setIsEditingDesc(false); setGroupDescInput(group.description || "Lorem"); }} className="flex items-center gap-1 text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-md hover:bg-slate-300 transition-colors">
                      <X size={12} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[#4B5563] text-sm leading-relaxed whitespace-pre-wrap">
                  {group.description || "No description provided."}
                </p>
              )}
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
                  className={`w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 ${onLineUsers.has(member._id) ? "border-green-600" : "border-slate-100"}`}
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
            disabled={!isAdmin}
              onClick={() => {
                setShowAddMembers(true);
              }}
              className="flex-1 py-2.5 rounded-xl bg-[#FF2D78] hover:bg-[#e02266] text-white text-sm font-semibold shadow-sm transition-colors"
            >
              Add Member
            </button>

            <button
            disabled={!isAdmin}
              onClick={() => setShowRemoveMembers(true)}
              className="flex-1 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-semibold transition-colors"
            >
              Remove Members
            </button>
          </div>
        </div>
      </div>

      {/* Portal Overlay & Destructive Selection Box (Remove Members) */}
      {showRemoveMembers && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-[450px] max-h-[75vh] bg-white rounded-2xl p-5 shadow-2xl border border-slate-100 flex flex-col">
            <h2 className="text-lg font-bold text-center text-[#111827] border-b pb-3.5 border-slate-100">
              Remove Members
            </h2>

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
                            : [...prev, member._id]
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
                  await removeMembersFromGroup(selectedMembers, group._id);
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

      {/* Portal Overlay (Add Members) */}
      {showAddMembers && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-[450px] max-h-[75vh] bg-white rounded-2xl p-5 shadow-2xl border border-slate-100 flex flex-col">
            <h2 className="text-lg font-bold text-center text-[#111827] border-b pb-3.5 border-slate-100">
              Add Members
            </h2>

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
                          : [...prev, member._id]
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
                onClick={async () => {
                  await addMembersInGroup(selectedMembers, group._id);
                  setShowAddMembers(false);
                  setSelectedMembers([]);
                }}
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

export default GroupInfo;   
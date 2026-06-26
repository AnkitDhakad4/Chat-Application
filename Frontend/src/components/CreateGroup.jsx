import React, { useState } from "react";
import { ChevronLeft, Users, Camera, Loader2Icon } from "lucide-react";
import requestStore from "../store/requests.store.js";
import useChatStore from "../store/useChatStore.js";
import groupStore from "../store/group.store.js";

const CreateGroup = () => {
  const { setInfoAbout } = requestStore();
  const { chatPartners,getTokenForUpload,uploadOnCloudinary,isImageUploading } = useChatStore();

  // Form State
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupIcon, setGroupIcon] = useState(null); // Stores the local Object URL for visual previewing
  const [iconFile, setIconFile] = useState(null);   // Stores the raw File object for your API/FormData submission

  const { createGroup, setoneGroupIscreated } = groupStore();

  const handleIconChange = (e) => {
    const file = e.target?.files[0];
    if (file) {
      // Clean up previous blob URL if updating images to prevent memory leaks
      if (groupIcon && groupIcon.startsWith("blob:")) {
        URL.revokeObjectURL(groupIcon);
      }
      setIconFile(file);
      setGroupIcon(URL.createObjectURL(file)); // Set directly to groupIcon for direct template preview
      
    }
  };

  const toggleMemberSelection = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log({
      groupName,
      groupDescription,
      selectedMembers,
      iconFile,
      groupIcon
    });


    const file=iconFile
    let url="";
    if(file)
    {
        try {
      const {timestamp,signature,apiKey}=await getTokenForUpload('groupIcons')
      const formData=new FormData()
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", "groupIcons");
      formData.append('file',file)
        
     
      const data=await uploadOnCloudinary(formData)
      console.log(data.secure_url)
      url=data.secure_url;
      
    } catch (error) {
      console.log(error?.message)
    }
    }

    // Pass inputs or a custom FormData instances directly to your store action
    try {
      console.log("Url is ",url)
      await createGroup({
        groupName,
        description: groupDescription,
        members: selectedMembers,
        groupIcon: url  
      });

      setoneGroupIscreated(false)
    } catch (error) {
        console.log("Error while creating group",error)
    } 
  };

  return (
    <div className="relative h-full bg-white flex-1 border-y border-r border-[#E2E8F0]">
      {/* Header */}
      <div className="flex items-center pl-4 border-b h-1/10 border-[#E2E8F0]">
        <button
          type="button"
          onClick={() => setoneGroupIscreated(false)}
          className="flex items-center gap-1 text-pink-500 text-sm"
        >
          <ChevronLeft size={20} className="self-center" />
          Back
        </button>
        <div className="flex justify-center items-center w-full">
          <p className="w-full text-center text-[#111827] font-sora font-bold mr-3">
            Create a Group
          </p>
        </div>
      </div>

      {/* Content Body Layout */}
      <form
        onSubmit={handleFormSubmit}
        className="flex h-9/10 w-full divide-x divide-[#E2E8F0] bg-white overflow-hidden"
      >
        {/* First Column: Group Meta Details Form */}
        <div className="h-full w-1/2 flex flex-col items-center p-6 text-[#FF2D78] overflow-y-auto scrollbar-none">
          <div className="flex flex-col w-full items-center pb-5 border-b border-slate-100">
            
            {/* Interactive Image Upload Holder */}
            <div className="relative group/avatar flex flex-col items-center">
              <label className="cursor-pointer block mb-1 rounded-2xl shadow-md transition-transform duration-300 group-hover/avatar:scale-[1.02]">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleIconChange}
                />
                {groupIcon ? (
                  <div className="relative">
                    <img
                      src={groupIcon}
                      alt="Group Preview"
                      className="w-24 h-24 rounded-xl object-cover border-2 border-slate-100"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity text-white">
                      <Camera size={18} />
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-xl border-2 border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-1">
                    <Users size={28} className="text-pink-500" />
                    <span className="text-[10px] font-semibold font-inter">Upload Icon</span>
                  </div>
                )}
              </label>

              {/* Show Remove link only when an icon state is selected */}
              {groupIcon && (
                <button
                  type="button"
                  onClick={() => {
                    if (groupIcon.startsWith("blob:")) {
                      URL.revokeObjectURL(groupIcon);
                    }
                    setGroupIcon(null);
                    setIconFile(null);
                  }}
                  className="text-xs text-slate-400 hover:text-red-500 hover:cursor-pointer font-medium p-1 transition-colors mt-0.5"
                >
                  Remove Icon
                </button>
              )}
            </div>

            {/* Group Name Input Field */}
            <div className="w-full max-w-sm flex flex-col mt-5">
              <label className="font-bold text-[#111827] text-xs tracking-wider uppercase font-inter mb-2 pl-1">
                Group Name
              </label>
              <input
                type="text"
                required
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full bg-[#F9FAFB] text-slate-800 border border-slate-200 p-3.5 rounded-xl font-sora font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-[#FF2D78] placeholder:text-slate-400 placeholder:font-normal transition-all"
              />
            </div>
          </div>

          {/* Description Field Container */}
          <div className="w-full flex flex-col flex-1 mt-5 min-h-[120px]">
            <label className="flex justify-between ">
              <span className="font-bold text-[#111827] text-xs tracking-wider uppercase font-inter mb-2.5 pl-1 text-center">

              Group Description
              </span>
              <span
                className={`text-xs pt-2 font-mono font-extralight ${
                    60 - groupDescription.length <= 10
                    ? "text-red-500"
                    : "text-slate-500"
                }`}
                >
                {100 - groupDescription.length}/100
                </span>
            </label>
            
            <div className="bg-[#F9FAFB] border border-slate-100 rounded-xl flex flex-col flex-1 p-2">
              <textarea
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="What is this group about?..."
                className="w-full h-full bg-transparent text-[#4B5563] text-sm leading-relaxed whitespace-pre-wrap p-1.5 resize-none focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Second Column: Select Initial Members & Dispatch Action */}
        <div className="h-full w-1/2 flex flex-col p-6 bg-slate-50/30">
          <p className="font-bold text-[#111827] text-xs tracking-wider uppercase font-inter text-center mb-3.5">
            Select Group Members
          </p>

          {/* Roster Setup Box Selection */}
          <div className="flex-1 bg-white border border-slate-100 overflow-y-auto scrollbar-none rounded-xl p-2 shadow-sm mb-4 space-y-0.5">
            {chatPartners && chatPartners.length > 0 ? (
              chatPartners.map((member) => (
                <label
                  key={member._id}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-slate-50/80 transition-all w-full max-w-full overflow-hidden cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member._id)}
                    onChange={() => toggleMemberSelection(member._id)}
                    className="w-4 h-4 rounded text-pink-500 focus:ring-pink-400 border-slate-300 cursor-pointer"
                  />

                  <img
                    src={member.profilePic}
                    alt={member.fullName || member.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-slate-100"
                  />

                  <div className="flex flex-col min-w-0 flex-1">
                    <p className="font-semibold text-sm text-[#111827] truncate">
                      {member.name || member.fullName}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      Invite to group
                    </p>
                  </div>
                </label>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm py-8">
                No active contacts found to add.
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="w-full ">
            <button
              type="submit"
              disabled={!groupName.trim() || isImageUploading}
              className="w-full py-2.5  flex  items-center rounded-xl bg-[#FF2D78] hover:bg-[#e02266] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-sm transition-colors text-center"
            >
             <span className="w-9/10 pl-10"> Launch Group</span>
             {isImageUploading && <span className="w-1/10"> <Loader2Icon className="animate-spin size-5"/></span>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateGroup;



//  {/* Second Column: Actions & Scrollable Directory */}
//         <div className="h-full w-1/2 flex flex-col p-6 bg-slate-50/30">
//           <p className="font-bold text-[#111827] text-xs tracking-wider uppercase font-inter text-center mb-3.5">
//             Select Members ({selectedMembers.length})
//           </p>

//           Clean Active Roster Cards Container
//           <div className="flex-1 bg-white border border-slate-100 overflow-y-auto scrollbar-none rounded-xl p-2 shadow-sm mb-4 space-y-0.5">
//             {chatParteners && chatParteners.length > 0 ? (
//               chatParteners.map((partner) => (
//                 <label
//                   key={partner._id}
//                   className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-slate-50/80 transition-all w-full max-w-full overflow-hidden cursor-pointer select-none"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedMembers.includes(partner._id)}
//                     onChange={() => {
//                       setSelectedMembers((prev) =>
//                         prev.includes(partner._id)
//                           ? prev.filter((id) => id !== partner._id)
//                           : [...prev, partner._id]
//                       );
//                     }}
//                     className="w-4 h-4 rounded text-pink-500 focus:ring-pink-400 border-slate-300 cursor-pointer"
//                   />

//                   <img
//                     src={partner.profilePic}
//                     alt={partner.name}
//                     className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-slate-100"
//                   />

//                   <div className="flex flex-col min-w-0 flex-1">
//                     <p className="font-semibold text-sm text-[#111827] truncate">
//                       {partner.name}
//                     </p>
//                     <p className="text-xs text-slate-400 truncate mt-0.5">
//                       {partner.email || "No email available"}
//                     </p>
//                   </div>
//                 </label>
//               ))
//             ) : (
//               <div className="h-full flex items-center justify-center text-slate-400 text-sm">
//                 No contacts available to add
//               </div>
//             )}
//           </div>

//           {/* Primary Execution Submit CTA Button */}
          
//         </div>
import React from "react";
import { Link, Route } from "react-router-dom";
import usechatStore from "../store/useChatStore.js";
import authStore from "../store/userAuth.store.js";
import { EllipsisVertical, LogOut,Loader2, User } from "lucide-react";
import groupStore from "../store/group.store.js";
import requestStore from "../store/requests.store.js";
import { useRef } from "react";
import { useState } from "react";
import UserProfile from "./UserProfile.jsx";

function Sidebar() {
  const { selectedTab, setSelectedTab, isUsersLoading,getTokenForUpload,uploadOnCloudinary,isImageUploading } = usechatStore();
  
  const { user, logout,updateProfile } = authStore();
  const inst=useRef()
  const clickOnIcon=(e)=>{
    console.log(e)
    inst.current?.click();
  }
  
  const [imageUploading, setimageUploadingg] = useState(false)
  
  const [preview,setPreview] =useState()
  const [previewURL,setpreviewURL]=useState();
  const handleImageChange=async(e)=>{
  
    const file=e.currentTarget?.files[0]
    const url=await URL.createObjectURL(file)
    setpreviewURL(url)
  
    try {
      const {timestamp,signature,apiKey}=await getTokenForUpload('profilePics')
      const formData=new FormData()
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", "profilePics");
      formData.append('file',file)
      
     
      const data=await uploadOnCloudinary(formData)
      // console.log(data.secure_url)
      await updateProfile(data.secure_url)

    } catch (error) {
      console.log(error?.message)
    }

  }

 
  const { setSelectedUser, getContacts, getchatPartners } = usechatStore();
  const { setSelectedGroup } = groupStore();
  const { infoAbout, setInfoAbout, getMessageRequests, getGroupRequests } = requestStore();

  const handleClick = async (e) => {
    const tab = e.currentTarget.value;

    if (tab === 'Activity') {
      await getMessageRequests();
      await getGroupRequests();
      setSelectedUser(null);
      setSelectedGroup(null);
    }
    await getContacts();
    await getchatPartners();
    setInfoAbout(null);
    setSelectedTab(tab);
  };

  const [openMenu, setOpenMenu] = React.useState(false);
  const [profileViewer,setprofileViewer]=React.useState(false)
  const components = [
    {
      name: "Chats",
      icon: "./icons/comment.png",
    },
    {
      name: "Contacts",
      icon: "./icons/contact.png",
    },
    {
      name: "Groups",
      icon: "./icons/discussion.png",
    },
    {
      name: "Activity",
      icon: "./icons/bell.png",
    },
  ];

  return (
    <div className="group border border-[#E2E8F0] bg-[#FFFFFF] text-black flex flex-col overflow-hidden w-22 hover:w-1/5 h-full font-liberation justify-evenly transition-all duration-500 ease-in-out z-30">
      
      {/* logo and new chat */}
      <div className="flex flex-col gap-4 p-4 rounded-lg">
        <div className=" ring-black flex items-center gap-2 p-1.5 justify-center group-hover:justify-start">
          <img  
            src="./chatFlowLogo.png"
            alt="logo"
            className="h-12 pt-1 pl-1 rounded-full min-w-[48px]"
          />
          {/* Replaced 'hidden' with smooth max-width and opacity transitions */}
          <div className="flex flex-col justify-end whitespace-nowrap max-w-0 opacity-0 scale-95 group-hover:max-w-xs group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-in-out overflow-hidden">
            <p className="text-xl font-bold text-[#0F172A] p-0">
              <Link to="/">Chatflow</Link>
            </p>
            <span className="font-serif text-xs">Modern Messaging</span>
          </div>
        </div>

        <div className="my-[24px]"></div>
      </div>

      {/* chat options */}
      <div className="ring-black flex justify-center flex-1 p-1">
        <div className="flex flex-col gap-3 w-full px-2 group-hover:w-4/5 group-hover:px-0 transition-all duration-500">
          {components.map((component, ind) => {
            return (
              <button
                className={` ${selectedTab === component.name ? "bg-[#FF2D78] text-[#efe6e6] hover:text-[#efe6e6] duration-0" : ""}
                } flex h-10 justify-center group-hover:justify-start px-0 group-hover:px-4 items-center gap-2.5 font-liberation font-bold text-[#475569] bg-[#F3F4F6] focus:bg-[#FF2D78] hover:bg-[#FF2D78]/10 hover:text-[#FF2D78] hover:cursor-pointer transition-colors duration-200 rounded-md w-full overflow-hidden`}
                value={component.name}
                key={component.name}
                onClick={handleClick}
                disabled={isUsersLoading}
              >
                <img
                  src={component.icon}
                  alt={component.name}
                  className="size-6 min-w-[24px] hover:text-[#FF2D78]"
                />
                {/* Fixed text lag: Smoothly shrinks layout space & opacity at 300ms match */}
                <span className="whitespace-nowrap max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-500 ease-in-out inline-block overflow-hidden">
                  {component.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* User Profile */}
      <div className="relative w-full">
        <div className="rounded-full border-[2px] border-[#E2E8F0] w-9/10 mx-auto group-hover:ml-4 transition-all duration-500"></div>
        <div className="relative flex w-full pt-3 px-4 group-hover:px-2 pb-1.5 gap-2 justify-center group-hover:justify-start">
         <div className="relative size-10 mt-0.5 min-w-[40px] group/avatar cursor-pointer" onClick={clickOnIcon}>
              {/* The Profile Image */}
              <img
                src={ previewURL||user.profilePic || "./chatFlowLogo.png"}
                alt="avatar"
                className="w-full h-full object-cover rounded-xl"
              />

              {/*  Hover  */}
              <div className="absolute inset-0 bg-gray-500/80 rounded-xl flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200">
                {!isImageUploading?<span className="text-[8px]  text-white uppercase tracking-wider ">
                  change
                </span>:<Loader2 className="text-white animate-spin"/>  }
              </div>
            </div>

              {/* File Input */}
              <input 
                onChange={handleImageChange}
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={inst} 
              />
          
          <div className="flex flex-col text-[#0F172A] max-w-0 opacity-0 group-hover:max-w-[55%] group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap">
            <p className="font-bold text-lg truncate">{user.name}</p>
            <p className="font-light text-[#0F172A]/50 text-xs pl-0.5 truncate">
              {user.about}
            </p>
          </div>
          <button
            type="button"
            aria-label="Open profile menu"
            aria-expanded={openMenu}
            onClick={() => {
              setOpenMenu((prv) => !prv);
            }}
            className="opacity-0 w-0 group-hover:w-auto group-hover:opacity-100 ml-auto rounded-lg p-2 text-[#64748B] transition-all duration-500 hover:bg-[#E2E8F0] hover:text-[#0F172A] hover:cursor-pointer overflow-hidden"
          >
            <EllipsisVertical className="size-5" />
          </button>
          {openMenu && (
            <div className="absolute hidden group-hover:block bottom-14 right-3 z-20 w-40 rounded-lg border border-[#E2E8F0] bg-white p-1.5 font-liberation shadow-xl shadow-slate-200/80">
              <ul>
                <li>
                  <button
                    type="button"
                    className="flex  w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-[#DC2626] transition-colors duration-200 hover:bg-[#FEF2F2] hover:cursor-pointer"
                    onClick={logout}
                  >
                    <LogOut className="size-4" />
                    <span>Logout</span>
                  </button>
                </li>
              <li>
                 <button 
                 type="button"
                    className="flex  w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-[#DC2626] transition-colors duration-200 hover:bg-[#FEF2F2] hover:cursor-pointer"
           
                 onClick={()=>{
                  setprofileViewer((prv)=>(!prv))
                  setOpenMenu(false)}
                }
                 >
                  <User className="size-4"/>
                  <span>Profile</span>
                  </button>
                  
                </li>

        
              </ul>
            </div>
          )}
        </div>
      </div>
    
          {profileViewer && <UserProfile setprofileViewer={setprofileViewer}/>}
    
    </div>
  );
}

export default Sidebar;
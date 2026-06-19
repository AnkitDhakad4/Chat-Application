import React from "react";
import { Link, Route } from "react-router-dom";
import usechatStore from "../store/useChatStore.js";
import authStore from "../store/userAuth.store.js";
import { EllipsisVertical, LogOut } from "lucide-react";
import groupStore from "../store/group.store.js";
import requestStore from "../store/requests.store.js";
function Sidebar() {
  const { selectedTab, setSelectedTab, isUsersLoading } = usechatStore();
  
  const { user, logout } = authStore();
  const {setSelectedUser,getContacts,getchatPartners}=usechatStore();
  const {setSelectedGroup}=groupStore();
  const {infoAbout,setInfoAbout,getMessageRequests,getGroupRequests}=requestStore()
  const handleClick = async (e) => {
    const tab = e.currentTarget.value;

    if(tab==='Activity')
    {
      await getMessageRequests()
      await getGroupRequests()
      setSelectedUser(null)
      setSelectedGroup(null);
    }
    await getContacts()
    await getchatPartners()
    setInfoAbout(null)
    setSelectedTab(tab);
  };

  const [openMenu, setOpenMenu] = React.useState(false);

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
    // ,
    // {
    //   name: "Settings",
    //   icon: "./icons/setting.png",
    // },
  ];

  return (
    <div className=" border border-[#E2E8F0]  bg-[#FFFFFF] text-black flex flex-col overflow-hidden w-1/5 h-full font-liberation justify-evenly  ">
      {/* logo and new chat */}
      <div className="flex flex-col gap-4 p-4 rounded-lg">
        <div className="ring-1 ring-black flex items-center gap-2 p-1.5">
          <img
            src="./chatFlowLogo.png"
            alt="logo"
            className="w-12 h-12 pt-1 rounded-full"
          />
          <div className="flex flex-col justify-end">
            <p className="text-xl font-bold text-[#0F172A]  p-0">
              <Link to="/">Chatflow</Link>
            </p>
            <span className="font-serif text-xs">Modern Messaging</span>
          </div>
        </div>

        <div className="my-[24px]">
          <button className="text-lg text-white p-2 rounded-lg flex items-center gap-2 justify-center bg-[#FF2D78] w-full shadow-lg">
            <span
              className="
size-3
rounded-full
ring-1
flex items-center justify-center
text-sm
font-bold
leading-none
"
            >
              +
            </span>
            <span>New Chat</span>
          </button>
        </div>
      </div>
      {/* chat options */}
      <div className=" ring-black flex justify-center flex-1  p-1  ">
        <div className="flex flex-col  gap-3 w-4/5">
          {components.map((component, ind) => {
            return (
              <button
                className={` ${selectedTab === component.name ? "bg-[#FF2D78] text-[#efe6e6] hover:text-[#efe6e6] duration-0" : ""}
              }  flex h-10  justify-start px-4 items-center gap-2.5  font-liberation font-bold text-[#475569] bg-[#F3F4F6] focus:bg-[#FF2D78] hover:bg-[#FF2D78]/10 hover:text-[#FF2D78] hover:cursor-pointer transition-colors duration-200 rounded-md `}
                value={component.name}
                key={component.name}
                onClick={handleClick}
                disabled={isUsersLoading}
              >
                <img
                  src={component.icon}
                  alt={component.name}
                  className="size-6 hover:text-[#FF2D78]"
                />
                <span>{component.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* User Profile */}
      <div className=" relative ">
        <div className=" rounded-full   border-[2px] border-[#E2E8F0] w-9/10 ml-4"></div>
        <div className="flex w-full pt-3 px-2 pb-1.5 gap-2">
          <img
            src={user.profilePic || "./chatFlowLogo.png"}
            alt="avatar"
            className="size-10 mt-0.5  object-cover rounded-xl"
          />
          <div className="flex flex-col text-[#0F172A]">
            <p className="font-bold text-lg">{user.name}</p>
            <p className="font-light text-[#0F172A]/50 text-xs pl-0.5">
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
            className="ml-auto rounded-lg p-2 text-[#64748B] transition-colors duration-200 hover:bg-[#E2E8F0] hover:text-[#0F172A] hover:cursor-pointer"
          >
            <EllipsisVertical className="size-5" />
          </button>
          {openMenu && (
            <div className="absolute bottom-14 right-3 z-20 w-40 rounded-lg border border-[#E2E8F0] bg-white p-1.5 font-liberation shadow-xl shadow-slate-200/80">
              <ul>
                <li>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-[#DC2626] transition-colors duration-200 hover:bg-[#FEF2F2] hover:cursor-pointer"
                    onClick={logout}
                  >
                    <LogOut className="size-4" />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

{
  /* <div className="flex  justify-start px-4 items-center gap-2.5 h-8 font-liberation font-bold text-[#475569] bg-[#F3F4F6] focus:bg-[#FF2D78] hover:bg-[#FF2D78]/10 hover:text-[#FF2D78] hover:cursor-pointer transition-colors duration-200 rounded-md ">
            <img src="./icons/telephone.png" alt="chats" className="size-6" />
            <span>Chats</span>
          </div> */
}

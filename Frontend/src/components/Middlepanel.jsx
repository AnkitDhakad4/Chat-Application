import React, { useState } from "react";
import useChatStore from "../store/useChatStore.js";
import authStore from "../store/userAuth.store.js";
import { Search, Bell, BellOff, LoaderCircle,VolumeOff,Volume2, VolumeX } from "lucide-react";
import ProfileHeader from "./profileHeader.jsx";
import { useEffect } from "react";
import toast from "react-hot-toast";
import requestStore from "../store/requests.store.js";
import groupStore from "../store/group.store.js";
import GroupProfileView from './GroupProfileView.jsx'
function Middlepanel() {
  const {
    selectedTab,
    isSoundOn,
    toggleSound,
    selectedUser,
    setSelectedUser,
    getchatPartners,
    getContacts,
    contacts,
    chatPartners,
    getMessages,
    isUsersLoading,
  } = useChatStore();

  const [searchVal, setSearchVal] = useState("");

  const { onlineUsers } = authStore();

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

  

  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers([]);
    async function LoadChats() {
      try {
        if (selectedTab === "Chats") {
          let res = await getchatPartners();
          setUsers(res);
          console.log("chatParteners are: ",res)
          
        } else if (selectedTab === "Contacts") {
          let res = await getContacts();
          
          setUsers(res);
          
        }
      } catch (error) {
        
        toast.error(error?.message);
      }
    }
    LoadChats();
    return () => {};
  }, [selectedTab]);


  const {selectedNoticeTab,setSelectedNoticeTab,getMessageRequests,getGroupRequests}=requestStore();

  const tempRequests= [
        {
            "_id": "6a2d18e17b0c6142f49ed4cb",
            "senderId": "69d8177a438b5137a1682528",
            "receiverId": "69d2a516baf6989be3e137af",
            "status": "accepted",
            "createdAt": "2026-06-13T08:46:25.178Z",
            "updatedAt": "2026-06-13T08:51:19.214Z",
            "__v": 0
        }
    ]

    const {selectedGroup,allGroups,isGroupsLoading,getAllGroups}=groupStore();

    useEffect(()=>{
      async function getIt(){
        await getAllGroups()
      }

       getIt()
    },[getAllGroups])
    

    if(selectedTab==='Chats' )
  {return (
    <div className=" border border-[#E2E8F0] box-border  h-full w-27/100 flex flex-col ">
      <div className=" border-b border-[#E2E8F0] h-1/10 flex">
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

      {/* chat appears here */}
     
      <div className="flex-1 flex flex-col gap-1  p-2 w-full overflow-auto scrollbar ">
        {/* chat component */}

        {isUsersLoading ? (
          <div className="flex items-center justify-center gap-3">
            {" "}
            <p className="font-inter ">Loading...</p>{" "}
            <LoaderCircle className="animate-spin size-4" />{" "}
          </div>
        ) : (
          users.map((user) => (
            // hover:cursor-pointer h-12/100  p-1 flex items-center gap-1 w-full
            <ProfileHeader
              key={user._id}
              onlineUsers={onlineUsers}
              user={user}
              outsideClass="hover:cursor-pointer h-12/100  p-1 flex items-center gap-1 w-full"
            />
          ))
        )}
       
      </div>
    </div>
  );}

  if(selectedTab==='Groups')
  {return (
    
     <div className=" border border-[#E2E8F0] box-border  h-full w-27/100 flex flex-col ">
      <div className=" border-b border-[#E2E8F0] h-1/10 flex">
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

      {/* chat appears here */}
      
      <div className="flex-1 flex flex-col gap-1  p-2 w-full overflow-auto scrollbar ">
      
        {isGroupsLoading ? (
          <div className="flex items-center justify-center gap-3">
            {" "}
            <p className="font-inter ">Loading...</p>{" "}
            <LoaderCircle className="animate-spin size-4" />{" "}
          </div>
        ) : (
          allGroups.map((group) => (
            // hover:cursor-pointer h-12/100  p-1 flex items-center gap-1 w-full
            <GroupProfileView
            upper={true}
            key={group._id}
              group={group}
              outsideClass="hover:cursor-pointer  h-12/100  p-1 flex items-center gap-1 w-full"
            />
            
          ))
        )
        
        }

       
      </div>
    </div>
  );}
  else  {
    return (
   
     <div className=" border border-[#E2E8F0] box-border  h-full w-27/100 flex flex-col ">
      <div className=" border-b border-[#E2E8F0] h-1/10 flex">
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

      {/* chat appears here */}
     
      <div className="flex-1 flex flex-col gap-1  p-2 w-full overflow-auto scrollbar ">
        {/* chat component */}

        {isUsersLoading ? (
          <div className="flex items-center justify-center gap-3">
            {" "}
            <p className="font-inter ">Loading...</p>{" "}
            <LoaderCircle className="animate-spin size-4" />{" "}
          </div>
        ) : (
          users.map((user) => (
            // hover:cursor-pointer h-12/100  p-1 flex items-center gap-1 w-full
            <ProfileHeader
              key={user._id}
              onlineUsers={onlineUsers}
              user={user}
              fromContactPage={true}
              outsideClass="hover:cursor-pointer h-12/100  p-1 flex items-center gap-1 w-full"
            />
          ))
        )}
       
      </div>
    </div>
  );
  }
}

export default Middlepanel;

//  <div
//           className="hover:cursor-pointer h-12/100  p-1 flex items-center gap-1 w-full"
//           onClick={()=>selectUser(user._id)}
//            >
//           <div className="relative h-full ">
//             <div className={`${onlineUsers.includes(user._id)? 'online':''} absolute size-3 shrink-0 `}></div>
//             <img
//               src={user.image}
//               className="h-full object-cover rounded-full "
//             />
//           </div>
//           <div className=" h-full flex-1   min-w-0 flex justify-center flex-col">
//             <div className="flex  justify-between pr-1">
//               <p className="font-liberation text-[#0F172A] text-lg font-bold"> {user.name}</p>
//               {/* <p className="text-xs font-mono">{user.lastSeen}</p> */}
//             </div>
//             <p className="font-liberation truncate max-w-full text-xs text-gray-500 ">{user.about}</p>
//           </div>

//         </div>

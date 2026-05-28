import React, { useState } from "react";
import useChatStore from "../store/useChatStore.js";
import authStore from "../store/userAuth.store.js";
import { Search, Bell, BellOff } from "lucide-react";

function Middlepanel() {
  const { selectedTab, isSoundOn, toggleSound } = useChatStore();

  const [searchVal, setSearchVal] = useState("");
  
  const {onlineUsers}=authStore()

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

  const users = [
  {
    _id: "1",
    name: "John Doe",
    image:
      "https://randomuser.me/api/portraits/men/1.jpg",
    about:
      "Frontend developer who loves clean UI and smooth animations.",
  },

  {
    _id: "2",
    name: "Emma Watson",
    image:
      "https://randomuser.me/api/portraits/women/2.jpg",
    about:
      "Coffee addict ☕ and passionate product designer.",
  },

  {
    _id: "3",
    name: "Michael Lee",
    image:
      "https://randomuser.me/api/portraits/men/3.jpg",
    about:
      "Building scalable backend systems with Node.js.",
  },

  {
    _id: "4",
    name: "Sophia Turner",
    image:
      "https://randomuser.me/api/portraits/women/4.jpg",
    about:
      "UI/UX enthusiast creating delightful user experiences.",
  },

  {
    _id: "5",
    name: "David Kim",
    image:
      "https://randomuser.me/api/portraits/men/5.jpg",
    about:
      "Full-stack engineer and open-source contributor.",
  },

  {
    _id: "6",
    name: "Olivia Brown",
    image:
      "https://randomuser.me/api/portraits/women/6.jpg",
    about:
      "Loves photography, traveling, and React development.",
  },

  {
    _id: "7",
    name: "James Wilson",
    image:
      "https://randomuser.me/api/portraits/men/7.jpg",
    about:
      "Cybersecurity learner and Linux fanboy.",
  },

  {
    _id: "8",
    name: "Ava Martinez",
    image:
      "https://randomuser.me/api/portraits/women/8.jpg",
    about:
      "Creating modern mobile-first web applications.",
  },

  {
    _id: "9",
    name: "Ethan Clark",
    image:
      "https://randomuser.me/api/portraits/men/9.jpg",
    about:
      "AI enthusiast exploring machine learning and TinyML.",
  },

  {
    _id: "10",
    name: "Isabella Moore",
    image:
      "https://randomuser.me/api/portraits/women/10.jpg",
    about:
      "Minimalist designer who enjoys elegant interfaces.",
  },
];



  return (
    <div className=" border border-[#E2E8F0] border-box  h-full w-27/100 flex flex-col ">
      <div className=" border-b-1 border-[#E2E8F0] h-1/10 flex">
        <div className="flex justify-center w-27/100  items-center h-full font-liberation text-[#1d2947] font-bold text-2xl">
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
              <Bell className="size-5  text-[#64748B] cursor-pointer" />
            </button>
          ) : (
            <button onClick={handleBell}>
              <BellOff className="size-5  text-[#64748B] cursor-pointer" />
            </button>
          )}
        </div>
      </div>
      
      {/* chat appears here */}
      <div className="h-9/10 flex flex-col gap-1  p-2 w-full overflow-auto scrollbar ">
        {/* chat component */}
        {users.map((user)=>(
          <div className="h-12/100  p-1 flex items-center gap-1 w-full">
          <div className="relative h-full ">
            <div className={`${onlineUsers.includes(user._id)? 'online':''} absolute size-3 shrink-0 `}></div>
            <img
              src={user.image}
              className="h-full object-cover rounded-full "
            />
          </div>
          <div className=" h-full flex-1   min-w-0 flex justify-center flex-col">
            <div className="flex  justify-between pr-1">
              <p className="font-liberation text-[#0F172A] text-lg font-bold"> {user.name}</p>
              {/* <p className="text-xs font-mono">{user.lastSeen}</p> */}
            </div>
            <p className="font-liberation truncate max-w-full text-xs text-gray-500 ">{user.about}</p>
          </div>
          
        </div>
        ))}
      </div>
    </div>
  );
}

export default Middlepanel;

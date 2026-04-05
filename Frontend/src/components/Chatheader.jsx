import React, { useEffect } from "react";
import useChatStore from "../store/useChatStore";
import { X } from "lucide-react";

function Chateheader() {
  const { selectedUser, setSelectedUser } = useChatStore();

  const handleCross = () => {
    setSelectedUser(null);
  };

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        handleCross()
      }
    };

    window.addEventListener("keyup", handleEscKey);

    return () => window.removeEventListener("keyup", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div className="w-full justify-between pr-4 items-center h-fit flex gap-2 p-1 bg-gray-700/45 ring-1 ring-white items-center">
      <div className="flex flex-row gap-3">
        <div className="avatar avatar-online pl-2  ">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            className="h-10 w-10"
          />
        </div>
        <div className="flex flex-col justify-center ">
          <p className=""> {selectedUser.name} </p>
          <p className="-mt-1 p-0  text-xs">online...</p>
        </div>
      </div>

      <X className="hover:cursor-pointer" onClick={handleCross} />
    </div>
  );
}

export default Chateheader;

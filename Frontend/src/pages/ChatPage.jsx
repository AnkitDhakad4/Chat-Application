import React from "react";
import NoChatPage from "../components/NoChatPage";
import Middlepanel from "../components/Middlepanel";
import Sidebar from "../components/Sidebar";
import MessagePage from "../components/MessagePage";
import useChatStore from "../store/useChatStore.js";

function ChatPage() {
  const { selectedUser } = useChatStore();

  return (
    <div className="flex flex-row  h-full  w-full">
      <Sidebar />

      <Middlepanel />
      {!selectedUser ? <NoChatPage /> : <MessagePage />}
    </div>
  );
}

export default ChatPage;

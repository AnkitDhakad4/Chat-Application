import React from "react";
import NoChatPage from "../components/NoChatPage";
import Middlepanel from "../components/Middlepanel";
import Sidebar from "../components/Sidebar";
import MessagePage from "../components/MessagePage";
import useChatStore from "../store/useChatStore.js";
import requestStore from "../store/requests.store.js";
import Info from '../components/Info.jsx'
import NoticePageRendering from "../components/NoticePageRendering.jsx";

function ChatPage() {
  const { selectedUser,selectedTab } = useChatStore();
const {infoAbout,setInfoAbout}=requestStore()
  return (
    <div className="flex flex-row  h-full  w-full">
      <Sidebar />

      {selectedTab==='Activity'?<NoticePageRendering/> :<Middlepanel />}
      {infoAbout ?<Info/> :<>{!selectedUser ? <NoChatPage /> : <MessagePage />}</>}
    </div>
  );
}

export default ChatPage;

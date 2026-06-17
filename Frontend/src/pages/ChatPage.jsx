import React from "react";
import NoChatPage from "../components/NoChatPage";
import Middlepanel from "../components/Middlepanel";
import Sidebar from "../components/Sidebar";
import MessagePage from "../components/MessagePage";
import useChatStore from "../store/useChatStore.js";
import requestStore from "../store/requests.store.js";
import Info from '../components/Info.jsx'
import NoticePageRendering from "../components/NoticePageRendering.jsx";
import ContactsPage from "../components/ContactPage.jsx";
import groupStore from "../store/group.store.js";

function ChatPage() {
  const { selectedUser,selectedTab } = useChatStore();
const {infoAbout,setInfoAbout}=requestStore()
const {selectedGroup}=groupStore()
  return (
    <div className="flex flex-row  h-full  w-full">
      <Sidebar />

      {selectedTab==='Activity'?<NoticePageRendering/> :<Middlepanel />}
      {infoAbout ?
      (<Info/> ):
        selectedTab!=='Contacts'  ? 
            // (selectedTab==='Contacts' ? <ContactsPage/> :<NoChatPage /> )
            (!selectedUser ? 
              (!selectedGroup ? <NoChatPage/> :<MessagePage/>)
              :<MessagePage /> )
             :( <ContactsPage />
      )}
      
      
    </div>
  );
}

export default ChatPage;

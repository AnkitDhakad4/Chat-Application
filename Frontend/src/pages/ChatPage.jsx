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
import CreateGroup from "../components/CreateGroup.jsx";
// import {requestNotificationPermission} from '../components/UserProfile.jsx'

function ChatPage() {
  const { selectedUser,selectedTab,subscribeMessage,unSubscribeMessage,setSelectedUser } = useChatStore();
  
const {infoAbout,setInfoAbout}=requestStore()
const {selectedGroup,oneGroupIscreated,subscribeForGroupMessage,unsubscribeForGroupMessage}=groupStore()

 React.useEffect(()=>{
      
      subscribeMessage()
      subscribeForGroupMessage()
  
    return ()=>{
      unSubscribeMessage();
      unsubscribeForGroupMessage();
    }
  },[subscribeMessage,unSubscribeMessage,subscribeForGroupMessage,unsubscribeForGroupMessage,selectedGroup])

  



const renderMainContent = () => {
 
  if (infoAbout) return <Info />;

 

  if(selectedTab==='Groups' && !selectedGroup) 
    {
      
        return !oneGroupIscreated? <NoChatPage isGroupSelected={true}/>:<CreateGroup/>
      
    }

  
  if (selectedUser || selectedGroup) return <MessagePage />;

  
  return <NoChatPage />;
};
  return (
    <div className=" relative flex flex-row  h-full  w-full">
      <Sidebar />

      {selectedTab==='Activity'?<NoticePageRendering/> :<Middlepanel />}
   
       {renderMainContent()}
      
      
    </div>
  );
}

export default ChatPage;

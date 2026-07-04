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
  // 1. Check Info first
  if (infoAbout) return <Info />;

  // 2. Check Contacts tab next
  if (selectedTab === 'Contacts') return <ContactsPage />;

  if(selectedTab==='Groups' && !selectedGroup) 
    {
      
        return !oneGroupIscreated? <NoChatPage isGroupSelected={true}/>:<CreateGroup/>
      
    }

  // 3. Check if an active conversation exists
  // (Using ?.id or whatever key verifies a real group/user object exists)
  if (selectedUser || selectedGroup) return <MessagePage />;

  // 4. Default fallback when everything else is empty/null
  return <NoChatPage />;
};
  return (
    <div className=" relative flex flex-row  h-full  w-full">
      <Sidebar />

      {selectedTab==='Activity'?<NoticePageRendering/> :<Middlepanel />}
      {/* {infoAbout ?
      (<Info/> ):
        selectedTab!=='Contacts'  ? 
            // (selectedTab==='Contacts' ? <ContactsPage/> :<NoChatPage /> )
            (!selectedUser ? 
              (!selectedGroup ? <NoChatPage/> :<MessagePage/>)
              :<MessagePage /> )
             :( <ContactsPage />
      )}
       */}
       {renderMainContent()}
      
      
    </div>
  );
}

export default ChatPage;

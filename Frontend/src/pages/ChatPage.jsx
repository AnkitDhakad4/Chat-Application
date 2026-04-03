import React from "react";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ActiveTabSelector from "../components/ActiveTabSelector";
import ProfileHeader from "../components/ProfileHeader";
import useChatStore from '../store/useChatStore.js';
import ChatList from "../components/ChatList.jsx";
import ContactList from "../components/ContactList.jsx";
import StartConversesionContainer from "../components/StartConversesionContainer.jsx";
import MessageContainer from "../components/MessageContainer.jsx";
import GroupList from "../components/GroupList.jsx";

function ChatPage() {
  const tabList={
  chats: <ChatList />,
  groups: <GroupList />,
  contacts: <ContactList />,
  }
  const {selectedTab,selectedUser}=useChatStore()
  return (
    <div className="relative h-full w-full flex justify-center items-center  ring-white  p-2">
      <BorderAnimatedContainer>
        <div className="flex flex-row h-[35em] w-[60em] ring-1 gap-1 ring-white p-2">
          {/* left column */}
          <div className="ring-white h-full ring-1 flex flex-col ">
          <ProfileHeader/>
          <ActiveTabSelector/>

          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2">
          {tabList[selectedTab]}
          </div>
          </div>
          {/* RIght Column */}
          <div className="flex-1 ring-1 ring-white">
          {selectedUser ? <MessageContainer/> : <StartConversesionContainer/>}
          </div>
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}

export default ChatPage;

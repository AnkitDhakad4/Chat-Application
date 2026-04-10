import React, { useEffect, useRef } from "react";
import useChatStore from "../store/useChatStore.js";
import Loading from "./Loading";
import Chatheader from "./Chatheader.jsx";
import StartConversation from "./StartConversation.jsx";
import MessageInput from "./MessageInput.jsx";

function MessageContainer() {
  const { messages, getMessages, selectedUser, isMessageLoading,subscribeMessage,unSubscribeMessage,sendMessage } =
    useChatStore();
const scrollRef=useRef()
     useEffect(()=>{
    // console.log(scrollRef)
    if(scrollRef.current){
      scrollRef.current.scrollIntoView({behavior:"smooth"})
    }
  },[messages])

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeMessage()

    return ()=>{
      unSubscribeMessage()
    }

  }, [selectedUser,subscribeMessage,unSubscribeMessage]);
  

  if (isMessageLoading) return <Loading />;

  return (
    <div className="w-full  flex flex-col ring-white ring-1 h-full">
      <Chatheader />
<div className="w-full h-full px-2 overflow-y-auto ">
        {messages.length > 0 ? (
          <div className="space-y-6 w-full mx-auto">
            {messages.map((message) => {
              return (
                <div
                  key={message._id}
                  className={`chat ${message.senderId 
                !== selectedUser._id ? "chat-end" : "chat-start"}`}
                >
                  <div
                    className={`chat flex flex-col items-end chat-bubble ${message.senderId === selectedUser._id ? "bg-gray-700/40 " : "bg-cyan-400/40"}`}
                  >
                    {message.image && (
                      <img src={message.image}
                      className="h-40 w-60 object-fit"
                      alt="Image is not loaded" />
                    )}
                    <p>{message.text}</p>
                    <p className="text-xs  ">
                      
                      {new Date(message.createdAt).toLocaleTimeString(
                        "en",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
            
          </div>
        ) : (
          <StartConversation name={selectedUser.name} />
        )}

         

 
    <div ref={scrollRef}></div>
      </div>
      <MessageInput/>
    </div>
  );
}

export default MessageContainer;

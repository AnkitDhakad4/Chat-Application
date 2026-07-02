
import useChatStore from "../store/useChatStore";
import authStore from "../store/userAuth.store";
import { useState, useRef, useEffect } from "react";
import {
  Video,
  Info,
  Phone,
  EllipsisVertical,
  CheckCheck,
  Check,
  SendHorizontal,
  Image,
  Loader2Icon,
  ChevronLeft,
  XIcon
} from "lucide-react";

import DayShow from "./DayShow";
import toast from "react-hot-toast";
import requestStore from "../store/requests.store.js";
import GroupProfileView from "./GroupProfileView.jsx";
import groupStore from "../store/group.store.js";
// import Info from "./Info.jsx";




function SendMessageInGroup({msg}) {
    

    const time=new Date(msg.createdAt).toLocaleTimeString('en-IN',{
        hour:'2-digit',
        minute:'2-digit',
        hour12:true,
        
    }).toUpperCase()

    const [fullPreview, setFullPreview] = useState(false)
    
  return (
  <div className="flex flex-col items-end w-full px-4" key={msg._id}>
    
    <div className="relative h-fit max-w-[70%] sm:max-w-[50%] border-2 border-[#FF2D78]/20 bg-[#FF2D78]/10 text-[#111827] p-2 shadow-sm rounded-xl rounded-tr-none">
      
     
      {msg.image && (
        <div className="w-full overflow-hidden rounded-lg mb-1.5 border border-[#FF2D78]/10 bg-black/5">
          <img
            src={msg.image}
            role="button"
            onClick={() => setFullPreview(true)}
            tabIndex="0"
            alt="Attachment not available!"
            className="object-cover max-h-64 w-full hover:opacity-95 transition-opacity cursor-pointer"
          />
        </div>
      )}

  
      <div className="text-[14.5px] leading-5 flex flex-col whitespace-pre-wrap wrap-break-words    text-[#111827]">
        {msg.text}
        
        <p className="text-end bottom-1 right-2 text-[10px] text-[#6B7280] select-none font-normal">
          {time}
        </p>
      </div>
    </div>


    {fullPreview && (
      <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/90 h-full w-full">
        <img src={msg.image} className="max-h-full max-w-full object-contain p-5" alt="Preview" />
        <button
          className="text-white absolute right-5 top-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
          onClick={() => setFullPreview(false)}
        >
          <XIcon className="size-5" />
        </button>
      </div>
    )}
  </div>
);
}


function RecievedMessageInGroup({msg}) {
    
const time = new Date(msg.createdAt)
    .toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();

  const [fullPreview, setFullPreview] = useState(false);

  return (
  <div className="flex items-start gap-2 w-full mb-2 px-4" key={msg._id}>
    {/* 1. Left Side: Avatar */}
    <img 
      src={msg.senderId?.profilePic || './avatar.png'} 
      alt={msg.senderId?.name } 
      className="w-7 h-7 rounded-full object-cover border border-[#E5E7EB] flex-shrink-0 mt-0.5"
    />

    {/* Main Bubble Wrapper */}
    <div className="flex flex-col max-w-[75%] sm:max-w-[55%] h-fit">
      
      {/* 2. Consolidated Message Bubble */}
      <div className={`relative h-fit border-2 border-[#E5E7EB] bg-[#F3F4F6] text-[#111827] p-2 shadow-sm rounded-xl rounded-tl-none`}>
        
        {/* User Name Header (Matches orange/peach color logic from image_6c487b.png) */}
        <div className="text-xs underline  font-semibold text-[#ff2d78] mb-1 truncate px-1">
          {msg.senderId?.name}
        </div>
        
        {/* Image Attachment (Inside the bubble context) */}
        {msg.image && (
          <div className="w-full overflow-hidden rounded-lg mb-1.5 border border-[#E5E7EB] bg-black/5">
            <img
              src={msg.image}
              role="button"
              onClick={() => setFullPreview(true)}
              tabIndex="0"
              alt="Attachment"
              className="object-cover max-h-64 w-full hover:opacity-95 transition-opacity cursor-pointer"
            />
          </div>
        )}

        {/* Message Text & Inline Time Content Container */}
        <div className="text-[14.5px] leading-5 flex flex-col whitespace-pre-wrap wrap-break-words    text-[#111827]">
        {msg.text}
        
        <p className="text-end   text-[10px] text-[#6B7280]  font-normal">
          {time}
        </p>
      </div>
      </div>

      {/* Full Screen Image Preview Modal */}
      {fullPreview && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/90 h-full w-full">
          <img src={msg.image} className="max-h-full max-w-full object-contain p-5" alt="Preview" />
          <button
            className="text-white absolute right-5 top-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
            onClick={() => setFullPreview(false)}
          >
            <XIcon className="size-5" />
          </button>
        </div>
      )}
    </div>
  </div>
);
}


function MessagePageGroup() {
    const {selectedGroup,setSelectedGroup,isGroupMessageLoading,groupsMessages,sendMessageInGroup,getGroupMessages,subscribeForGroupMessage,unsubscribeForGroupMessage}=groupStore()
     const grpMessages = groupsMessages[selectedGroup?._id]

    const {isImageUploading,getTokenForUpload,uploadOnCloudinary}=useChatStore()

     const {infoAbout,setInfoAbout}=requestStore()
    useEffect(()=>{
        if(selectedGroup)
        {
            async function getMessages() {
            try {
                await getGroupMessages(selectedGroup._id)
            } catch (error) {
                console.log(error)
            }
        }

        getMessages()
        }
    },[selectedGroup?._id,getGroupMessages])

    useEffect(()=>{
      if(selectedGroup)
        subscribeForGroupMessage()

      return ()=>{
        unsubscribeForGroupMessage()
      }
    },[selectedGroup])

    
     const [messageText, setMessageText] = useState("");
    const handleChange = (e) => {
      setMessageText(e.target.value);
    };

    const inputFileRef = useRef(null);
    const [inputImage, setInputImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null)
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // console.log(file);
        setInputImage(file);
        const prv=URL.createObjectURL(file)
        setImagePreview(prv)
      }
    };

    const handleSubmitForGroup = async (e) => {
    e.preventDefault();

    
    let url="";
    if (inputImage) {
      const tokens=await getTokenForUpload('groupMessages')
      console.log(tokens)
      // const {timestamp,signature,apiKey}=await getTokenForUpload('profilePics')
      const formData=new FormData();
      formData.append('api_key',tokens.apiKey)
      formData.append('signature',tokens.signature)
      formData.append('timestamp',tokens.timestamp)
      formData.append('folder','groupMessages')
      formData.append('file',inputImage)
     
      
      const data=await uploadOnCloudinary(formData)
      url=data.secure_url
    }

    if(messageText.trim().length===0 && !inputImage)
    {
      toast.error("Backchodi nahi mitr!!")
      return;
    }
    
    try {
        console.log("In the send message to group")
      await sendMessageInGroup({text:messageText,groupId:selectedGroup._id,image:url});
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
       setMessageText("");
      setInputImage(null)
      setImagePreview(null)
    }
  };

  const { onlineUsers, user } = authStore();
    const handleMessageRenderingAccordingToTimeInGroup = (messages) => {
    let elements = [];
    for (let i = 0; i < messages?.length; i++) {
      let Day = new Date(messages[i]?.createdAt)?.toISOString().split("T")[0];
      elements.push(<DayShow key={Math.random()} day={Day} />);
      for (; i < messages.length; i++) {
        if (
          new Date(messages[i]?.createdAt)?.toISOString().split("T")[0] === Day
        ) {
          elements.push(showMessageInGroup(messages[i]));
        } else {
          i--;
          break;
        }
      }
    }
    return elements;
  };
  const showMessageInGroup = (msg) => {
  console.log(msg)
    if (msg.senderId._id === user._id || msg.senderId===user._id) {
      {
        /* user is sender */
        return <SendMessageInGroup  msg={msg} />;
      }
    } else {
      {
        /* user is reciever */
        return <RecievedMessageInGroup  msg={msg} />;
      }
    }
  }
const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollViewRef.current?.scrollIntoView();
  }, [grpMessages]);

  
    return (
      <div className="relative flex flex-col h-full flex-1 border-y border-r border-[#E2E8F0]">
        {/* upper section */}
        <div className="flex h-1/10 border-b border-[#E2E8F0]">
          <ChevronLeft 
            onClick={() => { setSelectedGroup(null) }}
            className="self-center size-9 text-[#6B7280] hover:text-[#FF2D78] hover:cursor-pointer"
          />
          <GroupProfileView
            group={selectedGroup}
            upper={true}
            outsideClass="hover:cursor-pointer w-1/2 pl-2 p-1 flex items-center gap-1"
          />
          <div className="flex-1 flex justify-end items-center gap-5">
            <Info 
              onClick={() => { setInfoAbout('Group') }}
              className="size-7 text-[#6B7280] hover:text-[#FF2D78] hover:cursor-pointer" 
            />
            <EllipsisVertical className="mx-2 size-6 text-[#6B7280] hover:text-[#FF2D78] hover:cursor-pointer" />
          </div>
        </div>

        {/* main message section */}
        <div className="h-80/100 w-full">
          <div className="h-full w-full overflow-y-scroll scrollbar  flex gap-2 flex-col  ">
            {false ? (
              <div className='flex items-center justify-center p-2 gap-2'>
                <Loader2Icon className="size-4.5 animate-spin" /> 
                <p className="font-inter">Loading...</p>
              </div>
            ) : (
              handleMessageRenderingAccordingToTimeInGroup(grpMessages)
              
            )}
            <div className="w-0 h-0" ref={scrollViewRef}></div>
          </div>
        </div>

        {/* message input */}
        <div className="absolute bottom-0 w-full py-2 px-8 bg-white rounded-t-2xl flex flex-col gap-2 items-start shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      
      {/* Conditionally rendered preview section: Shows ONLY if an image preview URL exists */}
      {imagePreview && (
        <div className="flex items-center pl-2">
          <div className="relative mt-2 group">
            {/* Cancel Button - clears the preview state and resets the native file input element */}
            <XIcon 
              onClick={() => {
                setImagePreview(null);
                setInputImage(null);
                if (inputFileRef.current) inputFileRef.current.value = ""; // Clear file selector memory
              }}
              className="absolute -top-1.5 -right-1.5 size-5 bg-white border border-gray-300 shadow-sm p-0.5 text-gray-600 hover:text-red-500 hover:cursor-pointer rounded-full transition-transform hover:scale-110 z-10"
            />
            {/* Responsive visual container for the user's selected photo */}
            <img 
              src={imagePreview} 
              alt="Upload preview"
              className="size-20 object-cover rounded-xl border border-gray-200 shadow-sm"
            />
            {isImageUploading && <Loader2Icon className="absolute top-7.5 right-7.5 text-gray-700 animate-spin"/>}

          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmitForGroup} className="w-full flex justify-evenly items-center">
        <input
          type="text"
          className="border-[#E5E7EB] border-2 bg-[#F9FAFB] p-2 w-4/5 rounded-2xl"
          placeholder="send message"
          onChange={handleChange}
          value={messageText}
        />
        <button type="button" onClick={() => inputFileRef.current.click()}>
          <Image className="size-9 hover:cursor-pointer text-[#6B7280] hover:text-[#FF2D78] transition-colors" />
          <input
            className="hidden"
            type="file"
            accept="image/*"
            ref={inputFileRef}
            onChange={handleFileChange}
          />
        </button>
        <button 
        disabled={isImageUploading}
        type="submit" className="hover:cursor-pointer">
          <SendHorizontal className="size-9 p-0.5 flex justify-center items-center rung rounded-lg bg-[#FF2D78] text-[#FFFFFF]" />
        </button>
      </form>
    </div>
      </div>
    );
  
}

export default MessagePageGroup
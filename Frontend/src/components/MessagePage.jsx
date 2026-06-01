
import ProfileHeader from "./profileHeader";
import useChatStore from "../store/useChatStore";
import authStore from "../store/userAuth.store";
import { useState,useRef,useEffect } from "react";
import {
  Video,
  Phone,
  EllipsisVertical,
  CheckCheck,
  Check,
  SendHorizontal,
  Image,
} from "lucide-react";
import RecievedMessage from "./RecievedMessage";
import SendMessage from "./SendMessage";
import DayShow from "./DayShow";

function MessagePage() {
  const { selectedUser,messages,sendMessage,getMessages } = useChatStore();
  const { onlineUsers, user } = authStore();

  

//   const messages = [
//   // --- Day 1: May 30 (Initial UI Review) ---
//   {
//     _id: "6658a123e4b0c12345678901",
//     senderId: 1,
//     recieverId: 2,
//     text: "Hey! Did you get a chance to look at the new UI design?",
//     image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop", // Portrait UI Concept
//     createdAt: "2026-05-30T10:14:00.000Z",
//     updatedAt: "2026-05-30T10:14:00.000Z",
//   },
//   {
//     _id: "6658a156e4b0c12345678902",
//     senderId: 2,
//     recieverId: 1,
//     text: "Yeah, I just opened it up. The pink accents look really clean!",
//     image: "https://images.unsplash.com/photo-1614036417651-ebe5e12851df?q=80&w=500&h=500&auto=format&fit=crop", // Square Pink Abstract
//     createdAt: "2026-05-30T10:15:30.000Z",
//     updatedAt: "2026-05-30T10:15:30.000Z",
//   },
//   {
//     _id: "6658a189e4b0c12345678903",
//     senderId: 2,
//     recieverId: 1,
//     text: "Check out this screenshot of how the layout looks on my screen.",
//     image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1200&h=600&auto=format&fit=crop", // Wide Landscape Desktop
//     createdAt: "2026-05-30T10:16:00.000Z",
//     updatedAt: "2026-05-30T10:16:00.000Z",
//   },
//   {
//     _id: "6658a1bce4b0c12345678904",
//     senderId: 1,
//     recieverId: 2,
//     text: "Oh wow, that looks perfect. The alignment is spot on now.",
//     image: "https://images.unsplash.com/photo-1551288049-bbbda546697c?q=80&w=600&h=800&auto=format&fit=crop", // Vertical Data Viz
//     createdAt: "2026-05-30T10:17:15.000Z",
//     updatedAt: "2026-05-30T10:17:15.000Z",
//   },
//   {
//     _id: "6658a1efe4b0c12345678905",
//     senderId: 2,
//     recieverId: 1,
//     text: "Awesome! Let's lock this in and review it with the developers tomorrow.",
//     image: "https://images.unsplash.com/photo-1522071823991-b9671f9d7f1f?q=80&w=1000&h=400&auto=format&fit=crop", // Narrow Banner
//     createdAt: "2026-05-30T10:25:00.000Z",
//     updatedAt: "2026-05-30T10:25:00.000Z",
//   },

//   // --- Day 2: May 31 (Developer Feedback) ---
//   {
//     _id: "6658a222e4b0c12345678906",
//     senderId: 1,
//     recieverId: 2,
//     text: "Hey, dev team said the layout is feasible, but they want an asset export for the icons.",
//     image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&h=800&auto=format&fit=crop", // Square Icon Mesh
//     createdAt: "2026-05-31T14:30:00.000Z",
//     updatedAt: "2026-05-31T14:30:00.000Z",
//   },
//   {
//     _id: "6658a255e4b0c12345678907",
//     senderId: 2,
//     recieverId: 1,
//     text: "No problem. Just uploaded the entire icon pack folder to the shared drive.",
//     image: "https://images.unsplash.com/photo-1544391682-17ef3692d184?q=80&w=1200&h=500&auto=format&fit=crop", // Files/Folder Abstract
//     createdAt: "2026-05-31T14:45:12.000Z",
//     updatedAt: "2026-05-31T14:45:12.000Z",
//   },
//   {
//     _id: "6658a288e4b0c12345678908",
//     senderId: 1,
//     recieverId: 2,
//     text: "Got it, downloading them now. Thanks for the quick turnaround!",
//     image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?q=80&w=400&h=400&auto=format&fit=crop", // Small Square Success
//     createdAt: "2026-05-31T15:02:40.000Z",
//     updatedAt: "2026-05-31T15:02:40.000Z",
//   },

//   // --- Day 3: June 01 (Staging Environment Launch) ---
//   {
//     _id: "6658a2bbe4b0c12345678909",
//     senderId: 2,
//     recieverId: 1,
//     text: "The staging link is live! Check out the interactive prototype with the real backend.",
//     image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&h=600&auto=format&fit=crop", // Tech Dashboard
//     createdAt: "2026-06-01T09:00:00.000Z",
//     updatedAt: "2026-06-01T09:00:00.000Z",
//   },
//   {
//     _id: "6658a2eee4b0c12345678910",
//     senderId: 1,
//     recieverId: 2,
//     text: "Holy cow, the transitions feel incredibly smooth. Great work team!",
//     image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&h=1200&auto=format&fit=crop", // Vertical Motion Concept
//     createdAt: "2026-06-01T09:12:18.000Z",
//     updatedAt: "2026-06-01T09:12:18.000Z",
//   },

//   // --- Day 4: June 02 (Bug Hunting & Assets) ---
//   {
//     _id: "6658a31fe4b0c12345678911",
//     senderId: 1,
//     recieverId: 2,
//     text: "Wait, found a tiny bug on mobile. The hero section image is stretching awkwardly.",
//     image: "https://images.unsplash.com/photo-1525733225354-91fc498a9643?q=80&w=500&h=1000&auto=format&fit=crop", // Long Mobile Screen Bug
//     createdAt: "2026-06-02T11:05:00.000Z",
//     updatedAt: "2026-06-02T11:05:00.000Z",
//   },
//   {
//     _id: "6658a352e4b0c12345678912",
//     senderId: 2,
//     recieverId: 1,
//     text: "Ah, they forgot to add object-cover to that image tag. I will ping them to fix it.",
//     image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=900&h=450&auto=format&fit=crop", // Code Snippet View
//     createdAt: "2026-06-02T11:18:45.000Z",
//     updatedAt: "2026-06-02T11:18:45.000Z",
//   },
//   {
//     _id: "6658a385e4b0c12345678913",
//     senderId: 2,
//     recieverId: 1,
//     text: "By the way, did we finalize the default placeholder avatar for empty user profiles?",
//     image: "https://images.unsplash.com/photo-1531771686035-25f2750e5c83?q=80&w=600&h=600&auto=format&fit=crop", // Square Avatar Placeholder
//     createdAt: "2026-06-02T16:40:00.000Z",
//     updatedAt: "2026-06-02T16:40:00.000Z",
//   },
//   {
//     _id: "6658a3b8e4b0c12345678914",
//     senderId: 1,
//     recieverId: 2,
//     text: "Yes, we chose this minimalist geometric pattern vector. Check it out.",
//     image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&h=1000&auto=format&fit=crop", // Vertical Abstract Pattern
//     createdAt: "2026-06-02T16:55:22.000Z",
//     updatedAt: "2026-06-02T16:55:22.000Z",
//   },

//   // --- Day 5: June 03 (Content & Marketing Prep) ---
//   {
//     _id: "6658a3ebe4b0c12345678915",
//     senderId: 2,
//     recieverId: 1,
//     text: "Perfect, that asset looks very clean. Let's use it.",
//     image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&h=400&auto=format&fit=crop", // Wide Hero Crop
//     createdAt: "2026-06-03T10:00:00.000Z",
//     updatedAt: "2026-06-03T10:00:00.000Z",
//   },
//   {
//     _id: "6658a41ee4b0c12345678916",
//     senderId: 1,
//     recieverId: 2,
//     text: "Marketing wants a high-res cover banner for the launch blog post. Any ideas?",
//     image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=700&h=900&auto=format&fit=crop", // High-Res Abstract Portrait
//     createdAt: "2026-06-03T13:12:00.000Z",
//     updatedAt: "2026-06-03T13:12:00.000Z",
//   },
//   {
//     _id: "6658a451e4b0c12345678917",
//     senderId: 2,
//     recieverId: 1,
//     text: "What about something abstract that highlights our new workspace setup vibes?",
//     image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=1200&h=800&auto=format&fit=crop", // Standard 3:2 Workspace
//     createdAt: "2026-06-03T13:45:10.000Z",
//     updatedAt: "2026-06-03T13:45:10.000Z",
//   },

//   // --- Day 6: June 04 (Final Launch Day Approvals) ---
//   {
//     _id: "6658a484e4b0c12345678918",
//     senderId: 1,
//     recieverId: 2,
//     text: "That option looks stunning. Sending it straight to marketing now.",
//     image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1000&h=500&auto=format&fit=crop", // Marketing Banner
//     createdAt: "2026-06-04T08:50:00.000Z",
//     updatedAt: "2026-06-04T08:50:00.000Z",
//   },
//   {
//     _id: "6658a4b7e4b0c12345678919",
//     senderId: 2,
//     recieverId: 1,
//     text: "Awesome. Mobile stretching layout bug is also deployed and completely fixed.",
//     image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&h=400&auto=format&fit=crop", // Code Success Banner
//     createdAt: "2026-06-04T09:15:00.000Z",
//     updatedAt: "2026-06-04T09:15:00.000Z",
//   },
//   {
//     _id: "6658a4eae4b0c12345678920",
//     senderId: 1,
//     recieverId: 2,
//     text: "Incredible work! We are fully green-lit for production. Let's merge it! 🚀",
//     image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&h=800&auto=format&fit=crop", // Celebration Square
//     createdAt: "2026-06-04T09:30:15.000Z",
//     updatedAt: "2026-06-04T09:30:15.000Z",
//   }
// ];

  const handleMessageRenderingAccordingToTime = (messages) => {
    let elements = [];
    for (let i = 0; i < messages.length; i++) {
      let Day = new Date(messages[i].createdAt).toISOString().split("T")[0];
      elements.push(<DayShow key={Math.random()} day={Day} />);
      for (; i < messages.length; i++) {
        if (
          new Date(messages[i].createdAt).toISOString().split("T")[0] === Day
        ) {
          elements.push(showMessage(messages[i]));
        } else {
          break;
        }
      }
    }
    return elements;
  };

  const showMessage = (msg) => {
    if (msg.senderId === user._id) {
      {
        /* user is sender */
      }
      return <SendMessage key={msg._id} msg={msg} />;
    } else {
      {
        /* user is reciever */
      }
      return <RecievedMessage key={msg._id} msg={msg} />;
    }
  };

  const [messageText, setMessageText] = useState("");
  const handleChange = (e) => {
    setMessageText(e.target.value);
  };


  const [inputImage, setInputImage] = useState(null)
  const inputFileRef=useRef(null)

  const handleFileChange=(e)=>{
    const file=e.target.files[0]
    if(file)
      {
        console.log(file)
        setInputImage(file)
      }

  }
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData=new FormData()
    formData.append('text',messageText)
    formData.append('image',inputImage)


    // for(let[key,value] of formData.entries())
    // {
    //   console.log(`${key}: ${value}`)
    // }

    // TODO: send message functionality
    setMessageText("");
  };

  const scrollViewRef=useRef(null)

  useEffect(()=>{
    scrollViewRef.current?.scrollIntoView()
  },[messages])



  return (
    <div className=" flex flex-col h-full flex-1 border-y border-r border-[#E2E8F0]   ">
      {/* upper section */}
      <div className="flex h-1/10  border-b border-[#E2E8F0]   ">
        <ProfileHeader
          upper={true}
          onlineUsers={onlineUsers}
          user={selectedUser}
          outsideClass="hover:cursor-pointer  w-1/2 pl-2   p-1  flex items-center gap-1 "
        />

        <div className=" flex-1 flex justify-end items-center gap-5">
          <Video className="size-7 text-[#6B7280]" />
          <Phone className="size-6 text-[#6B7280]" />
          <EllipsisVertical className="size-6 text-[#6B7280]" />
        </div>
      </div>

      {/* main message section here we can see the chats */}
      {/* bg-[url('/ChatBG.jpg')]    */}
      <div className="h-80/100 w-full ">
        <div className="h-full w-full overflow-y-scroll scrollbar rung flex gap-2 flex-col  p-4  ">
          {handleMessageRenderingAccordingToTime(messages)}
        <div className="w-0 h-0" ref={scrollViewRef}></div>
        </div>
      </div>

        {/* message input */}
      <div className="px-8 rung h-10/100 flex-1  flex items-center justify-evenly ">
        <form
          action="submit"
          // onSubmit={handleSubmit}
          className="w-full flex justify-evenly items-center"
        >
          <input
            type="text"
            className="border-[#E5E7EB] border-2 bg-[#F9FAFB] p-2 w-4/5 rounded-2xl"
            placeholder="send message"
            onChange={handleChange}
            value={messageText}
          />

          <button type="button" onClick={()=>inputFileRef.current.click()}>
            <Image className="size-9 hover:cursor-pointer"  />
            <input className="hidden" type="file" accept="image/*" ref={inputFileRef} onChange={handleFileChange}/>
          </button>
          <button onClick={handleSubmit} className="hover:cursor-pointer">
            <SendHorizontal className="size-9 p-0.5 flex justify-center items-center rung rounded-lg bg-[#FF2D78] text-[#FFFFFF]" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default MessagePage;

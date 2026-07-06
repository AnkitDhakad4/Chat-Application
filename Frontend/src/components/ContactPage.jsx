import { UserPlus, Clock } from "lucide-react";
import requestStore from "../store/requests.store.js";
import toast from "react-hot-toast";
import useChatStore from "../store/useChatStore.js";
import { useEffect } from "react";
import { useLayoutEffect } from "react";
import { useState } from "react";
import authStore from "../store/userAuth.store.js";
import groupStore from "../store/group.store.js";
import { VolumeX,Volume2,Search,LoaderCircle} from "lucide-react";



function ContactProfileCard({ item, isRequested }) {
  const { sentMessageRequest,sentRequests } = requestStore();
  const [justNow, setJustNow] = useState(false);

  const handleSendRequest = async (targetUserId) => {
    try {
      await sentMessageRequest(targetUserId);
    } catch (error) {
      console.error("Failed to send request:", error);
    }
  };

  const hasRequested = sentRequests.has(item._id);

  return (
    <div 
    key={item._id}
    className=" h-12/100  p-1 flex items-center gap-2 w-full">
      
      {/* Left Column: Avatar + Profile Core Identity Details */}
      <div className="flex items-center gap-0.5 flex-1 min-w-0">
        <div className="relative flex-shrink-0">
          <img
            className="p-0.5     object-cover size-16 rounded-full "
            src={item.profilePic || "./avatar.png"}
            alt={item.name}
          />
        </div>
        
        <div className="flex flex-col truncate  flex-1">
          <p className="font-liberation text-[#0F172A] text-lg font-bold">
            {item.name}
          </p>
          <p className="font-liberation truncate max-w-full text-xs text-gray-500 ">
            {item.about } 
          </p>
        </div>
      </div>

      {/* Right Column: Context Action Trigger Toggle Button */}
      <div className="flex-shrink-0 pl-1">
        {hasRequested ? (
          <span className="flex items-center gap-1 bg-[#F1F5F9] text-[#64748B] text-xs font-medium px-2.5 py-1 rounded-full border border-[#CBD5E1] whitespace-nowrap select-none">
            <Clock className="size-3" />
            Requested
          </span>
        ) : (
          <button
            onClick={() => {
              handleSendRequest(item._id);
              setJustNow(true);
            }}
            className="bg-[#FF2D78] hover:bg-[#E02467] text-white font-semibold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all duration-150 cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
          >
            <UserPlus className="size-3" />
            Connect
          </button>
        )}
      </div>

    </div>
  );
}

function ContactsPage() {
  
  const {isSoundOn,selectedTab,isUsersLoading,contacts,getContacts} =useChatStore()
  const {getSentRequests}=requestStore()
  
  const [filteredContacts, setFilteredContacts] = useState([])

  useEffect(()=>{
    async function fetchContacts() {
      await getContacts();
      await getSentRequests()
    }

    fetchContacts();
    
    setFilteredContacts(contacts)
  }, [getContacts,selectedTab])


  const [searchVal, setSearchVal] = useState("")
  const handleChange = (e) => {
    
     if(e.target.value=="")
    {
      setSearchVal("")
      setFilteredContacts(contacts)
    }
    else{
      const searchVal=e.target.value;
      const filtered=contacts.filter((cnt)=>(cnt.name.toLowerCase().startsWith(searchVal.toLowerCase())))
      setFilteredContacts(filtered)
      setSearchVal(searchVal)
    }
  };
  // const handleBell=()=>{

  // }
  return (
    <div className=" border border-[#E2E8F0] box-border  h-full w-27/100 flex flex-col ">
       <div className=" border-b border-[#E2E8F0] h-1/10 flex">
         <div className="flex justify-center w-fit mx-4 truncate  items-center h-full font-liberation text-[#1d2947] font-bold text-2xl">
           <p>{selectedTab}</p>
         </div>
         <div className=" flex items-center justify-evenly grow ">
           <input
             type="text"
             className="border-slate-200 flex-1 mr-4 focus:ring-blue-500 text-gray-900 bg-gray-100 p-2 rounded-2xl h-1/2"
             placeholder="search here..."
             onChange={handleChange}
              value={searchVal}
       
           />
           {/* <button onClick={handleSearch}>
             <Search className="size-5 text-[#64748B] cursor-pointer" />
           </button>
           {isSoundOn ? (
             <button onClick={handleBell}>
               <Volume2 className="size-5  text-[#64748B] cursor-pointer" />
             </button>
           ) : (
             <button onClick={handleBell}>
               <VolumeX className="size-5  text-[#64748B] cursor-pointer" />
             </button>
           )
           } */}
         </div>
       </div>
       
  
       <div className="flex-1 flex flex-col gap-1  p-2 w-full overflow-auto scrollbar ">
         
         {isUsersLoading ? (
           <div className="flex items-center justify-center gap-3">
             {" "}
             <p className="font-inter ">Loading...</p>{" "}
             <LoaderCircle className="animate-spin size-4" />{" "}
           </div>
         ) : (
           filteredContacts.map((user) => (
             <ContactProfileCard 
             key={user._id}
             item={user} isRequested={false} />
           ))
         )}
   
       </div>
     </div>
  );
}

export default ContactsPage;

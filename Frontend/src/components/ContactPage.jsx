import { UserPlus, Clock } from "lucide-react";
import requestStore from "../store/requests.store.js";
import toast from "react-hot-toast";
import useChatStore from "../store/useChatStore.js";
import { useEffect } from "react";
import { useLayoutEffect } from "react";

function ContactsPage() {
  const {
    sendChatRequest,
    pendingRequests,
    allPlatformUser,
    sentRequests,
    sentMessageRequest,
    getSentRequests,
  } = requestStore();

  // Helper utility tracking if we already sent an invitation to this specific user
  const { getContacts, contacts } = useChatStore();
  const checkRequestStatus = (targetUserId) => {
    const resp = sentRequests.some((rqs) => rqs.receiverId === targetUserId);

    return resp;
  };

  useLayoutEffect(() => {
    async function getReqs() {
      try {
        await getSentRequests();
      } catch (error) {
        console.error("error while getting the requests", error);
      }
    }

    getReqs();
  }, [getSentRequests]);

  const handleSendRequest = async (targetUserId) => {
    await sentMessageRequest(targetUserId);
  };

  return (
    <div className="flex flex-col h-full flex-1 border-y border-r border-[#E2E8F0] bg-white">
      {/* Upper Section Header Banner */}
      <div className="flex h-1/10 border-b border-[#E2E8F0] items-center px-6">
        <h2 className="text-xl font-bold text-[#0F172A] font-liberation">
          Discover People
        </h2>
      </div>

      {/* Main Grid Canvas Wrapper */}
      <div className="h-90/100 w-full overflow-y-auto scrollbar p-6 bg-[#FAFAFA]">
        <p className="text-lg text-[#71717A] font-inter mb-4 text-center">
          Connect with other users on Chatflow to start messaging them.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts?.length === 0 ? (
            <p className="text-gray-400 text-sm italic col-span-2 text-center mt-6">
              No users available to connect with right now.
            </p>
          ) : (
            contacts?.map((item) => {
              const isRequested = checkRequestStatus(item._id);

              return (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {/* Left Column Profile Core Identity details */}
                  <div className="flex items-center gap-3 w-7/10 overflow-hidden">
                    <img
                      className="object-cover size-12 rounded-full border  border-gray-100"
                      src={item.profilePic || "./avatar.png"}
                      alt={item.name}
                    />
                    <div className="flex flex-col truncate">
                      <p className="text-base font-bold text-[#18181B] truncate font-liberation">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#71717A] truncate font-inter mt-0.5">
                        {item.about || "Hey there! I am using Chatflow."}
                      </p>
                    </div>
                  </div>

                  {/* Right Column Context Action Trigger Toggle Switch state */}
                  {isRequested ? (
                    <span className="flex items-center gap-1 bg-[#F1F5F9] text-[#64748B] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#CBD5E1]">
                      <Clock className="size-3.5" /> Requested
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSendRequest(item._id)}
                      className="bg-[#FF2D78] hover:bg-[#E02467] text-white font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1 transition-all duration-200 cursor-pointer shadow-sm"
                    >
                      <UserPlus className="size-3.5" /> Connect
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactsPage;

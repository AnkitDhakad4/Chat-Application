import React, { useState } from "react";
import { XIcon } from "lucide-react";

function RecievedMessage({ msg }) {
  // Safety check: If there is no text AND no image, don't render anything at all
  if (!msg.text && !msg.image) return null;

  const time = new Date(msg.createdAt)
    .toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();

  const [fullPreview, setFullPreview] = useState(false);

  return (
    <div className="flex flex-col items-start h-fit gap-1" key={msg._id}>
      
      {msg.image && (
        /* Dynamically matches your borders and increases the size to max-w-[70%] */
        <div className={`max-w-[50%] max-h-[400px] overflow-hidden border-2 border-[#E5E7EB]/80 ${msg.text ? 'rounded-t-xl rounded-r-xl border-b-0' : 'rounded-xl'}`}>
          <img
            src={msg.image}
            role="button"
            onClick={() => setFullPreview(true)}
            tabIndex="0"
            alt="Uploaded content"
            className="object-cover max-h-[400px] w-full hover:brightness-95 transition-all"
          />
        </div>
      )}

      {fullPreview && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/80 h-full">
          <img 
            src={msg.image} 
            className="max-h-full max-w-full object-contain p-5" 
            alt="Preview"
          />
          <button
            className="text-white absolute right-5 top-3 hover:cursor-pointer"
            onClick={() => setFullPreview(false)}
          >
            <XIcon className="size-5" />
          </button>
        </div>
      )}

      {/* Text box hides completeely if empty */}
      {msg.text && (
        <div className="h-fit border-2 border-[#E5E7EB] p-2 max-w-[70%] rounded-b-xl rounded-r-xl text-[#111827] bg-[#F3F4F6] break-words">
          {msg.text}
        </div>
      )}

      <p className="text-[#6B7280] text-xs flex pl-1">{time}</p>
    </div>
  );
}

export default RecievedMessage;
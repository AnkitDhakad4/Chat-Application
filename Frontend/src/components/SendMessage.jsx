import React, { useState } from 'react'
import { Loader2Icon, XIcon } from 'lucide-react'

function SendMessage({msg}) {
    
    // Safety check: If there is no text AND no image, don't render anything at all
    if (!msg.text && !msg.image) return null;

    const time = new Date(msg.createdAt).toLocaleTimeString('en-IN',{
        hour:'2-digit',
        minute:'2-digit',
        hour12:true,
    }).toUpperCase()

    const [fullPreview, setFullPreview] = useState(false)
    
  return (
    <div className='flex flex-col items-end h-fit gap-1' key={msg._id}>
        
        {msg.image && (
          /* Changed max-w-4/10 to max-w-[70%] to make the image significantly larger */
          <div className={`max-w-[50%] max-h-[400px] overflow-hidden border-1 border-[#FF2D78]/20 ${msg.text ? 'rounded-l-xl rounded-t-xl border-b-0' : 'rounded-xl'}`}>
            <img
              onClick={() => setFullPreview(true)} 
              role='button'
              src={msg.image} 
              alt="Uploaded content" 
              className='object-cover max-h-[400px] w-full hover:brightness-95 transition-all'
            />
          </div>
        )}
        
        {fullPreview && (
          <div className='fixed flex justify-center items-center inset-0 z-50 bg-black/80 h-full '>
            <img 
              src={msg.image}
              className='max-h-full max-w-full object-contain p-5'
              alt="Preview"
            />
            <button 
              className='text-white absolute right-5 top-3 hover:cursor-pointer'
              onClick={() => setFullPreview(false)}
            >
              <XIcon className='size-5'/>
            </button>
          </div>
        )}

       {msg.text && (
         /* Matched text width to max-w-[70%] if needed, capped at max-w-1/2 for layout comfort */
         <div className='h-fit border-2 border-[#FF2D78]/20 p-1 max-w-[70%] rounded-b-xl rounded-l-xl text-[#111827] bg-[#FF2D78]/10 break-words'>
           {msg.text}
         </div> 
       )}

       <p className='text-[#6B7280] text-xs flex gap-1 pr-1'>{time} 

        <span>{msg?.isSending ?<Loader2Icon className='size-4'/>:""}</span>
       </p>
       
    </div>
  )
}

export default SendMessage
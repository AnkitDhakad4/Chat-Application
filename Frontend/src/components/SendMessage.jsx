import React from 'react'

function SendMessage({msg}) {
    

    const time=new Date(msg.createdAt).toLocaleTimeString('en-IN',{
        hour:'2-digit',
        minute:'2-digit',
        hour12:true,
        
    }).toUpperCase()
  return (
    <div className='flex flex-col  items-end h-fit '
    key={msg._id}
    >
        {msg.image && <div className=' max-w-4/10 max-h-1/2 overflow-hidden   border-x-2 border-t-2 rounded-t-xl  border-[#FF2D78]/20'>
        <img src={msg.image} alt=" not available!" className=' object-cover h-full w-full  '/>
        </div>}
       <div className='h-fit  border-2 border-[#FF2D78]/20 p-2 max-w-1/2 rounded-b-xl rounded-l-xl text-[#111827]  bg-[#FF2D78]/10'>{msg.text}</div> 
          <p className='text-[#6B7280] text-xs flex  gap-1 pr-1'>{time} 
            {/* <Check className='size-4'/> <CheckCheck className='size-4'/> */}
            </p>
          </div>
  )
}

export default SendMessage
import React from 'react'

function RecievedMessage({msg}) {
    const time=new Date(msg.createdAt).toLocaleTimeString('en-IN',{
        hour:'2-digit',
        minute:'2-digit',
        hour12:true,
        
    }).toUpperCase()
  return (
    <div className='flex flex-col '
        key={msg._id}
    >
        {msg.image && <div className=' max-w-4/10 max-h-1/2 overflow-hidden   border-x-2 border-t-2 rounded-t-xl  border-[#E5E7EB]/80'>
        <img src={msg.image} alt=" not available!" className=' object-cover h-full w-full  '/>
        </div>}
           <div className='h-fit  border-2 border-[#E5E7EB] p-2 max-w-1/2 rounded-b-xl rounded-r-xl text-[#111827]  bg-[#F3F4F6]'>{msg.text}</div> 
          <p className='text-[#6B7280] text-xs flex pl-1 '>{time}</p>
          </div>
  )
}

export default RecievedMessage
import React from 'react'

function NoChatPage() {
  return (
    <div className='h-full   flex flex-1 justify-center items-center bg-[#F8FAFC] border-y border-r border-[#E2E8F0] '>

      <div className='h-7/10 w-6/10  bg-[#FFFFFF] shadow-[10px_10px_20px_rgba(0,0,0,0.1)] rounded-xl flex flex-col '>
      <div className='w-full flex justify-center items-center h-1/2 '>
        <img src="./icons/chat.png" 
        alt="chat icon"
        className='size-30 '
        />
      </div>
      <div className='flex-1  rounded-xl  flex flex-col items-center gap-2 pt-3 '>
        <p className='text-2xl text-center text-[#0F172A]'>Select a chat to start</p>
      <p className=' w-2/4 font-liberation text-xs text-center  text-[#64748B]'>Choose an existing conversation from the
list or start a new thread with your contacts.</p>

      </div>
      </div>

    </div>
  )
}

export default NoChatPage

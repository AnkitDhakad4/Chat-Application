import React, { useState,useEffect } from 'react'
import useChatStore from '../store/useChatStore'

export default function ContactList() {
  const {getContacts,contacts,isUsersLoading,setSelectedUser} =useChatStore()


  useEffect(()=>{
    getContacts()
    
  },[])


  if(isUsersLoading) return(
    <div className='h-[10em] w-full  flex justify-center items-center '>
      <span className='relative top-5 size-10 loading loading-ring loading-xs'></span>
    </div>
  )

  // console.log("Chat parteners :",chatParteners)
  if(contacts.length==0) return (
    <div className='h-[10em] w-full '>
      <span className='font-mono'>Start Chatting with your friends </span>
      <p>Find friends <button className='bg-slate-200/10 rounded-2xl hover:bg-slate-700/40  p-1 '
      onClick={()=>{setSelectedTab('contacts') }}
      >Contacts</button></p>
    </div>
  )
  return (
    <div className=' w-full  flex flex-col gap-2'> 

      {contacts.map((partener)=>{
        
        return (
          <div 
          onClick={()=>{setSelectedUser(partener)}}
          key={partener._id}
          className='hover:cursor-pointer  flex flex-row h-[3.5em] p-1 ring-1 ring-white bg-blue-400/15 rounded-2xl hover:bg-blue-500/15'>
        {/* TODO:avatar online offline */}
       <div className='avatar avatar-online'>
         <img
        className='h-[3em] relative  object-cover '
        src={'/avatar.png' || partener.profilePic} alt="" />
       </div>
       <div className='px-2 flex flex-col'>
        {/* TODO: online offline using socket.io */}
          <h3>{partener.name || 'John Doe'}</h3>
          <p>online...</p>
       </div>
    </div>
        )
      })}

    </div>
  )
}

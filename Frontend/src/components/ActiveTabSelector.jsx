import React, { useEffect, useState } from 'react'
import useChatStore from '../store/useChatStore'

function ActiveTabSelector() {
  const {selectedTab,setSelectedTab}=useChatStore()
  
  const iconClass='tab ring-1 ring-white  hover:cursor-pointer rounded-4xl flex justify-center items-center hover:bg-slate-700 '
  
  const handleClick=(e)=>{
    setSelectedTab(e.target.value)
  }

  useEffect(()=>{
    setSelectedTab(selectedTab)
  },[selectedTab])
  return (
    <div className='tabs tabs-boxed h-9 ring-white flex flex-row justify-around items-center  gap-2 m-2'>
      <button className={`${iconClass} ${selectedTab==='chats'? "bg-blue-500 text-white" :'bg-transparent'}`}
      onClick={handleClick}
      value={'chats'}
      // name='chats'
      >chats</button>
       {/* <button className={`${iconClass} ${selectedTab==='groups'? "bg-blue-500 text-white" :'bg-transparent'}`}
      onClick={handleClick}
      value={'groups'}
      // name='chats'
      >groups</button> */}
       <button className={`${iconClass} ${selectedTab==='contacts'? "bg-blue-500 text-white" :'bg-transparent'}`}
      onClick={handleClick}
      value={'contacts'}
      // name='chats'
      >contacts</button>
    </div>
  )
}

export default ActiveTabSelector
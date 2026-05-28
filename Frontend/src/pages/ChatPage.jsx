import React from 'react'
import ContentPanel from '../components/ContentPanel'
import Middlepanel from '../components/Middlepanel'
import Sidebar from '../components/Sidebar'
function ChatPage() {
  return (
    <div className='flex flex-row  h-full  w-full'>
      <Sidebar/>
      
      <Middlepanel/>
      <ContentPanel/> 
    </div>
  )
}

export default ChatPage
import React from 'react'
import { MessageCircleCheckIcon } from 'lucide-react'
function StartConversesionContainer() {
  return (
    <div className='h-full w-full '>
        <div className='h-full w-full flex flex-col items-center justify-center'>
            <MessageCircleCheckIcon size={100}/>
            <h1 className='text-3xl font-bold text-gray-500'>Select a chat to start conversation</h1>
        </div>
    </div>
  )
}

export default StartConversesionContainer
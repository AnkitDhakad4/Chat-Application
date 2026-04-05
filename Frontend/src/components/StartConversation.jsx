import React from 'react'

function StartConversation({name}) {
  return (
    <div className='h-full w-full flex items-center justify-center'>
        <p>Ready to chat with {name}? 👋</p>
    </div>
  )
}

export default StartConversation
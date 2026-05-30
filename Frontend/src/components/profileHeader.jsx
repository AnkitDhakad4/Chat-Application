import React from 'react'
import useChatStore from '../store/useChatStore'

function ProfileHeader(props) {

    const {onlineUsers,user,outsideClass}=props
  
    

    const {selectedUser,setSelectedUser } = useChatStore()

    const selectUser=(user)=>{
    
    setSelectedUser(user)
  }

  return (
    <div
          className={outsideClass}
          onClick={()=>selectUser(props.user)}
          key={user._id} 
           >
          <div className="relative h-full ">
            <div className={`${onlineUsers.some((u)=>{if(u._id===user._id && !props.upper){return true} else{return false}})? 'online':'' } absolute size-3 shrink-0 `}></div>
            <img
              src={user.image}
              className="h-full object-cover rounded-full "
            />
          </div>
          <div className=" h-full flex-1   min-w-0 flex justify-center flex-col">
            <div className="flex  justify-between pr-1">
              <p className="font-liberation text-[#0F172A] text-lg font-bold"> {user.name}</p>
              {/* <p className="text-xs font-mono">{user.lastSeen}</p> */}
            </div>
            {props.upper ? onlineUsers.some((u)=>u._id===user._id)? <p className='text-green-500 pl-0.5 text-xs'>Online...</p>:<p className='text-gray-600 text-xs pl-0.5'>Offline...</p>:<p className="font-liberation truncate max-w-full text-xs text-gray-500 ">{user.about}</p>}
          </div>
          
        </div>
  )
}

export default ProfileHeader
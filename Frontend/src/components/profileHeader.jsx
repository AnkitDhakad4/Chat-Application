import React from 'react'
import useChatStore from '../store/useChatStore'

function ProfileHeader(props) {

    const {onlineUsers,user,outsideClass,fromContactPage}=props
    
    // const onLineUsers=onlineUsers;

    const {selectedUser,setSelectedUser,getMessages } = useChatStore()

    // const selectUser = (id) => {
    //     console.log("id in middle ", id);
    //     // setSelectedUser(id);
    
       
    //   };

    const selectUser=(user)=>{
    
    if(!fromContactPage)
      {setSelectedUser(user)
       
      }
  }

  return (
    <div
          className={outsideClass}
          onClick={()=>{if(!props.upper)selectUser(props.user)}}
          key={user._id} 
           >
          <div className="relative h-full ">
            <div className={`${onlineUsers.has(user._id)&& !props.upper ? 'online':'' } absolute size-3 shrink-0 `}></div>
            <img
              src={user.profilePic || './avatar.png'}
              className={`p-1 object-cover rounded-full ${props.upper ? "h-full w-14 " :"h-16 w-16"} `}
            />
          </div>
          <div className=" h-full flex-1   min-w-0 flex justify-center flex-col">
            <div className="flex  justify-between pr-1">
              <p className="font-liberation text-[#0F172A] text-lg font-bold"> {user.name}</p>
              {/* <p className="text-xs font-mono">{user.lastSeen}</p> */}
            </div>
            {props.upper ? onlineUsers.has(user._id) ? <p className='text-green-500 pl-0.5 text-xs'>Online...</p> : <p className='text-gray-600 text-xs pl-0.5'>Offline...</p> : <p className="font-liberation truncate max-w-full text-xs text-gray-500 ">{user.about}</p>}
          </div>
          
        </div>
  )
}

export default ProfileHeader
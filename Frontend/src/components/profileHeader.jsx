import React from 'react'
import useChatStore from '../store/useChatStore'

function ProfileHeader(props) {

    const {onlineUsers,user,outsideClass}=props
    
    const onLineUsers=new Set(onlineUsers);

    const {selectedUser,setSelectedUser,getMessages } = useChatStore()

    // const selectUser = (id) => {
    //     console.log("id in middle ", id);
    //     // setSelectedUser(id);
    
       
    //   };

    const selectUser=(user)=>{
    setSelectedUser(user)
     async function getMsg(){
          try {
            console.log("getting the msg")
            await getMessages(user._id)
          } catch (error) {
            console.log(error)
          }
        }
    
        getMsg();
  }

  return (
    <div
          className={outsideClass}
          onClick={()=>selectUser(props.user)}
          key={user._id} 
           >
          <div className="relative h-full ">
            <div className={`${onLineUsers.has(user._id)&& !props.upper ? 'online':'' } absolute size-3 shrink-0 `}></div>
            <img
              src={user.profilePic || './avatar.png'}
              className="h-full p-1 object-cover rounded-full "
            />
          </div>
          <div className=" h-full flex-1   min-w-0 flex justify-center flex-col">
            <div className="flex  justify-between pr-1">
              <p className="font-liberation text-[#0F172A] text-lg font-bold"> {user.name}</p>
              {/* <p className="text-xs font-mono">{user.lastSeen}</p> */}
            </div>
            {props.upper ? onLineUsers.has(user._id) ? <p className='text-green-500 pl-0.5 text-xs'>Online...</p> : <p className='text-gray-600 text-xs pl-0.5'>Offline...</p> : <p className="font-liberation truncate max-w-full text-xs text-gray-500 ">{user.about}</p>}
          </div>
          
        </div>
  )
}

export default ProfileHeader
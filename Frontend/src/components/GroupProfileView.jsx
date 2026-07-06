import React from 'react'
import groupStore from '../store/group.store.js'


function GroupProfileView(props) {


  const {group,outsideClass,upper}=props
 
    
    // console.log(group)
    
    const {setSelectedGroup,notificationsToGroups}=groupStore()

    

    // const selectGroup = (id) => {
    //     console.log("id in middle ", id);
    //     // setSelectedUser(id);
    
       
    //   };

    const selectGroup=(group)=>{
    setSelectedGroup(group)
    //  async function getMsg(){
    //       try {
    //         console.log("getting the msg")
    //         await getMessages(user._id)
    //       } catch (error) {
    //         console.log(error)
    //       }
    //     }
    
    //     getMsg();
    }

  return (
    <div
          className={`${outsideClass}  `}
          onClick={()=>{selectGroup(group)}}
          // key={group._id} 
           >
          <div className="relative h-full ">
            <img
              src={group.groupIcon || './avatar.png'}
                className={`p-1 object-cover rounded-full ${props.upper ? "h-full w-14 " :"h-16 w-16"} `}
            />
          </div>
          <div className=" h-full flex-1   min-w-0 flex justify-center flex-col">
            <div className="flex  justify-between pr-1">
              <p className="font-liberation text-[#0F172A] text-lg font-bold"> {group.groupName}</p>
              {/* <p className="text-xs font-mono">{user.lastSeen}</p> */}
            </div>
           {upper ? <p className="font-liberation truncate max-w-full text-xs text-gray-500 ">{group.groupDescription}</p>:
           <p className="font-liberation text-xs text-gray-500 ">
            {group.members.length}  Members</p>}
          </div>
           {notificationsToGroups.has(group._id) && <div className="h-3 w-3 rounded-full bg-[#ff4081] ring-white animate-pulse" />}
        </div>
  )
}

export default GroupProfileView;
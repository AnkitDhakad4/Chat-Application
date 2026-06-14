import React from 'react'
import groupStore from '../store/group.store.js'


function GroupProfileView(props) {

    const {group,outsideClass}=props
    
    console.log("hiii")
    console.log(group)
    
    const {setSelectedGroup}=groupStore()

    

    // const selectGroup = (id) => {
    //     console.log("id in middle ", id);
    //     // setSelectedUser(id);
    
       
    //   };

    const selectGroup=(user)=>{
    setSelectedGroup(group)
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
          onClick={()=>{selectGroup(group)}}
          key={group._id} 
           >
          <div className="relative h-full ">
            <img
              src={group.groupIcon || './avatar.png'}
              className="h-full p-1 object-cover rounded-full "
            />
          </div>
          <div className=" h-full flex-1   min-w-0 flex justify-center flex-col">
            <div className="flex  justify-between pr-1">
              <p className="font-liberation text-[#0F172A] text-lg font-bold"> {group.groupName}</p>
              {/* <p className="text-xs font-mono">{user.lastSeen}</p> */}
            </div>
            <p className="font-liberation truncate max-w-full text-xs text-gray-500 ">{group.groupDescription}</p>
          </div>
          
        </div>
  )
}

export default GroupProfileView;
import axios from "axios";
import { create } from "zustand";
import axiosInstance from "../lib/axios";

const initialState={
     selectedGroup:null
}
const groupStore=create((set,get)=>({
    ...initialState,
    allGroups:[
        {
            "_id": "6a265b65c7f61bd9656b5f26",
            "groupName": "New Group",
            "groupDescription": "This is group description",
            "admin": "69d2a480baf6989be3e13770",
            "members": [
                {
                    "about": "Hey there! I am using Chatflow.",
                    "_id": "69d2a480baf6989be3e13770",
                    "name": "A",
                    "email": "a@gmail.com",
                    "profilePic": "https://res.cloudinary.com/ankitdhakad/image/upload/v1775766038/profile/l2ifejgd0s7h98nlrydi.png",
                    "lastSeen": "2026-06-14T09:07:18.778Z"
                }
            ],
            "createdAt": "2026-06-08T06:04:21.625Z",
            "updatedAt": "2026-06-08T06:04:21.625Z",
            "__v": 0
        },
        {
            "_id": "6a2668e2b8c864d6b576500e",
            "groupName": "New Group",
            "groupDescription": "This is group description",
            "admin": "69d2a480baf6989be3e13770",
            "members": [
                {
                    "about": "Hey there! I am using Chatflow.",
                    "_id": "69d2a480baf6989be3e13770",
                    "name": "A",
                    "email": "a@gmail.com",
                    "profilePic": "https://res.cloudinary.com/ankitdhakad/image/upload/v1775766038/profile/l2ifejgd0s7h98nlrydi.png",
                    "lastSeen": "2026-06-14T09:07:18.778Z"
                }
            ],
            "createdAt": "2026-06-08T07:01:54.039Z",
            "updatedAt": "2026-06-10T19:30:03.218Z",
            "__v": 0,
            "groupIcon": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1hZxkl7aLUy170veFH3FI9uDbkqoSBjMY2A&s"
        }
    ],
    selectedGroup:[],
    isGroupsLoading:true,

    setSelectedGroup:(grp)=>{
        // console.log(grp,"is selected")
        set({selectedGroup:grp})
    },

    getAllGroups:async ()=>{
        try {
            const resp=await axiosInstance.post('/group/allGroups')
            set({allGroups:resp.data.data});
        } catch (error) {
            console.log(error)
        }
    },
     reset:()=>{
        // console.log("Reseting the groupStore")
    set({...initialState})
  }
}))

export default groupStore
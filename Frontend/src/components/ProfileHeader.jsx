import { UserIcon,LogOutIcon,Volume2Icon,VolumeOffIcon } from "lucide-react"
import { useRef, useState } from "react"
import userAuthStore from '../store/userAuth.store.js'
import useChatStore from '../store/useChatStore.js'

const mouseClick =new Audio('./sounds/mouse-click.mp3')

function ProfileHeader() {
    const fileInputRef=useRef()
    const [selectedImage,setSelectedImage]=useState()
    const {user,logout}=userAuthStore()

    const {isSoundOn,toggleSound}=useChatStore()
    const handleImageUpload =(e)=>{
        console.log(e.target.files)
        const file=e.target.files[0];

        // if(!file) return 

        // const reader=new FileReader()
        // reader.readAsDataURL(file)

        // reader.onloadend=()=>{
        //     console.log(reader.result)
        //     setSelectedImage(reader.result)
        // }

        // reader.onloadend()
    }

  return (
    <div className='w-full h-3/20 ring-1 flex items-center gap-3 p-1'>
        {/* Profile Pic */}
        <div className="avatar avatar-online">
            <button className="group rounded-full size-14 overflow-hidden relative"
            onClick={()=>fileInputRef.current.click()}>
            <img 
            className="size-full object-cover"
            src={selectedImage  || '/avatar.png'  || user.profilePic } alt="profilePic" />

            <div className="absolute inset-0 bg-black/50 truncate flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-400 ">
                <span className="text-white text-xs ">Change</span>
            </div>
            <input 
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
             />
             </button>
        </div>
        {/* username */}
        <div className="pl-1 flex flex-col">
            <h3 className="truncate">{ user.name}</h3>
            <p className="text-xs">Online..</p>
        </div>

        {/* Notificationsounds */}
        <div className="flex  gap-4 pl-18">
            <button onClick={logout} className="text-slate-200 hover:text-slate-400 transition-colors">
                <LogOutIcon className="size-5"/>
                
            </button>

            <button 
            className="text-slate-200 hover:text-slate-400"
            onClick={()=>{
                mouseClick.currentTime=0;
                mouseClick.play().catch((e)=>console.log("Audio play failed :",e));
                toggleSound();
            }}
            >
            {isSoundOn ? <Volume2Icon className="size-5"/>:<VolumeOffIcon className="size-5"/>    }

            </button>
        </div>
    </div>
  )
}

export default ProfileHeader
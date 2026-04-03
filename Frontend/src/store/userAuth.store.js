import {create} from 'zustand'
import axiosInstance from '../lib/axios'
import toast from 'react-hot-toast'

const authStore= create((set)=>({
    authStatus:false,
    isCheckingAuth:false,
    isLoading:false,
    user:null,
    

    signup:async (data)=>{
        set({isLoading:true})
        try {
            console.log(data)
            const res=await axiosInstance.post('/users/signup',data)
            // console.log(res)
            toast.success("Account is created successfully !")
            set({user:res.data})
            set({authStatus:true})
        }catch(error)
        {
            toast.error(error.response?.data?.message)
        }finally{
            set({isLoading:false})
        }
    },

    checkAuth:async()=>{
        set({isCheckingAuth:true})
        try {
            const response=await axiosInstance.get('/users/check')
            console.log(response.data)
            
            set({user:response.data.data,authStatus:true})
        } catch (error) {
            console.log("error for is toast ",error)
            toast.error(error.response?.data?.message)
        }finally{
            set({isCheckingAuth:false})
        }
    },

    login:async (data)=>{
        try {
            set({isLoading:true})
            const response=await axiosInstance.post('/users/login',data)
            set({user:response.data.data})
            // console.log(response.data.data)
            set({authStatus:true})
            toast.success("Login Successfully !")
        } catch (error) {
            toast.error(error.response?.data?.message)
        }finally{
            set({isLoading:false})
        }
    },
    logout:async()=>{
        // console.log("In log out")
        try {
            const res=await axiosInstance.post('/users/logout')
            // console.log(res.data)
            toast.success("I will wait for you! 🥺 👋👋",{autoClose:3000,pauseOnHover: true,})
            
            set({authStatus:false})
        } catch (error) {
            toast.error(error.response?.data?.message)

        }
    }


}))

export default authStore



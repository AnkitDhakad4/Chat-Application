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
            
            set({user:response.data,authStatus:true})
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
            set({user:response.data})
            toast.success("Login Successfully !")
            set({authStatus:true})
        } catch (error) {
            toast.error(error.response?.data?.message)
        }finally{
            set({isLoading:false})
        }
    }


}))


export default authStore
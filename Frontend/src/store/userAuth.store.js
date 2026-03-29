import {create} from 'zustand'

const authStore= create((set)=>({
    user:{name:"Ankit",age:"21"},
    isLogin:false,


    login:()=>{
         set({isLogin:true})
        console.log('Login is pressed ')
    }

}))


export default authStore
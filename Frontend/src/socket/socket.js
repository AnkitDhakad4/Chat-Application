import { io} from "socket.io-client";

const baseUrl = import.meta.env.VITE_SOCKET_URL;

const socket=io(baseUrl,{
    withCredentials:true,
    autoConnect:false,
    transports: ["websocket"]
})



export default socket
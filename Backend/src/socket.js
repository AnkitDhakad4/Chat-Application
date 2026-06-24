import { Server } from "socket.io";
import express from "express";
import http from "http";
import ENV from "./ENV.js";
import socketAuthMiddleWare from "./middleware/socketAuth.middleware.js";
import Group from "./models/group.model.js";
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ENV.originLink || "http://localhost:5173",
    credentials: true,
  },
});

io.use(socketAuthMiddleWare);

//to store the online users
const userSocketMap = {};

function getReceiverId(userId){
  return userSocketMap[userId];
}

// here
// io is the whole server
// and socket is that particular users connection instance
io.on("connection", async (socket) => {
  
  
  const userId = socket.user_id;
  console.log("A user is connected to socket with id ", socket.id, socket.user.name, userId);

  userSocketMap[userId] = socket.id;

  //to send online user informations
  io.emit("getOnlineUsers", Object.keys(userSocketMap));//we used io because we want inform all the user on our server that this user is also online
  try {
      const groups=await Group.find({members:userId});
      

      groups.forEach((grp)=>{
        console.log(grp._id.toString())
        socket.join(grp._id.toString())
      })
  } catch (error) {
    console.log(error?.message)
  }


  socket.on("disconnect", () => {
    //here we used the socket bcz that particular user is disconnected and we will run this when only to get that he is disonnected
    // console.log(`user: ${socket.user.name} is disconnected`);
    
    delete userSocketMap[userId];

    //here again io bcz to infor all user that he is disconnected it will run when anyone i just trun off his connection
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io,getReceiverId };

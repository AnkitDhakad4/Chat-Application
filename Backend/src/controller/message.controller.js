import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import MessageRequest from '../models/messageRequest.model.js'
import generateCloudinarySignature from "../Database/cloudinary.js";
import { getReceiverId, io } from "../socket.js";
import chatParteners from "../models/chatParteners.model.js";


const requestToMessage=async function(req,res){
  try {
    
    const {id:reciever}=req.params;
    const user=req.user;

    if(!reciever)
    {
      return res.status(400).json({message:"Receiver id is required to message"});
    }

    const request=await MessageRequest.create({
      senderId:user._id,
      receiverId:reciever,
      status:'pending'
    })

    if(!request)
    {
      return res.status(503).json({message:"there is error while creating the request"})
    }

    return res.status(200).json({message:"Request is sended to user successfully",data:request})

  } catch (error) {
    return res.status(500).json({message:error.message})
  }
}

const acceptMessageRequest=async function(req,res){
  try {
    const user=req.user;
    const {requestId}=req.body;
  
    if(!requestId)
    {
      return res.status(400).json({message:"request id is required"});
    }
  
    const acceptIt=await MessageRequest.findOneAndUpdate({_id:requestId},{status:'accepted'},{returnDocument:'after'})

    
      if(!acceptIt)
      {
        return res.status(503).json({message:"Error while accepting the request"});
      }
    const receiverId=acceptIt.receiverId;

    const updateParteners=await chatParteners.findOneAndUpdate({userId:user._id},{$addToSet:{partners:receiverId}},{upsert:true,returnDocument:'after'})

    if(!updateParteners)
    {
      return res.status(503).json({message:"Error while updating the chatParteners"});
    }
  
    return res.status(200).json({message:"request is accepted",data:acceptIt});
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}



const rejectMessageRequest=async function(req,res){
  try {
    const user=req.user;
    const {requestId}=req.body;
  
    if(!requestId)
    {
      return res.status(400).json({message:"request id is required"});
    }
  
    const rejectIt=await MessageRequest.findOneAndUpdate({_id:requestId},{status:'rejected'},{returnDocument:'after'})
  
    if(!rejectIt)
    {
      return res.status(503).json({message:"Error while rejecting the request"});
    }
  
    return res.status(200).json({message:"request is rejected",data:rejectIt});
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}



const getAllRequestForUser=async function(req,res){
  try {
    const user=req.user;
    
    const requests=await MessageRequest.find({receiverId:user._id,status:'pending'})
  
    if(!requests)
    {
      return res.status(503).json({message:"Error while fetching all pending requests"});
    }
  
    return res.status(200).json({message:"requests are fetched successfully",data:requests});
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}


const getAllRejectedRequests=async function(req,res){
  try {
    const user=req.user;
    
    const requests=await MessageRequest.find({receiverId:user._id,status:'rejected'})
  
    if(!requests)
    {
      return res.status(503).json({message:"Error while fetching all rejected requests"});
    }
  
    return res.status(200).json({message:"rejected requests are fetched successfully",data:requests});
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}



const acceptRejectedRequest=async function(req,res){
  try {
    const user=req.user;
    const {requestId}=req.body
    
    const requestAccepted=await MessageRequest.findOneAndUpdate({_id:requestId},{status:'accepted'},{returnDocument:'after'})
    
    if(!requestAccepted)
    {
      return res.status(503).json({message:"Error while accepting request"});
    }

    const receiverId=requestAccepted.receiverId;
    const updateParteners=await chatParteners.findOneAndUpdate({userId:user._id},{$addToSet:{partners:receiverId}},{upsert:true,returnDocument:'after'})

    if(!updateParteners)
    {
      return res.status(503).json({message:"Error while updating the chatParteners"});
    }
  
    return res.status(200).json({message:"Request is accepted successfully",data:requestAccepted});
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}




const createMessage = async function (req, res) {
  try {
    const { image, text } = req.body;

    const sender = req.user.id;
    const { id: receiver } = req.params;
    // let url = "";
    // if (image) {
    //   url = await uploadOnCloudinary(image, "Messages");
    // }
    // console.log("Message in create message ",text,image)

    const isEligible=await MessageRequest.findOne({$or:[{senderId:sender,receiverId:receiver,status:'accepted'},{senderId:receiver,receiverId:sender,status:'accepted'}]})

    if(!isEligible )
    {
      return res.status(401).json({message:"Acceptance required to message."})
    }

    const message = await Message.create({
      senderId: sender,
      receiverId: receiver,
      image: image,
      text: text,
    });

    // console.log("message is created successfully ",message)
 
    
    // todo : to implement the socket.io for real time message sending
    const receiverSocketId = getReceiverId(reciever);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    return res.status(200).json({ message: message });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while sending the message ", error });
  }
};

const getChatPartners = async function (req, res) {
  try {
    const userId = req.user.id;

    
  const parteners=await chatParteners.findOne({userId:userId}).populate('partners','email name profilePic about lastSeen')
const data = parteners ? parteners.partners.filter((prtnr)=>prtnr._id!=userId) : [];

// parteners.filter((prtnr)=>prtnr._id !=user._id)
    //console.log("Chat parteners are ", parteners);
    console.log("chatPartners:- ",data)
    return res
      .status(200)
      .json({ message: "Here is all the chat partners ", data: data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetching the chat partners", error:error.message });
  }
};

const getAllContacts = async function (req, res) {
  try {
    const userId = req.user.id;

    const contacts = await User.find({ _id: { $ne: userId } }).select(
      "-password -dob",
    );

    //console.log("All contacts are ", contacts);
    return res
      .status(200)
      .json({ message: "Here is all the contacts ", data: contacts });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while getting the all contacts", error });
  }
};

const getMessageByUserId = async function (req, res) {
  try {
    const senderId = req.user.id;
    const { id: receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    // console.log("Messages with this user are ", messages);
    return res.status(200).json({
      message: "ALl message of this user is received with this person",
      data: messages,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const generateUploadToken = (req, res) => {
  const { folder } = req.body;
  const { timestamp, signature, apiKey } = generateCloudinarySignature(folder);

  return res
    .status(200)
    .json({
      message: "Token is generated successfully",
      data: { timestamp, signature, apiKey },
    });
};

const getImageUrl = (req, res) => {};

export {
  createMessage,
  getAllContacts,
  getChatPartners,
  getMessageByUserId,
  generateUploadToken,

  requestToMessage,
  acceptMessageRequest,
  rejectMessageRequest,
  getAllRequestForUser,
  getAllRejectedRequests,
  acceptRejectedRequest
};

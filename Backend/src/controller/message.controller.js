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
    // 
    return res.status(500).json({message:error.message})
  }
}

const getAllSendedRequest=async function(req,res){
 try {
   const user=req.user;
   
 const requests=await MessageRequest.find({
       senderId:user._id,
       status:'pending'
     })
     if (!requests) {
      return res.status(404).json({ message: "Could not retrieve requests data structure" });
    }

    // 
      return res.status(200).json({ 
      message: "All sent requests fetched successfully", 
      data: requests
    });
 } catch (error) {
   return res.status(500).json({message:error.message})
 }
}

// const acceptMessageRequest=async function(req,res){
//   try {
//     const user=req.user;
//     const {requestId}=req.body;
  
//     if(!requestId)
//     {
//       return res.status(400).json({message:"request id is required"});
//     }
  
//     const acceptIt=await MessageRequest.findOneAndUpdate({_id:requestId},{status:'accepted'},{returnDocument:'after'})

    
//       if(!acceptIt)
//       {
//         return res.status(503).json({message:"Error while accepting the request"});
//       }
//     const receiverId=acceptIt.senderId;

//     const updateParteners=await chatParteners.findOneAndUpdate({userId:user._id},{$addToSet:{partners:receiverId}},{upsert:true,returnDocument:'after'})
      
//     if(!updateParteners)
//     {
//       return res.status(503).json({message:"Error while updating the chatParteners"});
//     }
  
//     return res.status(200).json({message:"request is accepted",data:acceptIt});
//   } catch (error) {
//     return res.status(500).json({message:error.message});
//   }
// }

const acceptMessageRequest = async function (req, res) {
  try {
    const user = req.user; // User A (the one accepting)
    const { requestId } = req.body;
  
    if (!requestId) {
      return res.status(400).json({ message: "request id is required" });
    }
  
    const acceptIt = await MessageRequest.findOneAndUpdate(
      { _id: requestId },
      { status: 'accepted' },
      { returnDocument: 'after' }
    );

    if (!acceptIt) {
      return res.status(503).json({ message: "Error while accepting the request" });
    }

    const receiverId = acceptIt.senderId; // User B (the one who sent it)

    // Update User A's partners (add User B)
    const updateA = await chatParteners.findOneAndUpdate(
      { userId: user._id },
      { $addToSet: { partners: receiverId } },
      { upsert: true, returnDocument: 'after' }
    );

    // Update User B's partners (add User A) - This makes it mutual!
    const updateB = await chatParteners.findOneAndUpdate(
      { userId: receiverId },
      { $addToSet: { partners: user._id } },
      { upsert: true, returnDocument: 'after' }
    );
  
    if (!updateA || !updateB) {
      return res.status(503).json({ message: "Error while updating mutual chat partners" });
    }
  
    return res.status(200).json({ message: "Request is accepted mutually", data: acceptIt });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



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
    
    const requests=await MessageRequest.find({receiverId:user._id,status:'pending'}).populate('senderId','name about profilePic')
  
    if(!requests)
    {
      return res.status(503).json({message:"Error while fetching all pending requests"});
    }
  
    return res.status(200).json({message:"requests are fetched successfully",data:requests});
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}


// const getAllRejectedRequests=async function(req,res){
//   try {
//     const user=req.user;
    
//     const requests=await MessageRequest.find({receiverId:user._id,status:'rejected'})
  
//     if(!requests)
//     {
//       return res.status(503).json({message:"Error while fetching all rejected requests"});
//     }
  
//     return res.status(200).json({message:"rejected requests are fetched successfully",data:requests});
//   } catch (error) {
//     return res.status(500).json({message:error.message});
//   }
// }



// const acceptRejectedRequest=async function(req,res){
//   try {
//     const user=req.user;
//     const {requestId}=req.body
    
//     const requestAccepted=await MessageRequest.findOneAndUpdate({_id:requestId},{status:'accepted'},{returnDocument:'after'})
    
//     if(!requestAccepted)
//     {
//       return res.status(503).json({message:"Error while accepting request"});
//     }

//     const receiverId=requestAccepted.receiverId;
//     const updateParteners=await chatParteners.findOneAndUpdate({userId:user._id},{$addToSet:{partners:receiverId}},{upsert:true,returnDocument:'after'})

//     if(!updateParteners)
//     {
//       return res.status(503).json({message:"Error while updating the chatParteners"});
//     }
  
//     return res.status(200).json({message:"Request is accepted successfully",data:requestAccepted});
//   } catch (error) {
//     return res.status(500).json({message:error.message});
//   }
// }




const createMessage = async function (req, res) {
  try {
    const { image, text } = req.body;
    // 
    // 

    const sender = req.user.id;
    const { id: receiver } = req.params;
    // 
    // let url = "";
    // if (image) {
    //   url = await uploadOnCloudinary(image, "Messages");
    // }
    

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
    })

    const newmessage=await message.populate('senderId', 'name profilePic');
    // 
 
    
    const receiverSocketId = getReceiverId(receiver);
    // 
    if (receiverSocketId) {
      // 
      io.to(receiverSocketId).emit("newMessage", newmessage);
    }

    
    return res.status(200).json({ message: newmessage });
  } catch (error) {
    // 
    return res
      .status(500)
      .json({ message: "Error while sending the message ", error });
  }
};


const getChatPartners = async function (req, res) {
  try {
    const userId = req.user.id;

    const parteners = await chatParteners
      .findOne({ userId: userId })
      .populate('partners', 'email name profilePic about lastSeen');

    // Filter out self just in case, or default to empty array
    const data = parteners 
      ? parteners.partners.filter((prtnr) => prtnr._id.toString() !== userId.toString()) 
      : [];

    return res
      .status(200)
      .json({ message: "Here is all the chat partners ", data: data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while fetching the chat partners", error: error.message });
  }
};


const getAllContacts = async function (req, res) {
  try {
    const userId = req.user.id;

    // 1. Fetch User's existing chat partners list
    const userPartnersDoc = await chatParteners.findOne({ userId: userId });
    
    // 2. Extract partner IDs if document exists, otherwise default to an empty array
    const partnerIds = userPartnersDoc ? userPartnersDoc.partners : [];

    // 3. Find contacts who are NOT the current user AND NOT already chat partners
    const contacts = await User.find({ 
      _id: { 
        $ne: userId,        // Exclude self
        $nin: partnerIds    // Exclude existing chat partners
      } 
    }).select("-password -dob");

    return res
      .status(200)
      .json({ message: "Here is all the contacts ", data: contacts });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while getting the all contacts", error: error.message });
  }
};

let cnt=1;
const getMessageByUserId = async function (req, res) {
  try {
    const senderId = req.user.id;
    const { id: receiverId } = req.params;
    
    // console.log(`for userId ${receiverId} messages are fetched current call is ${cnt}`)
    cnt++;
    
    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).populate('senderId', 'name profilePic');;
    const newmessages=messages
    
    return res.status(200).json({
      message: "ALl message of this user is received with this person",
      data: newmessages,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};
// 
const generateUploadToken = (req, res) => {
  const { folder } = req.body;
  // 
  const { timestamp, signature, apiKey } = generateCloudinarySignature(folder);
  // 
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
  getAllSendedRequest
};

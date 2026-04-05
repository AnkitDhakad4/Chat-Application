import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../Database/cloudinary.js";
import generateCloudinarySignature from "../Database/cloudinary.js";
import messageRouter from "../routes/message.routes.js";


const createMessage = async function (req, res) {
  try {
    const { image, text } = req.body;
    
    const sender = req.user.id;
    const { id: reciever } = req.params;
    // let url = "";
    // if (image) {
    //   url = await uploadOnCloudinary(image, "Messages");
    // }
    const message = await Message.create({
      senderId: sender,
      recieverId: reciever,
      image: image,
      text: text,
    });

    // todo : to implement the socket.io for real time message sending

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

    const messages = await Message.find({
      $or: [{ senderId: userId }, { recieverId: userId }],
    });

    (messages);
    const chatPartenersIds = [
      ...new Set(
        messages.map((message) =>
          message.senderId?.toString() === userId?.toString()
            ? message.recieverId?.toString()
            : message.senderId?.toString(),
        ),
      ),
    ];
    

    const parteners = await User.find({
      _id: { $in: chatPartenersIds },
    }).select("-password");



    return res
      .status(200)
      .json({ message: "Here is all the chat partners ", data: parteners });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetching the chat partners", error });
  }
};

const getAllContacts = async function (req, res) {
  try {
    const userId = req.user.id;
    
    const contacts = await User.find({ _id: { $ne: userId } }).select(
      "-password -dob",
    );

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
        { senderId: senderId, recieverId: receiverId },
        { senderId: receiverId, recieverId: senderId },
      ],
    });

    
    return res
      .status(200)
      .json({
        message: "ALl message of this user is received with this person",
        data: messages,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const generateUploadToken=(req,res)=>{
  const {timestamp,signature,apiKey}=generateCloudinarySignature()

  return res.status(200).json({message:"Token is generated successfully",data:{timestamp,signature,apiKey}})
}

const getImageUrl=(req,res)=>{
  
}

export { createMessage, getAllContacts, getChatPartners, getMessageByUserId, generateUploadToken };

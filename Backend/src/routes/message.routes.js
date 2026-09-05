import Router from "express";
import {
  createMessage,
  getAllContacts,
  getChatPartners,
  getMessageByUserId,
  generateUploadToken,

  requestToMessage,
  acceptMessageRequest,
  rejectMessageRequest,
  getAllRequestForUser,
  // getAllRejectedRequests,
  // acceptRejectedRequest,
  getAllSendedRequest,
} from "../controller/message.controller.js";
import authentication from "../middleware/authMiddleWare.js";

const messageRouter = Router();

messageRouter.route("/uploadToken").post(authentication, generateUploadToken);
messageRouter.route("/contacts").get(authentication, getAllContacts);
messageRouter.route("/chats").get(authentication, getChatPartners);
messageRouter.route("/send/:id").post(authentication, createMessage);
messageRouter.route("/messageRequest/:id").get(authentication,requestToMessage);

messageRouter.route('/acceptMessageRequest').post(authentication,acceptMessageRequest)
messageRouter.route('/rejectMessageRequest').post(authentication,rejectMessageRequest)
messageRouter.route('/getAllRequests').post(authentication,getAllRequestForUser)
// messageRouter.route('/getRejectedRequests').post(authentication,getAllRejectedRequests)
// messageRouter.route('/acceptRejectedRequest').post(authentication,acceptRejectedRequest)
messageRouter.route('/getSentRequests').get(authentication,getAllSendedRequest) 
messageRouter.route("/:id").get(authentication, getMessageByUserId);

export default messageRouter;

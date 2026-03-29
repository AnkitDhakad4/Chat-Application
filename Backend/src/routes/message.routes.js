import Router from 'express';
import { createMessage, getAllContacts, getChatPartners, getMessageByUserId } from '../controller/message.controller.js';
import authentication from '../middleware/authMiddleWare.js'


const messageRouter=Router();


messageRouter.route('/contacts').get(authentication,getAllContacts)
messageRouter.route('/chats').get(authentication,getChatPartners)
messageRouter.route('/send/:id').post(authentication,createMessage)
messageRouter.route('/:id').get(authentication,getMessageByUserId)


export default messageRouter

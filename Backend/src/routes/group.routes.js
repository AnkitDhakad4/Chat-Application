import express from 'express'
import authentication from '../middleware/authMiddleWare.js'
import { addMembers, createGroup,allGroups, getGroupInfo,removeMembers,deleteGroup,groupInvitationAcceptance,
  groupInvitationRejection,getGroupMessages,createGroupMessages, 
  updateGroupDetails} from '../controller/group.controller.js'

const groupRouter=express.Router()


groupRouter.route('/createGroup').post(authentication,createGroup)
groupRouter.route('/addMembers').post(authentication,addMembers)
groupRouter.route('/getGroupInfo/:groupId').post(authentication,getGroupInfo)
groupRouter.route('/removeMembers').post(authentication,removeMembers)
groupRouter.route('/deleteGroup/:groupId').post(authentication,deleteGroup)
groupRouter.route('/updateGroupDetails/:groupId').post(authentication,updateGroupDetails)
groupRouter.route('/acceptInvitation').post(authentication,groupInvitationAcceptance)
groupRouter.route('/rejectInvitation').post(authentication,groupInvitationRejection)
groupRouter.route('/allGroups').post(authentication,allGroups)
groupRouter.route('/getAllMessages').post(authentication,getGroupMessages)
groupRouter.route('/sendMessage').post(authentication,createGroupMessages)





export default groupRouter
import express from 'express'
import authentication from '../middleware/authMiddleWare.js'
import { addMembers, createGroup, getGroupInfo,removeMembers,deleteGroup,updateIcon,groupInvitationAcceptance,
  groupInvitationRejection } from '../controller/group.controller.js'

const groupRouter=express.Router()


groupRouter.route('/createGroup').post(authentication,createGroup)
groupRouter.route('/addMembers').post(authentication,addMembers)
groupRouter.route('/getGroupInfo/:groupId').post(authentication,getGroupInfo)
groupRouter.route('/removeMembers/:groupId').post(authentication,removeMembers)
groupRouter.route('/deleteGroup/:groupId').post(authentication,deleteGroup)
groupRouter.route('/updateIcon/:groupId').post(authentication,updateIcon)
groupRouter.route('/acceptInvitation').post(authentication,groupInvitationAcceptance)
groupRouter.route('/rejectInvitation').post(authentication,groupInvitationRejection)





export default groupRouter
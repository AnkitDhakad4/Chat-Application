import mongoose from "mongoose";
import Group from "../models/group.model.js";
import groupRequest from "../models/groupRequest.model.js";
import Message from '../models/message.model.js'
import { io } from "../socket.js";


const getGroupMessages=async function(req,res){
  try {
    const user=req.user
    const {groupId}=req.body

    const data = await Group.findOne({ _id: groupId, members: user._id });

    if (!data) {
      return res
        .status(403)
        .json({ message: "You are not the member of this group" });
    }

    const messages=await Message.find({groupId:data._id}).populate('senderId','name profilePic');

    

      return res
        .status(201)
        .json({ message: "messages are fetched successfully",data:messages });


  } catch (error) {
    return res.status(500).json({message:error.message})
  }
}

const createGroupMessages=async function(req,res){
  try {
    const user=req.user
    const {groupId,text,image,senderSocketId}=req.body

    if(!groupId)
    {
      return res
        .status(400)
        .json({ message: "group id is required" });
    }

    if(!text && !image)
    {
       return res
        .status(400)
        .json({ message: "Can not send an empty message" });

    }
    const data = await Group.findOne({ _id: groupId, members: user._id });

    if (!data) {
      return res
        .status(403)
        .json({ message: "You are not the member of this group" });
    }

    // console.log("In group message send",groupId,text,image)
    const message=await (await Message.create({groupId:data._id,text:text,image:image,senderId:user._id})).populate('senderId','name profilePic')
    // console.log(message)
    // [{path:'senderId',select:'name profilePic'},{path:'groupId', select:'groupName'}]
    if(!message)
    {
      return res
        .status(404)
        .json({ message: "Can not get the messages of the group" });
    }

   

      io.to(groupId).except(senderSocketId).emit("newGroupMessage",message,data)
   


      return res
        .status(201)
        .json({ message: "Message sent successfully",data:message });


  } catch (error) {
    return res.status(500).json({message:error.message})
  }
}





const createGroup = async (req, res) => {
  try {
    
    const { description,  groupName,members,groupIcon } = req.body;
    const user = req.user;
    if (groupName.trim().length == 0) {
      return res.status(400).json({ message: "Provide a name to the group" });
    }

    


    const grp = await Group.create({
      groupName: groupName,
      groupDescription: description,
      groupIcon:groupIcon,
      admin: user._id,
      members: [user._id,...members],
    });

    
    if (!grp) {
      return res
        .status(501)
        .json({ message: "There is some error while creating the group" });
    }

    const grpData = await Group.findById(grp._id);

    if (!grpData) {
      return res
        .status(501)
        .json({ message: "Unable to fetch the Group data" });
    }

   
    return res
      .status(200)
      .json({ message: "Group is created successfully", data: grpData });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

const addMembers = async function (req, res) {
  try {
    const { members, groupId } = req.body;
    const user = req.user;
    console.log(members,groupId)
    if (members.length == 0) {
      return res
        .status(400)
        .json({ message: "atleast 1 memeber is required to add in the group" });
    }
    const matchGroupAdmin = await Group.findOne({
      admin: user._id,
      _id: groupId,
    });
    if (!matchGroupAdmin) {
      return res
        .status(403)
        .json({ message: "You are not the admin of this group" });
    }

    // const newData = await Group.findOneAndUpdate(
    //   { _id: groupId },
    //   {
    //     $addToSet: { members: { $each: members } },
    //   },
    //   { new: true },
    // );

    const groupMembers = matchGroupAdmin.members;

    const invitationPromises = members.map(async (memberId) => {
      if (groupMembers.includes(memberId)) {
        return null;
      } else {
        return await groupRequest.findOneAndUpdate(
          {
            groupId: groupId,
            invitedUserId: memberId,
          },
          { adminId: user._id, status: "pending" },
          { upsert: true, returnDocument: "after" },
        );
      }
    });

    const requests = await Promise.all(invitationPromises);
    const createdRequests = requests.filter((reqs) => reqs !== null);
    console.log(createdRequests)
    return res.status(200).json({
      message: "Request to join the group is sent to the users successfully",
      data: createdRequests,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const allGroups=async function(req,res){
  try {
    const user=req.user;

    const groups=await Group.find({members:user._id}).populate('members','name email about profilePic lastSeen');
    if(!groups)
    {
      return res.status(400).json({message:"Error while fetching the groups"})

    }

      return res.status(200).json({message:"Groups are fetched successfully",data:groups})

  } catch (error) {
    return res.status(500).json({message:error.message})
  }
}

const groupInvitationsToUser = async function (req, res) {
  try {
    console.log("frontend is hitting")
    const user = req.user;
    const invitations = await groupRequest
      .find({ invitedUserId: user._id, status: "pending" })
      .populate("adminId", "name email profilePic about")
      .populate("groupId", "groupName groupIcon groupDescription");

    if (!invitations) {
      return res
        .status(200)
        .json({ message: "user is not invited in any group till now" });
    }

    return res
      .status(200)
      .json({ message: "USer is invited in this groups", data: invitations });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const groupInvitationAcceptance = async function (req, res) {
  try {
    const user = req.user;
    const { groupId } = req.body;

    if (!groupId ) {
      return res
        .status(403)
        .json({ message: "Please provide the groupId or the adminId" });
    }

    // console.log("groupId", groupId);
    const pendingInvite = await groupRequest.findOne({
      groupId: groupId,
      invitedUserId: user._id,
      status: "pending",
    });
    if (!pendingInvite) {
      return res
        .status(400)
        .json({ message: "You have not been invited to join this group" });
    }

    const isGroupExist = await Group.findOne({ _id: groupId});

    if (!isGroupExist) {
      return res.status(400).json({
        message:
          "Group does not exist or the person who invited you is not the admin of the group",
      });
    }

    const addToGroup = await Group.findOneAndUpdate(
      { _id: groupId },
      { $addToSet: { members: user._id } },
      { returnDocument: "after" },
    ).populate("members", "name profilePic about");

    // socket.join(groupId.toString());

    if (!addToGroup) {
      return res
        .status(501)
        .json({ message: "there is error while adding member to the group" });
    }

    await groupRequest.findOneAndUpdate(
      { groupId: groupId, invitedUserId: user._id },
      { status: "accepted" },
      { returnDocument: "after" },
    );

    return res
      .status(200)
      .json({ message: "you joined the group successfully", data: addToGroup });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

const groupInvitationRejection = async function (req, res) {
  try {
    const user = req.user;
    const { groupId } = req.body;

    if (!groupId ) {
      return res
        .status(403)
        .json({ message: "Please provide the groupId " });
    }

    const pendingInvite = await groupRequest.findOne({
      groupId: groupId,
      invitedUserId: user._id,
      status: "pending",
    });
    if (!pendingInvite) {
      return res
        .status(400)
        .json({ message: "You have not been invited to join this group" });
    }

    const isGroupExist = await Group.findOne({ _id: groupId });

    if (!isGroupExist) {
      return res.status(400).json({
        message:
          "Group does not exist or the person who invited you is not the admin of the group",
      });
    }

    const resp = await groupRequest.findOneAndUpdate(
      { groupId: groupId, invitedUserId: user._id },
      { status: "rejected" },
      { returnDocument: "after" },
    );

    return res.status(200).json({
      message: `you rejected the invitation from the ${isGroupExist.name} group`,
      data: resp,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const rejectedInvitations = async function (req, res) {
  try {
    const user = req.user;

    const rejectedRequests = await groupRequest
      .find({ invitedUserId: user._id, status: "rejected" })
      .populate("adminId", "name email profilePic about")
      .populate("groupId", "groupName groupIcon groupDescription");

    if (!rejectedRequests) {
      return res
        .status(200)
        .json({ message: "you do not give rejection to any group" });
    }

    return res.status(200).json({
      message: "Rejected groups are successfully fetched",
      data: rejectedRequests,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const acceptRejectedInvitation = async function (req, res) {
  try {
    const user = req.user;
    const { groupId, adminId } = req.body;

    if (!groupId || !adminId) {
      return res
        .status(403)
        .json({ message: "Please provide the groupId or the adminId" });
    }

    const pendingInvite = await groupRequest.findOne({
      groupId: groupId,
      adminId: adminId,
      invitedUserId: user._id,
      status: "rejected",
    });
    if (!pendingInvite) {
      return res.status(400).json({ message: "No rejected invitation found" });
    }

    const isGroupExist = await Group.findOne({ _id: groupId, admin: adminId });

    if (!isGroupExist) {
      return res.status(400).json({
        message:
          "Group does not exist or the person who invited you is not the admin of the group",
      });
    }

    const addToGroup = await Group.findOneAndUpdate(
      { _id: groupId },
      { $addToSet: { members: user._id } },
      { returnDocument: "after" },
    ).populate("members", "name profilePic about");

    if (!addToGroup) {
      return res
        .status(501)
        .json({ message: "there is error while adding member to the group" });
    }

    await groupRequest.findOneAndUpdate(
      { groupId: groupId, invitedUserId: user._id },
      { status: "accepted" },
      { returnDocument: "after" },
    );

    return res
      .status(200)
      .json({ message: "you joined the group successfully", data: addToGroup });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getGroupInfo = async function (req, res) {
  try {
    const { groupId } = req.params;
    const user = req.user;

    if (!groupId) {
      return res.status(401).json({ message: "Provide the groupId properly" });
    }

    // const info = await Group.aggregate([
    //   {
    //     $match: {
    //       _id: new mongoose.Types.ObjectId(groupId),

    //       members: new mongoose.Types.ObjectId(user._id),
    //     }
    //   },
    // ]);

    const info = await Group.findOne({ _id: groupId, members: user._id }).populate('members','name email about profilePic lastSeen');

    if (!info) {
      return res
        .status(404)
        .json({ message: "You are not the member of this group" });
    }

    return res
      .status(200)
      .json({ message: "group data is fetched successfully", data: info });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeMembers = async function (req, res) {
  try {
    const { membersToKick, groupId } = req.body;
    const user = req.user;

    // 1. Validation checks
    if (!groupId) { 
      return res.status(400).json({ message: "Provide the groupId properly" });
    }

    if (!membersToKick || membersToKick.length === 0) {
      return res.status(400).json({
        message: "At least 1 member is required to remove from the group",
      });
    }

    // 2. Remove members from the Group roster (Verifies admin identity atomically)
    const updatedGroup = await Group.findOneAndUpdate(
      { 
        _id: groupId, 
        admin: user._id 
      },
      { 
        $pull: { members: { $in: membersToKick } } 
      },
      { returnDocument: "after" }
    ).populate('members','name email about profilePic lastSeen');

    // 3. If no group was modified, the target group doesn't exist or caller isn't the admin
    if (!updatedGroup) {
      return res.status(403).json({ 
        message: "Action forbidden. Group not found or you are not the group admin." 
      });
    }

    console.log(updatedGroup)
    // 4. Clean up Invitation Requests from the GroupRequest collection
    // Deletes any matching invitations for these users for this specific group
    const deletionResult = await groupRequest.deleteMany({
      groupId: groupId,
      invitedUserId: { $in: membersToKick }
    });

    // 5. Return the brand new data state along with deletion telemetry
    console.log("members removed new members are",updatedGroup)
    return res.status(200).json({ 
      message: "Members and their invitations removed successfully", 
      data: updatedGroup,
      deletedInvitationsCount: deletionResult
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const deleteGroup = async function (req, res) {
  try {
    const { groupId } = req.params;
    const user = req.user;
    if (!groupId) {
      return res.status(400).json({ message: "Provide the groupId properly" });
    }
    const matchGroupAdmin = await Group.findOne({
      _id: groupId,
      admin: user._id,
    });
    if (!matchGroupAdmin) {
      return res.status(403).json({
        message: "You are not the admin of this group you can not delete it",
      });
    }

    const deletedData = await Group.findOneAndDelete({ _id: groupId });
    if (!deletedData) {
      return res
        .status(404)
        .json({ message: "Error while deleting the group" });
    }

    return res
      .status(200)
      .json({ message: "Group is deleted successfully", data: deletedData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateGroupDetails = async function (req, res) {
  try {
    const { groupId } = req.params;
    const { iconUrl,groupName,description } = req.body;
    const user = req.user;

    if (!groupId) {
      return res.status(400).json({ message: "Provide the groupId properly" });
    }
    console.log(groupId,iconUrl,groupName,description)
    const updatedData = await Group.findOneAndUpdate(
      {
       _id:groupId
          
      },
      {
        $set: { groupIcon: iconUrl,groupDescription:description,groupName:groupName },
      },
      { returnDocument: "after" },
    ).populate('members','name email about profilePic lastSeen');;

      console.log(updatedData)
    if (!updatedData) {
      return res
        .status(404)
        .json({ message: "you are not a member of this group" });
    }
    return res
      .status(200)
      .json({ message: "Group icon updated successfully", data: updatedData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  addMembers,
  createGroup,
  getGroupInfo,
  removeMembers,
  deleteGroup,
  updateGroupDetails,
  groupInvitationsToUser,
  groupInvitationAcceptance,
  groupInvitationRejection,
  rejectedInvitations,
  acceptRejectedInvitation,
  allGroups,
  getGroupMessages,
  createGroupMessages
};

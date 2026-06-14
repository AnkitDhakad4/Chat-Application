import mongoose from "mongoose";
import Group from "../models/group.model.js";
import groupRequest from "../models/groupRequest.model.js";
import Message from '../models/message.model.js'


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
    const {groupId,text,image}=req.body

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

    const message=await Message.create({groupId:data._id,text:text,image:image,senderId:user._id})

    if(!message)
    {
      return res
        .status(404)
        .json({ message: "Can not get the messages of the group" });
    }

      return res
        .status(201)
        .json({ message: "Message sent successfully",data:message });


  } catch (error) {
    return res.status(500).json({message:error.message})
  }
}





const createGroup = async (req, res) => {
  try {
    const { description, name } = req.body;
    const user = req.user;
    console.log(user);
    if (name.trim().length == 0) {
      return res.status(400).json({ message: "Provide a name to the group" });
    }

    const grp = await Group.create({
      groupName: name,
      groupDescription: description,
      admin: user._id,
      members: [user._id],
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

    // console.log(grpData);
    return res
      .status(200)
      .json({ message: "Group is created successfully", data: grpData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addMembers = async function (req, res) {
  try {
    const { members, groupId } = req.body;
    const user = req.user;

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
    const { groupId, adminId } = req.body;

    if (!groupId || !adminId) {
      return res
        .status(403)
        .json({ message: "Please provide the groupId or the adminId" });
    }

    console.log("groupId", groupId, "\nadminId", adminId, "\nuserId", user._id);
    const pendingInvite = await groupRequest.findOne({
      groupId: groupId,
      adminId: adminId,
      invitedUserId: user._id,
      status: "pending",
    });
    if (!pendingInvite) {
      return res
        .status(400)
        .json({ message: "You have not been invited to join this group" });
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

const groupInvitationRejection = async function (req, res) {
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
      status: "pending",
    });
    if (!pendingInvite) {
      return res
        .status(400)
        .json({ message: "You have not been invited to join this group" });
    }

    const isGroupExist = await Group.findOne({ _id: groupId, admin: adminId });

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
    const { membersToKick } = req.body;
    const { groupId } = req.params;
    const user = req.user;

    if (membersToKick.length === 0) {
      return res.status(400).json({
        message: "atleast 1 memeber is required to remove from the group",
      });
    }

    if (!groupId) { 
      return res.status(400).json({ message: "Provide the groupId properly" });
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

    const memberStringIds=matchGroupAdmin.members.map((memid)=>memid.toString())
    const removationPromises = membersToKick.map(async (member) => {
      
// the user who rejected the invitation will not be in the group so we can not remove it from the group also or the user is not  member of  group
      if (!memberStringIds.includes(member)) {
        return null;
      } else {
        return await groupRequest.findOneAndDelete({
          invitedUserId: member,
          groupId: groupId,
        });
      }
    });
    const newData = await Group.findOneAndUpdate(
      { _id: groupId },
      { $pull: { members: { $in: membersToKick } } },
      { returnDocument: "after" },
    );

    if (!newData) {
      return res
        .status(404)
        .json({ message: "Error while updating the members list in DB" });
    }

     const rawResp=await Promise.all(removationPromises);
    const resp = rawResp.filter((item) => item !== null);

    return res
      .status(200)
      .json({ message: "Members are removed successfully", data: newData,removedMembers:resp });
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

const updateIcon = async function (req, res) {
  try {
    const { groupId } = req.params;
    const { iconUrl } = req.body;
    const user = req.user;

    if (!groupId) {
      return res.status(400).json({ message: "Provide the groupId properly" });
    }

    const updatedData = await Group.findOneAndUpdate(
      {
        $or: [
          { _id: groupId, members: user._id },
          { _id: groupId, admin: user._id },
        ],
      },
      {
        $set: { groupIcon: iconUrl },
      },
      { returnDocument: "after" },
    );

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
  updateIcon,
  groupInvitationsToUser,
  groupInvitationAcceptance,
  groupInvitationRejection,
  rejectedInvitations,
  acceptRejectedInvitation,
  allGroups,
  getGroupMessages,
  createGroupMessages
};

import mongoose from "mongoose";

const groupReqSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    invitedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);


groupReqSchema.index({groupId:1,invitedUserId:1},{unique:true})

const groupRequest= mongoose.model("GroupRequest", groupReqSchema);

export default groupRequest;
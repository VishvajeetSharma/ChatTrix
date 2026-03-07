import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
  },
  image: {
    type: String,
  },
},
  {
    timestamps: true
  }
);

const Message = mongoose.model("Messages", messageModel);

export default Message;

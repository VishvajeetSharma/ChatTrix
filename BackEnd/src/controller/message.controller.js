import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUsersId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUsersId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log(`Error in getUsersForSidebar: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const getMessages = async (req, res) => {
  try {
    const otherUserId = req.params.id;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: senderId, recipient: otherUserId },
        { sender: otherUserId, recipient: senderId }
      ]
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log(`Error in getMessages: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;
    const { text, image } = req.body;

    let imageUrl;
    if (image) {
      // Upload the image to Cloudinary and get the URL
      const uploadedImage = await cloudinary.uploader.upload(image)
      imageUrl = uploadedImage.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });
    await newMessage.save();

    // Todo: Real time Functionality goes here using socket.io

  } catch (error) {
    console.log(`Error in sendMessage: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";
import Match from "../models/matches.model.js";

export const sendMessage = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { message } = req.body;

  try {
    const user = await User.findById(userId);
    const matchedUser = await User.findById(id);

    const match = await Match.findOne({
      $or: [
        { userId: userId, matchedUserId: id },
        { userId: id, matchedUserId: userId },
      ],
    });

    if (!match) {
      return res
        .status(400)
        .json({ code: 0, message: "You are not matched with this user" });
    }

    if (id === userId) {
      return res
        .status(400)
        .json({ code: 0, message: "You cannot send a message to yourself" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, id] },
    }).populate({
      path: "messages",
      populate: {
        path: "senderId",
        model: "User",
      },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [userId, id],
      });
      await conversation.save();
    }

    const newMessage = new Message({
      senderId: userId,
      recieverId: id,
      message,
    });
    await newMessage.save();

    conversation.messages.push(newMessage._id);
    await conversation.save();

    if (!user.conversations.includes(conversation._id)) {
      user.conversations.push(conversation._id);
    }
    if (!matchedUser.conversations.includes(conversation._id)) {
      matchedUser.conversations.push(conversation._id);
    }
    await Promise.all([user.save(), matchedUser.save()]);

    return res.status(200).json({
      code: 1,
      message: "Message sent successfully",
      conversation: {
        _id: conversation._id,
        participants: conversation.participants,
        messages: conversation.messages.map((msg) => ({
          _id: msg._id,
          message: msg.message,
        })),
      },
    });
  } catch (error) {
    console.error("Error in sending message:", error);
    return res
      .status(500)
      .json({ code: 0, message: "Error in sending message" });
  }
};

export const getAllMessages = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    const user = await User.findById(userId).select("-password");
    const matchedUser = await User.findById(id).select("-password");

    if (!user || !matchedUser) {
      return res.status(404).json({ code: 0, message: "User(s) not found" });
    }

    const match = await Match.findOne({
      $or: [
        { userId: userId, matchedUserId: id },
        { userId: id, matchedUserId: userId },
      ],
    });

    if (!match) {
      return res
        .status(400)
        .json({ code: 0, message: "You are not matched with this user" });
    }

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, id] },
    });

    if (!conversation) {
      return res
        .status(404)
        .json({ code: 0, message: "No conversation found" });
    }
    const messages = conversation.messages;

    return res.status(200).json({
      code: 1,
      message: "Messages retrieved successfully",
      messages,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ code: 0, message: "Error in retrieving messages" });
  }
};

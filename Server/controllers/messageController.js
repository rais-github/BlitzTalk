import asyncHandler from "express-async-handler";
import ExpressError from "../utils/ExpressError.js";
import Message from "../models/messageSchema.js";
import User from "../models/userSchema.js";
import Chat from "../models/chatSchema.js";

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new ExpressError(404, "Chat not found!");
  }
  if (chat.users.includes(req.user._id) || chat.admins.includes(req.user._id)) {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.status(200).json(messages);
  } else {
    throw new ExpressError(403, "Unauthorized Access!");
  }
});
//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new ExpressError(404, "Chat not found!");
  }

  if (
    !chat.users.includes(req.user._id) &&
    !chat.admins.includes(req.user._id)
  ) {
    throw new ExpressError(403, "Unauthorized Access!");
  }

  const newMessage = await Message.create({
    chat: chatId,
    sender: req.user._id,
    content,
  });

  await newMessage.populate("sender", "name pic");
  await newMessage.populate("chat");
  await User.populate(newMessage, {
    path: "chat.users",
    select: "name pic email",
  });

  await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage });

  res.status(201).json(newMessage);
});

export { allMessages, sendMessage };

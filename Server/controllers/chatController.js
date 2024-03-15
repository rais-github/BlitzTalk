import asyncHandler from "express-async-handler";
import ExpressError from "../utils/ExpressError.js";
import User from "../models/userSchema.js";
import Chat from "../models/chatSchema.js";

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(result);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected

const createGroupChat = asyncHandler(async (req, res) => {
  try {
    const { users: usersString, name } = req.body;
    const users = JSON.parse(usersString);
    if (!users || !name) {
      return res
        .status(400)
        .json({ message: "Please provide values for all required fields" });
    }

    if (users.length < 2) {
      return res
        .status(400)
        .json("A minimum of two users is required to create a group chat");
    }
    console.log(Array.isArray(users));
    users.push(req.user);

    const groupChat = await Chat.create({
      chatName: name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.error("Error creating group chat:", error.message);
    res.status(500).json({ message: "Error creating group chat" });
  }
});

//@description     Rename Group Chat
//@route           POST /api/chat/rename
//@access          Protected

const renameGroup = asyncHandler(async (req, res, next) => {
  try {
    const { chatId, chatName } = req.body;
    const userId = req.user._id;
    const chat = await Chat.findById(chatId);
    // console.log("admin", chat.groupAdmin);
    // console.log("loggedIn", userId);
    if (!chat) {
      throw new ExpressError(404, "No Such Chat Available");
    }

    if (chat.groupAdmin.toString() !== userId.toString()) {
      throw new ExpressError(403, "You are not authorized to rename the group");
    }
    const renamedGroup = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(renamedGroup);
  } catch (err) {
    next(err);
  }
});

// @desc    Add user to Group
// @route   PUT /api/chat/groupadd
// @access  Protected

const addToGroup = asyncHandler(async (req, res, next) => {
  const { chatId, userId } = req.body;

  try {
    const loggedInUser = req.user._id;

    const currentChat = await Chat.findById(chatId);

    if (!currentChat) {
      throw new ExpressError(404, "No Such Chat Available");
    }

    const groupAdministrator = currentChat.groupAdmin;

    if (groupAdministrator.toString() !== loggedInUser.toString()) {
      throw new ExpressError(
        403,
        "You are not authorized to add users to the group"
      );
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(updatedChat);
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
    next(error);
  }
});

// @desc    Remove User from group
// @route   PUT /api/chat/groupremove
// @access  Protected

const removeFromGroup = asyncHandler(async (req, res, next) => {
  const { chatId, userId } = req.body;

  try {
    const loggedInUser = req.user._id;

    const currentChat = await Chat.findById(chatId);

    if (!currentChat) {
      throw new ExpressError(404, "No Such Chat Available");
    }

    const groupAdministrator = currentChat.groupAdmin;

    if (groupAdministrator.toString() !== loggedInUser.toString()) {
      throw new ExpressError(
        403,
        "You are not authorized to add users to the group"
      );
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(updatedChat);
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
    next(error);
  }
});

export {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
};
//test route

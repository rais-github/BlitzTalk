import asyncHandler from "express-async-handler";
import ExpressError from "../utils/ExpressError.js";
import User from "../models/userSchema.js";
import generateToken from "../utils/generateToken.js";

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    return next(new ExpressError(400, "Please Enter all the fields"));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(403);
    return next(new ExpressError(403, "User Already registered"));
  }

  const user = await User.create({ name, email, password, pic });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    return next(new ExpressError(400, "Failed to create user"));
  }
});

const allUsers = asyncHandler(async (req, res) => {
  res.send("Hello");
});

const authUser = asyncHandler(async (req, res) => {
  res.send("Hello");
});

export { registerUser, allUsers, authUser };

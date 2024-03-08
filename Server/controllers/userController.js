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

const allUsers = asyncHandler(async (req, res, next) => {
  const key = req.query.search;
  try {
    const query = key
      ? {
          $or: [
            { name: { $regex: key, $options: "i" } },
            { email: { $regex: key, $options: "i" } },
          ],
        }
      : {};
    const users = await User.find(query).find({ _id: { $ne: req.user._id } });
    users.length === 0
      ? res.status(404).send("No Such User")
      : res.status(200).json(users);
  } catch (error) {
    res.status(500);
    return next(new ExpressError(500, "Internal Server Error"));
  }
});

const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    return next(new ExpressError(401, "Unauthorised"));
  }
});

export { registerUser, allUsers, authUser };

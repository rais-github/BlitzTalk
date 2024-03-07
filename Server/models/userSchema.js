import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      // required: true,
      default:
        "https://images.pexels.com/photos/17604370/pexels-photo-17604370/free-photo-of-beautiful-woman-sitting-under-a-tree.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestaps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

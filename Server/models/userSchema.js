import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const defaultImg =
  "https://images.pexels.com/photos/17604370/pexels-photo-17604370/free-photo-of-beautiful-woman-sitting-under-a-tree.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: String,
      default: defaultImg,
      set: function (v) {
        return v && v.trim() !== "" ? v : defaultImg;
      },
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestaps: true }
);
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified()) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model("User", userSchema);

export default User;

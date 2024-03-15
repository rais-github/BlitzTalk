import express from "express";
import {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} from "../controllers/chatController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
const Router = express.Router();

Router.route("/").post(isLoggedIn, accessChat).get(isLoggedIn, fetchChats);
Router.post("/group", isLoggedIn, createGroupChat);
Router.patch("/rename", isLoggedIn, renameGroup);
Router.put("/groupremove", isLoggedIn, removeFromGroup);
Router.put("/groupadd", isLoggedIn, addToGroup);
export default Router;
<<<<<<< HEAD
=======
//comment
//comment by siddhant
>>>>>>> 1fb74f43a1d5da1c002e5c34e9b3e227d88a9aa8

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
//comment
//comment by siddhant
import express from "express";
import {
  accessChat,
  //   fetchChats,
  //   createGroupChat,
  //   removeFromGroup,
  //   addToGroup,
  //   renameGroup,
} from "../controllers/chatController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
const Router = express.Router();
Router.route("/").post(isLoggedIn, accessChat);
export default Router;

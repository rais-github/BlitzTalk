import express from "express";
import {
  accessChat,
  fetchChats,
  createGroupChat,
  //   removeFromGroup,
  //   addToGroup,
  //   renameGroup,
} from "../controllers/chatController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
const Router = express.Router();

Router.route("/").post(isLoggedIn, accessChat).get(isLoggedIn, fetchChats);
Router.post("/group", isLoggedIn, createGroupChat);
// router.route("/rename").put(isLoggedIn, renameGroup);
// router.route("/groupremove").put(isLoggedIn, removeFromGroup);
// router.route("/groupadd").put(isLoggedIn, addToGroup);
export default Router;

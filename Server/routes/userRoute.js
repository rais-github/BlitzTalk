import express from "express";
import {
  registerUser,
  authUser,
  allUsers,
} from "../controllers/userController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
const Router = express.Router();

Router.route("/").post(registerUser).get(isLoggedIn, allUsers);
Router.post("/login", authUser);

export default Router;

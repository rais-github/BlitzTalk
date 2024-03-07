import express from "express";
import {
  registerUser,
  authUser,
  allUsers,
} from "../controllers/userController.js";

const Router = express.Router();

Router.route("/").post(registerUser).get(allUsers);
Router.post("/login", authUser);

export default Router;

import express from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { allMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.route("/:chatId").get(isLoggedIn, allMessages);
router.route("/").post(isLoggedIn, sendMessage);

export default router;

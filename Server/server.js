import express from "express";
import dotenv from "dotenv";
import { Server as socketIOServer } from "socket.io"; // Corrected import statement
import mongoose from "mongoose";
import cors from "cors";
import ExpressError from "./utils/ExpressError.js";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import messageRoute from "./routes/messageRoute.js";
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/BlitzTalk";

const app = express();
app.use(express.json());
app.use(cors());

main()
  .then(() => {
    console.log("Connection to DB successful");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Welcome Home");
});

app.use("/api/chat", chatRoute);
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).send(message);
});

const server = app.listen(PORT, () => {
  console.log(`Server responding on Port: ${PORT}`);
});

// Use the correct import to create the socket.io server instance
const io = new socketIOServer(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("New connection");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
  socket.on("join", (data) => {
    console.log(data);
    socket.join(data.room);
  });
  socket.on("message", (data) => {
    console.log(data);
    socket.to(data.room).emit("message", data);
  });
});

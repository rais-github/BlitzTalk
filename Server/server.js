import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import ExpressError from "./utils/ExpressError.js";
import userRoute from "./routes/userRoute.js";
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/BlitzTalk";

const app = express();
app.use(express.json());
app.use(cors("*"));

main()
  .then(() => {
    console.log("Connection to DB successful");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit the process if the database connection fails
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Welcome Home");
});

app.use("/api/user", userRoute);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).send(message);
});

app.listen(PORT, () => {
  console.log(`Server responding on Port: ${PORT}`);
});

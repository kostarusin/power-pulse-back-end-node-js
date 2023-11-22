import express from "express";
import logger from "morgan";
import cors from "cors";
import "dotenv/config";
import swaggerUiExpress from "swagger-ui-express";
import * as fs from 'fs';
const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf8'));

import { Server } from "socket.io";
import http from "http";
import User from "./models/User.js";
import { Diary } from "./models/Diary.js";
import Exercise from "./models/Exercise.js";

import authRouter from "./routes/api/auth-router.js";
import productRouter from "./routes/api/products-router.js";
import diaryRouter from "./routes/api/diary-router.js";
import exerciseRouter from "./routes/api/exercises-router.js";
import statiscticsRouter from "./routes/api/statistics-router.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";


const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("New frontend connection");

  socket.on("getUsers", async () => {
    try {
      const allUsers = await User.find();
      io.emit("totalUsers", allUsers.length);
    } catch (error) {
      console.error("Error querying MongoDB:", error.message);
    }
  });
  socket.on("getAllBurnedCalories", async () => {
    try {
      const allCalories = await DoneExecises.aggregate([
        { $unwind: "$doneExercises" },
        {
          $group: {
            _id: null,
            totalCalories: { $sum: "$doneExercises.calories" },
          },
        },
      ]);
      const totalCalories =
        allCalories.length > 0 ? result[0].totalCalories : 0;

      io.emit("totalBurnedCalories", totalCalories);
    } catch (error) {
      console.error("Error querying MongoDB:", error.message);
    }
  });
  socket.on("getAllVideoExercises", async () => {
    try {
      const allExercises = await Exercise.find();
      io.emit("totalUsers", allExercises.length);
    } catch (error) {
      console.error("Error querying MongoDB:", error.message);
    }
  });
  socket.on("getAllExercisesTime", async () => {
    try {
      const allTime = await DoneExecises.aggregate([
        { $unwind: "$doneExercises" },
        { $group: { _id: null, totalTime: { $sum: "doneExercises.time" } } },
      ]);

      const totalTime = allTime.length > 0 ? result[0].totalTime : 0;
      io.emit("totalExercisesTime", totalTime);
    } catch (error) {
      console.error("Error querying MongoDB:", error.message);
    }
  });
  socket.on("getAllDoneExercises", async () => {
    try {
      const allDoneExercises = await DoneExecises.find();

      io.emit("totalDoneExercises", allDoneExercises.length);
    } catch (error) {
      console.error("Error querying MongoDB:", error.message);
    }
  });
});


app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use('/api', statiscticsRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/diary", diaryRouter);
app.use("/api/exercises", exerciseRouter);
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;

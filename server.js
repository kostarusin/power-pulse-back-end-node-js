import mongoose from "mongoose";
import app from "./app.js";
//soket
import { Server } from "socket.io";
import { createServer } from "http";
import User from "./models/User.js";
import { DoneExecises } from "./models/Diary.js";
import Exercise from "./models/Exercise.js";

const httpServer = createServer();

const io = new Server(httpServer, {
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
            { $group: { _id: null, totalCalories: { $sum: "$doneExercises.calories" } } }
        ]);
        const totalCalories = allCalories.length > 0 ? result[0].totalCalories : 0;

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
        { $group: {_id: null, totalTime: {$sum: "doneExercises.time" }}}
      ])

      const totalTime = allTime.length > 0 ? result[0].totalTime : 0;
      io.emit("totalExercisesTime", totalTime.length)
      
    } catch (error) {
      console.error("Error querying MongoDB:", error.message);
    }
  })
  socket.on("getAllDoneExercises", async () => {
    try {
      const allDoneExercises = await DoneExecises.find()

      io.emit("totalDoneExercises", allDoneExercises.length)
      
    } catch (error) {
      console.error("Error querying MongoDB:", error.message);
    }
  })

});

httpServer.listen(5050, () => {
  console.log("listening on *:5050");
});

const { DB_URI, PORT = 3000 } = process.env;

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server running. Use your API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

import User from "../models/User.js";
import Exercise from "../models/Exercise.js";
import { Diary } from "../models/Diary.js";
import { ctrlWrapper } from "../decorators/index.js";

const statistics = async (req, res) => {
    const allUsers = await User.find();
    const totalUsers = allUsers.length;

    const allCalories = await Diary.aggregate([
        { $unwind: "$doneExercises" },
        { 
            $group: { 
                _id: null, 
                totalCalories: { $sum: "$doneExercises.calories" },
                totalTime: { $sum: "$doneExercises.time" }
            } 
        }
    ]);

    const allExercises = await Exercise.find();
    const totalExercises = allExercises.length;

    const allDoneExercises = await Diary.find({ doneExercises: { $exists: true } })
    const totalDoneExercises = allDoneExercises.length;

    res.status(200).json({
        totalUsers: totalUsers,
        totalBurnedCalories: allCalories[0].totalCalories, 
        totalExerciseTime: allCalories[0].totalTime, 
        totalExercises: totalExercises,
        totalDoneExercises: totalDoneExercises
    });
}
export default {
    statistics: ctrlWrapper(statistics),
}
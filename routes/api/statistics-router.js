import express from "express";
import statistics from "../../controllers/statistics-controller.js";

const statiscticsRouter = express.Router();

statiscticsRouter.get('/statistics', statistics.statistics)

export default statiscticsRouter;
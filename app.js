import express from "express";
import logger from "morgan";
import cors from "cors";
import "dotenv/config";
import swaggerUiExpress from "swagger-ui-express";
import * as fs from 'fs';
const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf8'));

import * as swagger from "./swagger.json" assert { type: "json" };
import authRouter from "./routes/api/auth-router.js";
import productRouter from "./routes/api/products-router.js";
import diaryRouter from "./routes/api/diary-router.js";
import exerciseRouter from "./routes/api/exercises-router.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

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


import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
const app = express();
import cors from "cors";
import projectRoutes from "./routes/project.routes.js";
import aiRoutes from "./routes/ai.routes.js";

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/ai", aiRoutes);

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello world!!"));


export default app;

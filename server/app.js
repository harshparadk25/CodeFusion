
import express from "express";
import morgan from "morgan";
import router from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use("/users", router);

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello world!!"));

export default app;


import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app.js";
import connect from "./db/db.js";




const port = process.env.PORT || 3000;

connect();


const server = http.createServer(app);
server.listen(port, () => console.log(`🚀 Server running on port ${port}`));
export default server;

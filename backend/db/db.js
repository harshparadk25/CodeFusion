import mongoose from "mongoose";


function connect(){
    return mongoose.connect(process.env.MONGO_URL, {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        heartbeatFrequencyMS: 10000,
    }).then(()=>{
        console.log("Database connected successfully");
    }).catch((err)=>{
        console.error("Database connection failed:", err);
    })
}

export default connect;


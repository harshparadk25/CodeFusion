import mongoose from "mongoose";


function connect(){
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("Database connected successfully");
    }).catch((err)=>{
        console.error("Database connection failed:", err);
    })
}

export default connect;


import mongoose, { mongo } from 'mongoose';


const projectScheme = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        lowercase: true,
        unique: [true, "Project name must be unique"],
        trim:true,
    },
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ]
})

const Project = mongoose.model('Project', projectScheme);

export default Project;
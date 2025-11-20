import mongoose from 'mongoose';


const messageSchema = new mongoose.Schema({
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
        required:true,
        index:true,
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        index:true,
    },
    type:{
        type:String,
        enum:['text','ai','file'],
        default:'text',
    },
    text:{
        type:String,
        trim:true,
        default:'',
    },
    file:{
        name:String,
        content:String,
    },
    meta:{
        type:Object,
        default:{},
    },
},{ timestamps: true}
);

messageSchema.index({ project: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
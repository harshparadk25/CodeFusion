import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    trim: true,
    lowercase: true,
  },
  password: {
  type: String,
  required: true,
  select: false,
  },
  profession:{
    type: String,
    trim: true,
    default: "",
  },
  bio:{
    type: String,
    trim: true,
    default: "",
    maxlenghth: 250,
  },
  skills:{
    type: [String],
    default: []
  },
  profilePicture:{
    type: String,
    default: function(){
      const seed = this.username || 'default';
      return `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(seed)}`
    }
  },

});


userSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};


userSchema.statics.isValidPassword = async function (password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
};


userSchema.methods.generateAuthToken = function () {
  return jwt.sign({_id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: "2d" });
};

const User = mongoose.model("user", userSchema);
export default User;

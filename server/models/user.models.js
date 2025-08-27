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
}

});

// hash password
userSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// check password
userSchema.statics.isValidPassword = async function (password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
};

// generate token for a specific user
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ email: this.email }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

const User = mongoose.model("user", userSchema);
export default User;

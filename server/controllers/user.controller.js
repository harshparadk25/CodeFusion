import User from "../models/user.models.js";
import dotenv from "dotenv";
dotenv.config();
import { validationResult } from "express-validator";
import { createUser, getAllUsers } from "../services/user.service.js";
import redisClient from "../services/redis.service.js";


export const createUserController = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  try {
    const { username, email, password } = req.body;
const user = await createUser({ username, email, password });

    const token = await user.generateAuthToken();
    delete user._doc.password;
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const loginUserController = async (req, res) => {
  const error = validationResult(req);

  if(!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isValid = await User.isValidPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = user.generateAuthToken();

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({ user: userObj, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
};

export const getUserProfileController = async (req, res) => {
  console.log(req.user);
  res.status(200).json({ user: req.user });
  
}

export const logoutUserController = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1]
    ;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    await redisClient.set(`blacklisted_${token}`, "true", "EX", 3600);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
}

export const getAllUsersController = async (req, res) => {
  try {

    const loggedInUser = req.user;
    const users = await getAllUsers({loggedInUser});
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
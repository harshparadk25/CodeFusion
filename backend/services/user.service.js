import { query } from "express-validator";
import User from "../models/user.models.js";

export const createUser = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    throw new Error("Username, email and password are required");
  }
  const hashedPassword = await User.hashPassword(password);
  const user = await User.create({ username, email, password: hashedPassword });
  return user;
};

export const getAllUsers = async ({loggedInUser}) => {
  try {
    const users = await User.find({
      _id: { $ne: loggedInUser._id }
    });
    return users;
  } catch (error) {
    throw error;
  }
};

export const searchUser = async({query,loggedInUser})=>{
  try {
    if(!query || query.trim() === ""){
      return [];
    }

    const searchFilter = {
      $and:[
        {_id: { $ne: loggedInUser._id }},
        {
          $or: [
            { username: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    };
    const users = await User.find(searchFilter)
    .select("username email");
    return users;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const updateUserProfile = async ({ userId, updateData }) => {
  try {
    const { username, profession, bio, skills } = updateData;

    const updateFields = {};
    if (username) updateFields.username = username.trim();
    if (profession) updateFields.profession = profession.trim();
    if (bio) updateFields.bio = bio.trim();
    if (Array.isArray(skills)) updateFields.skills = skills;

    Object.keys(updateFields).forEach(
      (key) => updateFields[key] === "" && delete updateFields[key]
    );
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error(error.message || "Failed to update profile");
  }
};
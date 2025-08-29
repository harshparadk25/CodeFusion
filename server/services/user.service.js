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
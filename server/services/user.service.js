import User from "../models/user.models.js";

export const createUser = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    throw new Error("Username, email and password are required");
  }
  const hashedPassword = await User.hashPassword(password);
  const user = await User.create({ username, email, password: hashedPassword });
  return user;
};


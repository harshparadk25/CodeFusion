import mongoose from "mongoose";
import Project from "../models/project.model.js";


export const createProject = async ({ name, userId }) => {
  if (!name) throw new Error("Project name is required");
  if (!userId) throw new Error("User ID is required");

  try {
    const project = await Project.create({
      name,
      owner: userId,
      users: [userId]
    });
    return project;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Project name must be unique");
    }
    throw error;
  }
};



export const getAllProjectsByUserId = async ({ userId }) => {
  if (!userId) throw new Error("User ID is required");

  const allProjects = await Project.find({ users: userId });
  return allProjects;
};


export const addUsersToProject = async ({ projectId, users, userId }) => {
  if (!projectId || !users || users.length === 0) {
    throw new Error("Project ID and User IDs are required");
  }

  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found");

  
  if (project.owner.toString() !== userId.toString()) {
    throw new Error("Only project owner can add users");
  }

  const updated = await Project.findByIdAndUpdate(
    projectId,
    { $addToSet: { users: { $each: users } } },
    { new: true }
  );

  return updated;
};



export const getProjectById = async ({ projectId, userId }) => {
  if (!projectId || !userId) throw new Error("Project ID and User ID are required");

  const project = await Project.findOne({
    _id: projectId,
    users: userId
  }).populate("users");

  return project;
};



export const removeUsersFromProject = async ({ projectId, users, userId }) => {
  if (!projectId || !users || users.length === 0) {
    throw new Error("Project ID and User IDs are required");
  }

  const memberId = users[0];

  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found");

 
  if (project.owner.toString() !== userId.toString()) {
    throw new Error("Only project owner can remove members");
  }

 
  if (memberId.toString() === userId.toString()) {
    throw new Error("Owner cannot be removed from project");
  }

  if (!project.users.includes(memberId)) {
    throw new Error("User is not a member of this project");
  }

  const updated = await Project.findByIdAndUpdate(
    projectId,
    { $pull: { users: memberId } },
    { new: true }
  ).populate("users");

  return updated;
};



export const deleteProjectById = async ({ projectId, userId }) => {
  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found");

  if (project.owner.toString() !== userId.toString()) {
    throw new Error("Only the project owner can delete this project");
  }

  await Project.findByIdAndDelete(projectId);
  return { message: "Project deleted successfully" };
};

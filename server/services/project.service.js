import mongoose from "mongoose";
import Project from "../models/project.model.js";




export const createProject = async ({name,userId}) => {
    if(!name){
        throw new Error("Project name is required");
    }
    if(!userId){
        throw new Error("User ID is required");
    }
    let project;
   try {
    project = await Project.create({name,users:[userId]});
   } catch (error) {
    if (error.code === 11000) {
        throw new Error("Project name must be unique");
    } else {
        throw error;
    }
    
   }

    return project;
}

export const getAllProjectsByUserId = async({userId})=>{
    if(!userId){
        throw new Error("User ID is required");
    }

    try {
        const allProjects = await Project.find({ users: userId });
        return allProjects;
    } catch (error) {
        throw error;
    }
}

export const addUsersToProject = async({projectId, users,userId})=>{
    if(!projectId || !users || users.length === 0){
        throw new Error("Project ID and User IDs are required");
    }

     if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

     if (!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error("Invalid userId(s) in users array")
    }

     if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userId")
    }

     const project = await Project.findOne({
        _id: projectId,
        users: userId
    })

    console.log("Project found:", project);

    if(!project){
        throw new Error("Project not found or you don't have permission to add users");
    }

    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { $addToSet: { users: { $each: users } } },
        { new: true }
    );

    console.log("Updated project:", updatedProject);

    if (!updatedProject) {
        throw new Error("Failed to add users to project");
    }

    return updatedProject;
}

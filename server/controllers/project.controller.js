import Project from "../models/project.model.js";
import { addUsersToProject, createProject, getAllProjectsByUserId, getProjectById } from "../services/project.service.js";
import { validationResult } from "express-validator";
import User from "../models/user.models.js";


export const createProjectController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name } = req.body;
    const userId = req.user._id || req.user.id;


    const newProject = await createProject({ name, userId });

    return res.status(201).json(newProject);

  } catch (error) {
    console.error("Error creating project:", error);

    // Handle duplicate project name error
    if (error.message.includes("Project name must be unique")) {
      return res.status(400).json({ message: "Project name must be unique" });
    }

    return res.status(500).json({ message: "Server error", error: error.message });
  }

};

export const getAllProjectsController = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const allProjects = await getAllProjectsByUserId({ userId });
    return res.status(200).json(allProjects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });

  }
};


export const addUsersToProjectController = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { projectId, users } = req.body;

    const loggedIn = await User.findById(req.user._id);
    if (!loggedIn) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updatedProject = await addUsersToProject({ projectId, users ,userId: loggedIn._id });
    return res.status(200).json(updatedProject);

  } catch (error) {
    console.error("Error adding users to project:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const getProjectByIdController= async(req,res)=>{

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }

  try {
    const {projectId} = req.params;

    const project = await getProjectById({projectId, userId: req.user._id});
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
    
  }
}
import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../context/user.context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "../config/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
const [projectToDelete, setProjectToDelete] = useState(null);

  const navigate = useNavigate();

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/projects/create", { name: projectName });
      toast.success("Project created successfully!");
      const response = await axios.get("/projects/all");
      setProjects(response.data);
      setTimeout(() => {
        setLoading(false);
        setOpen(false);
        setProjectName("");
      }, 1500);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`/projects/delete/${projectId}`);
      const response = await axios.get("/projects/all");
      setProjects(response.data);
      console.log(response.data);
      toast.success("Project deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete project");
    }
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/projects/all");
        setProjects(response.data);
        console.log(response.data);
        toast.success("Projects fetched successfully");
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch projects");
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">

      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-indigo-900 opacity-40"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "300% 300%" }}
      />


      <div className="relative z-10">
        <header className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            🚀 CodeFusion Dashboard
          </h1>
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer group flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1f2937] border border-gray-700
             hover:bg-[#272f3a] hover:border-indigo-500 transition-all duration-300"
          >
            <span className="text-gray-300 text-lg font-semibold group-hover:text-white transition">
              Go Back
            </span>

            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-transform duration-300 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </div>


        </header>

        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-100">Your Projects</h2>
            <Button
              onClick={() => setOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition"
            >
              + New Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <motion.div
                  key={project._id}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Card className="bg-gray-900/80 border border-purple-800/40 shadow-lg hover:shadow-purple-500/40 transition rounded-2xl">
  <CardContent className="p-5 flex flex-col gap-4">

    {/* Top Buttons Row */}
    <div className="flex justify-between items-center">

      {/* Discussion Button */}
      <Button
        onClick={() => navigate(`/projects`, { state: { project } })}
        className="px-4 py-1.5 rounded-lg text-blue-300 border border-blue-600/40 
                   bg-blue-600/10 backdrop-blur-sm
                   hover:bg-blue-600/20 hover:text-blue-200 hover:border-blue-500 
                   transition-all duration-300 text-sm font-semibold shadow-md"
      >
        Discussion
      </Button>

      <Button className="px-4 py-1.5 rounded-lg text-blue-300 border border-blue-600/40 
                   bg-blue-600/10 backdrop-blur-sm
                   hover:bg-blue-600/20 hover:text-blue-200 hover:border-blue-500 
                   transition-all duration-300 text-sm font-semibold shadow-md"
                   onClick={() => navigate(`/project/detail/${project._id}`, { state: { project } })}
      >
        Project Details
      </Button>

      {/* Delete Button */}
      <Button
  onClick={(e) => {
    e.stopPropagation();
    setProjectToDelete(project._id);  
    setConfirmDeleteOpen(true);      
  }}
  className="px-3 py-1.5 rounded-lg text-red-300 border border-red-600/40 
             bg-red-600/10 backdrop-blur-sm
             hover:bg-red-600/20 hover:text-red-200 hover:border-red-500 
             transition-all duration-300 text-sm font-semibold shadow-md"
>
  Delete
</Button>

    </div>

    {/* Project Name */}
    <h3 className="text-xl font-bold text-purple-300 tracking-wide">
      {project.name}
    </h3>

    {/* Members Count */}
    <p className="text-sm text-gray-300 flex items-center gap-2">
      <i className="ri-user-line text-purple-400"></i>
      {project.users?.length || 0} members
    </p>

  </CardContent>
</Card>

                </motion.div>
              ))
            ) : (
              <p className="text-gray-400">No projects yet. Create one!</p>
            )}
          </div>
        </main>

        <Dialog open={open} onOpenChange={setOpen}>
          <AnimatePresence>
            {open && (
              <DialogContent>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-950/90 backdrop-blur-xl border border-gray-800 p-6 rounded-2xl shadow-xl max-w-md w-full"
                >
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-purple-300">
                      ✨ Create New Project
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateProject} className="space-y-4 mt-4">
                    <Input
                      type="text"
                      placeholder="Enter project name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="bg-gray-900 border-gray-700 text-white"
                      required
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 rounded-xl shadow-lg hover:scale-105 transition"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Project"}
                    </Button>
                  </form>
                </motion.div>
              </DialogContent>
            )}
          </AnimatePresence>
        </Dialog>

        <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
  <DialogContent className="bg-gray-950/90 backdrop-blur-xl border border-gray-800 p-6 rounded-2xl shadow-xl max-w-sm">

    <DialogHeader>
      <DialogTitle className="text-xl font-bold text-red-400">
        ⚠ Are you sure?
      </DialogTitle>
    </DialogHeader>

    <p className="text-gray-300 mt-2">
      Do you really want to delete this project?  
      This action cannot be undone.
    </p>

    <div className="flex justify-end gap-4 mt-6">

      <Button
        onClick={() => setConfirmDeleteOpen(false)}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
      >
        Cancel
      </Button>

      <Button
        onClick={async () => {
          await deleteProject(projectToDelete);
          setConfirmDeleteOpen(false);
          setProjectToDelete(null);
        }}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
      >
        Delete
      </Button>

    </div>

  </DialogContent>
</Dialog>




      </div>
    </div>
  );
};

export default Dashboard;

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

const Home = () => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/projects/create", { name: projectName });
      toast.success("Project created successfully!");
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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/projects/all");
        setProjects(response.data);
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
          <div onClick={() => setOpenProfile(true)} className="flex items-center gap-4">
            <span className="text-white font-medium text-lg">
              {user?.username}
            </span>
            <img
              src={user?.avatar || "https://api.dicebear.com/7.x/identicon/svg"}
              alt="avatar"
              className="w-10 h-10 rounded-full border border-gray-700"
            />
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
                  <Card onClick={() => navigate(`/projects`, { state: { project } })} className="bg-gray-900/80 border border-purple-800/50 shadow-lg hover:shadow-purple-500/30 transition rounded-2xl">
                    <CardContent className="p-5 flex flex-col gap-3">
                      <h3 className="text-lg font-bold text-purple-300">{project.name}</h3>
                      <p className="text-sm text-gray-300 flex items-center gap-2">
                        <i className="ri-user-line"></i>
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

        <Dialog open={openProfile} onOpenChange={setOpenProfile}>
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
                  👤 User Profile
                </DialogTitle>
              </DialogHeader>

              <div className="flex items-center gap-3 my-4">
                <img
                  src={user?.avatar || "https://api.dicebear.com/7.x/identicon/svg"}
                  alt="avatar"
                  className="w-12 h-12 rounded-full border border-gray-700"
                />
                <span className="text-white font-medium text-lg">
                  {user?.username}
                </span>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={async () => {
                    try {
                      await axios.get("/users/logout")
                        .then(() => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("user");
                          toast.success("Logged out successfully");
                          setOpenProfile(false);
                          navigate("/login");
                        })
                        .catch((err) => {
                          toast.error(err.response?.data?.message || "Logout failed");
                        });
                    } catch (err) {
                      toast.error(err.response?.data?.message || "Logout failed");
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                >
                  Logout
                </Button>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default Home;

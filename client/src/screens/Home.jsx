import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../context/user.context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "../config/axios";
import { toast } from "sonner";

const Home = () => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/projects/create", { name: projectName });


      toast.success("Project created successfully!");

      console.log("Creating project:", projectName);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      
      <header className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold tracking-wide">🚀 CodeFusion Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">{user?.username}</span>
          <img
            src={user?.avatar || "https://api.dicebear.com/7.x/identicon/svg"}
            alt="avatar"
            className="w-10 h-10 rounded-full border border-gray-700"
          />
        </div>
      </header>

      
      <main className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Projects</h2>
          <Button
            onClick={() => setOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition"
          >
            + New Project
          </Button>
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
            <DialogTitle className="text-xl font-bold text-white">
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

    </div>
  );
};

export default Home;

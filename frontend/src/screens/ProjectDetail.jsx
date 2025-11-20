import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../config/axios";
import FileList from "../components/repo/FileList";
import FileUploader from "../components/repo/FileUploader";
import CommitList from "../components/repo/CimmitList";
import { initializeSocket } from "../config/socket";
import FileCreate from "../components/repo/FileCreate";
import { toast } from "sonner";


const ProjectDetail = () => {
  const { id: projectId } = useParams();
  const location = useLocation();
  const project = location.state?.project;
  const navigate = useNavigate();

  const [commits, setCommits] = useState([]);
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("files");

  const [showDialog, setShowDialog] = useState(false);
  const [deletedFileId, setDeletedFileId] = useState(null);
  const [deleteFileName, setDeleteFileName] = useState("");




  useEffect(() => {
    const fetchCommits = async () => {
      const res = await axiosInstance.get(`/repo/${projectId}/commits`);
      setCommits(res.data.items || []);
    };
    fetchCommits();
  }, [projectId]);

  

  useEffect(() => {
  const fetchFiles = async () => {
    const res = await axiosInstance.get(`/repo/${projectId}/files`);
    setFiles(res.data);
  };
  fetchFiles();
}, [projectId]);


  
  useEffect(() => {
    const socket = initializeSocket(projectId);

    socket.on("new-commit", (payload) => {
      setCommits((prev) => [payload.commit, ...prev]);
    });

    return () => socket.disconnect();
  }, [projectId,]);

  const handleUploadSuccess = async (data) => {
    if (data && data.commit) {
      setCommits((prev) => [data.commit, ...prev]);
    }

     try {
    const res = await axiosInstance.get(`/repo/${projectId}/files`);
    setFiles(res.data);   // 🔥 refresh file list
    toast.success("Files updated!");
  } catch (err) {
    console.log(err);
  }


  };

  const handleFileDelete = (fileId, filename) => {
  setDeletedFileId(fileId);
  setDeleteFileName(filename);
  setShowDialog(true);
};

const confirmDelete = async () =>{
  if (!deletedFileId) return;

  try {
    await axiosInstance.delete(`/repo/${projectId}/files/${deletedFileId}`,{data: { filename: deleteFileName }});
    setFiles((prev) => prev.filter((file) => file._id !== deletedFileId));
    toast.success(`Deleted file: ${deleteFileName}`);
    setShowDialog(false);
    setDeletedFileId(null);
    setDeleteFileName("");
  } catch (error) {
    console.error("Error deleting file:", error);
    toast.error("Failed to delete file.");
  }
}

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-indigo-900 opacity-40"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "300% 300%" }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
          <h1 className="text-3xl font-extrabold">🚀 {project?.name}</h1>

          <div
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1f2937] border border-gray-700"
          >
            <span className="text-lg">⬅ Back</span>
          </div>
        </header>

        {/* Main */}
        <main className="p-8 max-w-3xl mx-auto">

          {/* Upload */}
          <FileUploader projectId={projectId} onUploadSuccess={handleUploadSuccess} />

          <FileCreate 
   projectId={projectId} 
   onFileCreate={(newFile) =>
  setFiles(prev => [
    {
      _id: newFile.file._id,
      filename: newFile.file.name,   // FIX HERE
      path: newFile.file.path,
      uploadDate: new Date(),
    },
    ...prev
  ])
}
/>


          {/* Tabs */}
          <div className="flex gap-6 mt-6 border-b border-gray-700 pb-2">

            <button
              onClick={() => setActiveTab("files")}
              className={`pb-2 text-lg ${
                activeTab === "files"
                  ? "border-b-2 border-indigo-500 text-indigo-400"
                  : "text-black hover:text-gray-200"
              }`}
            >
              Files
            </button>

            <button
              onClick={() => setActiveTab("commits")}
              className={`pb-2 text-lg ${
                activeTab === "commits"
                  ? "border-b-2 border-indigo-500 text-indigo-400"
                  : "text-black hover:text-gray-200"
              }`}
            >
              Commits
            </button>

          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === "files" && (
              <FileList
                files={files}
                projectId={projectId}
                onFileDelete={handleFileDelete}
                onFileViewContent={(fileId, content, filename) =>
                  navigate(`/repo/${projectId}/files/${fileId}/content`, { state: { content, filename,projectId,fileId } })
                }
              />
            )}

            {activeTab === "commits" && (
              <CommitList commits={commits} />
            )}
          </div>

        </main>
        {/* Delete Confirmation Dialog */}
        {showDialog && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-2xl w-96 animate-fadeIn">
      <h3 className="text-xl font-bold mb-2 text-white">
        Delete File?
      </h3>

      <p className="text-gray-300 mb-4">
        Are you sure you want to delete <span className="text-white font-semibold">{deleteFileName}</span>?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowDialog(false)}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
        >
          Cancel
        </button>

        <button
          onClick={confirmDelete}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

      </div>

    </div>
  );
};

export default ProjectDetail;

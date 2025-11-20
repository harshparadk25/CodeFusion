import React from "react";
import axiosInstance from "../../config/axios";
import { toast } from "sonner";

const FileCreate = ({projectId, onFileCreate}) => {

    const [content, setContent] = React.useState("");
    const [filename, setFilename] = React.useState("newfile.txt");


    const createFile = async () => {
        try {
            const res = await axiosInstance.post(`/repo/${projectId}/files`, {
                filename,
          content,
          message: `Created file ${filename}`,
            });
            toast.success("File created successfully!");
            onFileCreate(res.data);
            setFilename("newfile.txt");
            setContent("");
        } catch (error) {
            console.error("Error creating file:", error);
            toast.error("Failed to create file.");
        }
    }
    return (
    <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 mt-6">
      <h2 className="text-xl font-bold mb-3">Create Text File</h2>

      <input
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg mb-3"
        placeholder="Filename e.g. example.txt"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 h-32 bg-gray-800 border border-gray-700 rounded-lg mb-3"
        placeholder="File content..."
      />

      <button
        onClick={createFile}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
      >
        Create File
      </button>
    </div>
  );
};

export default FileCreate;

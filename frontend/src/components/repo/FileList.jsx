import React from "react";
import axiosInstance from "../../config/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const FileList = ({ files, projectId, onFileDelete , onFileViewContent }) => {
  const navigate = useNavigate();
  if (!files || !Array.isArray(files)) {
    return (
      <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 mt-6">
        <h2 className="text-lg font-bold mb-4">Uploaded Files</h2>
        <p className="text-gray-500 text-sm">No files uploaded yet.</p>
      </div>
    );
  }

  const fileDownload = async (fileId, filename) => {
  try {
    const res = await axiosInstance.get(
      `/repo/${projectId}/files/${fileId}/download`,
      { responseType: "blob" }
    );

    const blob = new Blob([res.data]);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "download"; 
    a.click();

    window.URL.revokeObjectURL(url);

    toast.success("Downloaded!");
  } catch (error) {
    console.error("Error downloading file:", error);
    toast.error("Failed to download file.");
  }
};




  const ViewFileContent = async (fileId, filename) => {
    try {
      const res = await axiosInstance.get(
        `/repo/${projectId}/files/${fileId}/content`
      );
      const content = res.data.content;
      onFileViewContent(fileId, content, filename);
    } catch (error) {
      console.error("Error viewing file content:", error);
      toast.error("Failed to view file content.");
    }
  }

  return (
    <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 mt-6">
      <h2 className="text-lg font-bold mb-4">Uploaded Files</h2>

      <ul className="space-y-2">
  {files.map((file) => (
    <li
      key={file._id}
      className="flex justify-between items-center p-3 bg-gray-800 rounded-lg border border-gray-700"
    >
      {/* LEFT: File info */}
      <div className="flex-1 pr-4">
        <p className="font-semibold text-indigo-400 truncate max-w-xs">
          📄 {file?.filename || "Unknown file"}
        </p>

        <p className="text-xs text-gray-500">
          {file?.uploadDate
            ? new Date(file.uploadDate).toLocaleString()
            : "Unknown time"}
        </p>
      </div>

      
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => onFileDelete(file._id, file.filename)}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md"
        >
          Delete
        </button>

        <button
          onClick={() => fileDownload(file._id, file.filename)}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md"
        >
          Download
        </button>
        <button
          onClick={() => ViewFileContent(file._id, file.filename)}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          View Content
        </button>
      </div>
    </li>
  ))}
</ul>

    </div>
  );
};

export default FileList;
